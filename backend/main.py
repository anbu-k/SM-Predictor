from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import predict, stock_api  # Include stock_api
from backend.services.fetch_stock import get_stock_data

app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include API routes
app.include_router(predict.router, prefix="/api")
app.include_router(stock_api.router, prefix="/api")  # ✅ Include stock API route

@app.get("/")
def root():
    return {"message": "Welcome to the Stock Prediction API"}
