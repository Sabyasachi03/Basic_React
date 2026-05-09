from datetime import datetime
from pydantic import BaseModel


class CountryCreate(BaseModel):
    name: str


class CountryUpdate(BaseModel):
    name: str


class CountryResponse(BaseModel):
    id: int
    name: str
    user_id: int

    class Config:
        from_attributes = True


class CartCreate(BaseModel):
    cart_name: str
    budget: float


class CartUpdate(BaseModel):
    cart_name: str
    budget: float


class CartResponse(BaseModel):
    id: int
    cart_name: str
    budget: float
    user_id: int
    country_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ActivityResponse(BaseModel):
    id: int
    method: str
    endpoint: str
    request_payload: str | None
    response_body: str | None
    status: str
    user_id: int
    country_id: int | None
    timestamp: datetime

    class Config:
        from_attributes = True