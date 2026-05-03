from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cart import CartItem
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.post("/{user_id}", response_model=CartItemResponse)
def create_cart_item(user_id: int, item: CartItemCreate, db: Session = Depends(get_db)):
    new_item = CartItem(name=item.name, price=item.price, user_id=user_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get("/{user_id}", response_model=List[CartItemResponse])
def get_cart_items(user_id: int, db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    return items


@router.put("/{user_id}/{item_id}", response_model=CartItemResponse)
def update_cart_item(user_id: int, item_id: int, item: CartItemUpdate, db: Session = Depends(get_db)):
    existing_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user_id).first()

    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")

    existing_item.name = item.name
    existing_item.price = item.price
    db.commit()
    db.refresh(existing_item)
    return existing_item


@router.delete("/{user_id}/{item_id}")
def delete_cart_item(user_id: int, item_id: int, db: Session = Depends(get_db)):
    existing_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user_id).first()

    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(existing_item)
    db.commit()
    return {"message": "Item deleted successfully"}
