from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db, close_driver
from app.auth.router import router as auth_router
from app.data.router import router as data_router
from app.analysis.router import router as analysis_router
from app.ai.router import router as ai_router
from app.menu.router import router as menu_router
from app.actions.router import router as actions_router
from app.notifications.router import router as notifications_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_driver()


app = FastAPI(
    title="CafePulse AI",
    description="AI-powered business intelligence for café owners",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(data_router)
app.include_router(analysis_router)
app.include_router(ai_router)
app.include_router(menu_router)
app.include_router(actions_router)
app.include_router(notifications_router)


@app.get("/")
async def root():
    return {"message": "CafePulse AI Backend is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
