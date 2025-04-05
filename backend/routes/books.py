from fastapi import APIRouter , HTTPException ,UploadFile, File, Form , Query
import os
from fastapi.responses import JSONResponse
from typing import List, Dict , Any
from controllers.connection import connect_db
import json
from src.processor import BookistProcessor
from src.utils.file_operations import load_json_file
from typing import List

router = APIRouter()

@router.get("/books", response_model=List[Dict[str, Any]])
def get_all_books():
    """Fetches all book titles, authors, thumbnails, descriptions, and categories."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT title, author, thumbnail, description, category FROM book")
        books = cur.fetchall()
        cur.close()
        conn.close()

        book_list = []
        for title, author, thumbnail, description, category in books:
            if isinstance(category, list):  # PostgreSQL may return a list
                category = ", ".join(category)  # Convert list to a comma-separated string
            book_list.append({
                "title": title,
                "author": author,
                "thumbnail": thumbnail,
                "description": description,
                "category": category
            })

        return book_list
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")



@router.get("/book/{title}/content_keys", response_model=List[Dict[str, str]])
def get_content_keys(title: str):
    """Fetches the keys of the content property for a given book title."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT content FROM book WHERE title = %s;", (title,))
        book_data = cur.fetchone()
        cur.close()
        conn.close()
        if not book_data:
            raise HTTPException(status_code=404, detail="Book not found")

        content = book_data[0]  # Assuming content is stored as JSONB in PostgreSQL
        result = [
            {
                "name": key,
                "icon": value.get("icon", ""),
                "description": value.get("description", ""),
                "steps_count":str(len(value.get("steps")))
            }
            for key, value in content.items()
        ]
        return result
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")


@router.get("/book/{title}/{key}")
def get_content_values(title: str, key: str):
    """Fetches only steps and description of a given key within the content property for a given book title."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT content FROM book WHERE title = %s;", (title,))
        book_data = cur.fetchone()
        cur.close()
        conn.close()
        print(book_data[0])
        if book_data:
            content = book_data[0]
            if key in content:
                steps = content[key]['steps']
                return [{"step": step["step"], "description": step["description"]} for step in steps]
            else:
                raise HTTPException(status_code=404, detail="Key not found in content")
        else:
            raise HTTPException(status_code=404, detail="Book not found")
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
@router.get("/book/{title}/{category}/{step}")
def get_step_details(title: str, category: str, step: str):
    """Fetches full details of a specific step within a category for a given book."""
    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT content FROM book WHERE title = %s;", (title,))
        book_data = cur.fetchone()
        cur.close()
        conn.close()

        if book_data:
            content = book_data[0]
            if category in content:
                steps = content[category]['steps']
                for s in steps:
                    if s["step"] == step:
                        return s  # Return full details of the step
                raise HTTPException(status_code=404, detail="Step not found")
            else:
                raise HTTPException(status_code=404, detail="Category not found in content")
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
                "INSERT INTO book (title, author, description, thumbnail,category, content) VALUES (%s, %s,%s, %s, %s, %s);",
                (
                    book_data["Title"],
                    book_data["Author"],
                    book_data["Description"],
                    book_data["Thumbnail"],
                    book_data["Category"],
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
    category_list = category.split(",")  # Convert string to list
    category = [c.strip() for c in category_list]  # Remove extra spaces
    with open(pdf_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    processor = BookistProcessor(
        pdf_path, book_title, author, description, cover_url, category
    )
    book_data = processor.process()

    return create_book(book_data)

@router.get("/get-categories")
def extract_json_keys():
    """Extracts all keys from a JSON file."""
    try:
        content = load_json_file("","categories.json",{})
        keys = list(content.keys())
        return keys
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
