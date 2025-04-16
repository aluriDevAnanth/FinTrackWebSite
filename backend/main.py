from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from utils.logger import logger
from dotenv import load_dotenv
from middleware.jwt_auth import JWTAuthMiddleware

from routes.user import router as user_router
from routes.income import router as income_router
from routes.auth import router as auth_router
from routes.expense import router as expense_router
from routes.transaction import router as transaction_router
from routes.budget import router as budget_router
from routes.savings_goals import router as savings_goals_router

load_dotenv()

app = FastAPI()
logger.info("qwefgh")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.add_middleware(JWTAuthMiddleware)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(income_router)
app.include_router(expense_router)
app.include_router(transaction_router)
app.include_router(budget_router)
app.include_router(savings_goals_router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
