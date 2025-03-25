from backend.controllers.connection import connect_db
from fastapi import HTTPException

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