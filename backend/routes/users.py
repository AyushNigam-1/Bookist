from fastapi import APIRouter, HTTPException, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Union
from passlib.hash import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from controllers.connection import connect_db

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter()


class UserRegister(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserProfile(BaseModel):
    name: str
    email: str
    favourite_books: List[int]
    favourite_insights: List[Union[dict, str]]


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(conn, email: str):
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, password, favourite_insights, favourite_books FROM \"user\" WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    return user


@router.post("/register")
def register_user(user: UserRegister):
    conn = connect_db()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    hashed_pw = bcrypt.hash(user.password)
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO \"user\" (name, email, password) VALUES (%s, %s, %s)",
            (user.name, user.email, hashed_pw)
        )
        conn.commit()
        cur.close()
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@router.post("/login")
def login_user(user: UserLogin, response: Response):
    conn = connect_db()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    db_user = get_user_by_email(conn, user.email)
    conn.close()

    if not db_user or not bcrypt.verify(user.password, db_user[3]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    response = JSONResponse(
        content={"access_token": token, "token_type": "bearer"},
        status_code=status.HTTP_200_OK
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=False,
        secure=False,
        samesite="Lax"
    )
    return response


@router.get("/profile/{email}", response_model=UserProfile)
def get_profile(email: str):
    conn = connect_db()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cur = conn.cursor()
        cur.execute("SELECT name, email, favourite_insights, favourite_books FROM \"user\" WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "name": user[0],
            "email": user[1],
            "favourite_insights": user[2],
            "favourite_books": user[3],
        }
    finally:
        conn.close()


# @router.post("/favourite/book/add")
# def add_fav_book(email: str = Body(...), book_id: int = Body(...)):
#     conn = connect_db()
#     try:
#         cur = conn.cursor()
#         cur.execute("""
#             UPDATE "user"
#             SET favourite_books = array_append(favourite_books, %s)
#             WHERE email = %s AND NOT (%s = ANY(favourite_books))
#         """, (book_id, email, book_id))
#         conn.commit()
#         cur.close()
#         return {"message": "Book added to favourites"}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     finally:
#         conn.close()


# @router.post("/favourite/book/remove")
# def remove_fav_book(email: str = Body(...), book_id: int = Body(...)):
#     conn = connect_db()
#     try:
#         cur = conn.cursor()
#         cur.execute("""
#             UPDATE "user"
#             SET favourite_books = array_remove(favourite_books, %s)
#             WHERE email = %s
#         """, (book_id, email))
#         conn.commit()
#         cur.close()
#         return {"message": "Book removed from favourites"}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     finally:
#         conn.close()


# @router.post("/favourite/insight/add")
# def add_fav_insight(user_id: int = Body(...), insight: Union[dict, str] = Body(...)):
#     conn = connect_db()
#     if not conn:
#         raise HTTPException(status_code=500, detail="Database connection failed")

#     try:
#         if isinstance(insight, str):
#             insight = json.loads(insight)

#         category = insight["category"]
#         insight_id = insight["id"]

#         cur = conn.cursor()

#         cur.execute("""
#             UPDATE "user"
#             SET favourite_insights = jsonb_set(
#                 favourite_insights,
#                 %s,
#                 COALESCE(
#                     (favourite_insights->%s)::jsonb || to_jsonb(%s::text),
#                     to_jsonb(ARRAY[%s])
#                 ),
#                 true
#             )
#             WHERE id = %s
#         """, (
#             '{' + category + '}',
#             category,
#             insight_id,
#             insight_id,
#             user_id
#         ))

#         conn.commit()
#         cur.close()
#         return {"message": "Insight added to favourites"}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     finally:
#         conn.close()


# @router.post("/favourite/insight/remove")
# def remove_fav_insight(email: str = Body(...), insight: Union[dict, str] = Body(...)):
#     conn = connect_db()
#     try:
#         cur = conn.cursor()
#         cur.execute("""
#             UPDATE "user"
#             SET favourite_insights = (
#                 SELECT jsonb_agg(elem)
#                 FROM jsonb_array_elements(favourite_insights) AS elem
#                 WHERE elem != %s::jsonb
#             )
#             WHERE email = %s
#         """, (json.dumps(insight), email))
#         conn.commit()
#         cur.close()
#         return {"message": "Insight removed from favourites"}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     finally:
#         conn.close()
