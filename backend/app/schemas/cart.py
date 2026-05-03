from pydantic import BaseModel


class CartItemCreate(BaseModel):
    name: str
    price: float


class CartItemUpdate(BaseModel):
    name: str
    price: float


class CartItemResponse(BaseModel):
    id: int
    name: str
    price: float
    user_id: int

    class Config:
        from_attributes = True
