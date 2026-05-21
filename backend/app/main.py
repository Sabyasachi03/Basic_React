from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import user, cart, dashboard, master
from app.routes.auth import router as auth_router
from app.routes.cart import router as cart_router
from app.routes.dashboard import router as dashboard_router
from app.routes.master import router as master_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cart App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(cart_router)
app.include_router(dashboard_router)
app.include_router(master_router)


@app.get("/")
def root():
    return {"message": "Cart App API is running"}