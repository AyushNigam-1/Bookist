import psycopg2
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Dict
import json

app = FastAPI()

dbname = "postgres"
user = "ayush"
password = "AyushNigam"
host = "localhost"
port = "5432"


def connect_db():
    """Connects to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        print(conn)
        return conn
    except psycopg2.DatabaseError as e:
        print(f"Database connection error: {e}")
        return None


@app.get("/books", response_model=List[Dict[str, str]])
def get_all_books():
    """Fetches all book titles, authors, and thumbnails."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT title, author, thumbnail FROM book")
        books = cur.fetchall()
        cur.close()
        conn.close()
        book_list = [{"title": title, "author": author, "thumbnail": thumbnail} for title, author, thumbnail in books]
        return book_list
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")


@app.get("/book/{title}/content_keys", response_model=List[str])
def get_content_keys(title: str):
    """Fetches the keys of the content property for a given book title."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT content FROM books_jsonb WHERE title = %s;", (title,))
        book_data = cur.fetchone()
        cur.close()
        conn.close()
        if book_data:
            content = book_data[0]  # content is jsonb type.
            keys = list(content.keys())
            return keys
        else:
            raise HTTPException(status_code=404, detail="Book not found")
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")


@app.get("/book/{title}/{key}")
def get_content_values(title: str, key: str):
    """Fetches the values of a given key within the content property for a given book title."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT content FROM books_jsonb WHERE title = %s;", (title,))
        book_data = cur.fetchone()
        cur.close()
        conn.close()
        if book_data:
            content = book_data[0]
            if key in content:
                return content[key]
            else:
                raise HTTPException(status_code=404, detail="Key not found in content")
        else:
            raise HTTPException(status_code=404, detail="Book not found")
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")

@app.post("/books/")
def create_book(book_data: Dict):
    """Inserts book data including content as JSONB."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        try:
            cur.execute(
                "INSERT INTO books_jsonb (title, author, thumbnail, content) VALUES (%s, %s, %s, %s);",
                (
                    book_data["title"],
                    book_data["Author"],
                    book_data["Thumbnail"],
                    json.dumps(book_data["content"]),
                ),
            )
            conn.commit()
            return JSONResponse(content={"message": "Book created successfully"}, status_code=201)
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {e}")
        finally:
            cur.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")