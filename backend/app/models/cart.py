from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
