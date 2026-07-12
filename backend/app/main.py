from contextlib import asynccontextmanager
from app.routes.dashboard import router as dashboard_router
from app.routes.whatsapp import router as whatsapp_router
from app.routes.chatbots import router as chatbots_router
from app.routes.documents import router as documents_router
from app.routes.conversations import router as conversations_router
from app.routes.analytics import router as analytics_router
from app.routes.billing import router as billing_router
from app.routes.settings import router as settings_router
from fastapi import FastAPI
from app.routes.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.logger import setup_logger
from app.dependencies.database_conn import connect_db,close_db
setup_logger()
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()
app= FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router)
app.include_router(whatsapp_router)
app.include_router(dashboard_router)
app.include_router(chatbots_router)
app.include_router(documents_router)
app.include_router(conversations_router)
app.include_router(analytics_router)
app.include_router(billing_router)
app.include_router(settings_router)