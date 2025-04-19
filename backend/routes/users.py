from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel
from typing import Optional, List
from passlib.hash import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from controllers.connection import connect_db

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter()

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfile(BaseModel):
    username: str
    email: str
    favorites: List[str] = []


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(conn, email: str):
    cur = conn.cursor()
    cur.execute("SELECT id, username, email, password FROM users WHERE email = %s", (email,))
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
        cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (user.username, user.email, hashed_pw))
        conn.commit()
        cur.close()
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()


@router.post("/login", response_model=Token)
def login_user(user: UserLogin):
    conn = connect_db()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    db_user = get_user_by_email(conn, user.email)
    conn.close()

    if not db_user or not bcrypt.verify(user.password, db_user[3]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}


@router.get("/profile/{email}", response_model=UserProfile)
def get_profile(email: str):
    conn = connect_db()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cur = conn.cursor()
        cur.execute("SELECT username, email FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.execute("SELECT item FROM favorites WHERE user_email = %s", (email,))
        favs = [row[0] for row in cur.fetchall()]
        cur.close()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {"username": user[0], "email": user[1], "favorites": favs}
    finally:
        conn.close()


@router.post("/favorites/add")
def add_favorite(email: str = Body(...), item: str = Body(...)):
    conn = connect_db()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO favorites (user_email, item) VALUES (%s, %s)", (email, item))
        conn.commit()
        cur.close()
        return {"message": "Item added to favorites"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()


@router.post("/favorites/remove")
def remove_favorite(email: str = Body(...), item: str = Body(...)):
    conn = connect_db()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM favorites WHERE user_email = %s AND item = %s", (email, item))
        conn.commit()
        cur.close()
        return {"message": "Item removed from favorites"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
