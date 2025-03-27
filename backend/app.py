import uvicorn
from fastapi import FastAPI
from routes.books import router as books_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://192.168.39.43:3000"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(books_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)