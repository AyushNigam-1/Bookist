from fastapi import APIRouter , HTTPException ,UploadFile, File, Form
import os
from fastapi.responses import JSONResponse
from typing import List, Dict
from controllers.connection import connect_db
import json
from src.processor import BookistProcessor

router = APIRouter()

@router.get("/books", response_model=List[Dict[str, str]])
def get_all_books():
    """Fetches all book titles, authors, and thumbnails."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT title, author, thumbnail , description FROM book")
        books = cur.fetchall()
        cur.close()
        conn.close()
        book_list = [{"title": title, "author": author, "thumbnail": thumbnail , "description":description} for title, author, thumbnail , description in books]
        return book_list
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")


@router.get("/book/{title}/content_keys", response_model=List[str])
def get_content_keys(title: str):
    """Fetches the keys of the content property for a given book title."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT content FROM book WHERE title = %s;", (title,))
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


@router.get("/book/{title}/{key}")
def get_content_values(title: str, key: str):
    """Fetches the values of a given key within the content property for a given book title."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT content FROM book WHERE title = %s;", (title,))
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

@router.post("/books/")
def create_book(book_data: Dict):
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        try:
            cur.execute(
                "INSERT INTO book (title, author, description, thumbnail, content) VALUES (%s, %s, %s, %s, %s);",
                (
                    book_data["Title"],
                    book_data["Author"],
                    book_data["Description"],
                    book_data["Thumbnail"],
                    json.dumps(book_data["Content"]),
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

@router.post("/process-book")
def process_book(
    file: UploadFile = File(...),
    book_title: str = Form(..., description="Title of the book"),
    author: str = Form(..., description="Author of the book"),
    description: str = Form(..., description="Short description of the book"),
    cover_url: str = Form(..., description="Cover image URL"),
    category: str = Form(..., description="Category of the book")
):
    root_folder = os.getcwd()
    pdf_path = os.path.join(root_folder, file.filename)
    
    with open(pdf_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    processor = BookistProcessor(
        pdf_path, book_title, author, description, cover_url, category
    )
    book_data = processor.process()

    return create_book(book_data)