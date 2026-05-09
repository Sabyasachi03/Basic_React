from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func
from app.database import Base


class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)


class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    cart_name = Column(String, nullable=False)
    budget = Column(Float, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    method = Column(String, nullable=False)
    endpoint = Column(String, nullable=False)
    request_payload = Column(Text, nullable=True)
    response_body = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="Success")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)