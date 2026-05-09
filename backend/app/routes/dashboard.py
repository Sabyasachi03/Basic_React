import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.dashboard import ActivityLog, Cart, Country
from app.schemas.dashboard import (
    ActivityResponse,
    CartCreate,
    CartResponse,
    CartUpdate,
    CountryCreate,
    CountryResponse,
    CountryUpdate,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def write_activity(
    db: Session,
    *,
    method: str,
    endpoint: str,
    user_id: int,
    country_id: int | None,
    request_payload=None,
    response_body=None,
    status: str = "Success",
):
    activity = ActivityLog(
        method=method,
        endpoint=endpoint,
        request_payload=json.dumps(request_payload) if request_payload is not None else None,
        response_body=json.dumps(response_body) if response_body is not None else None,
        status=status,
        user_id=user_id,
        country_id=country_id,
    )
    db.add(activity)


@router.get("/{user_id}/countries", response_model=list[CountryResponse])
def list_countries(user_id: int, db: Session = Depends(get_db)):
    return db.query(Country).filter(Country.user_id == user_id).order_by(Country.id.asc()).all()


@router.post("/{user_id}/countries", response_model=CountryResponse)
def create_country(user_id: int, payload: CountryCreate, db: Session = Depends(get_db)):
    exists = (
        db.query(Country)
        .filter(Country.user_id == user_id, Country.name.ilike(payload.name.strip()))
        .first()
    )
    if exists:
        raise HTTPException(status_code=400, detail="Country already exists")

    country = Country(name=payload.name.strip(), user_id=user_id)
    db.add(country)
    db.commit()
    db.refresh(country)
    return country


@router.put("/{user_id}/countries/{country_id}", response_model=CountryResponse)
def update_country(user_id: int, country_id: int, payload: CountryUpdate, db: Session = Depends(get_db)):
    country = db.query(Country).filter(Country.id == country_id, Country.user_id == user_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")

    country.name = payload.name.strip()
    db.commit()
    db.refresh(country)
    return country


@router.delete("/{user_id}/countries/{country_id}")
def delete_country(user_id: int, country_id: int, db: Session = Depends(get_db)):
    country = db.query(Country).filter(Country.id == country_id, Country.user_id == user_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")

    db.query(Cart).filter(Cart.user_id == user_id, Cart.country_id == country_id).delete()
    db.query(ActivityLog).filter(ActivityLog.user_id == user_id, ActivityLog.country_id == country_id).delete()
    db.delete(country)
    db.commit()
    return {"message": "Country deleted"}


@router.get("/{user_id}/countries/{country_id}/carts", response_model=list[CartResponse])
def list_carts(user_id: int, country_id: int, db: Session = Depends(get_db)):
    carts = (
        db.query(Cart)
        .filter(Cart.user_id == user_id, Cart.country_id == country_id)
        .order_by(Cart.created_at.desc())
        .all()
    )
    write_activity(db, method="GET", endpoint="/cart", user_id=user_id, country_id=country_id, response_body=[{"id": c.id} for c in carts])
    db.commit()
    return carts


@router.post("/{user_id}/countries/{country_id}/carts", response_model=CartResponse)
def create_cart(user_id: int, country_id: int, payload: CartCreate, db: Session = Depends(get_db)):
    country = db.query(Country).filter(Country.id == country_id, Country.user_id == user_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")

    cart = Cart(cart_name=payload.cart_name.strip(), budget=payload.budget, user_id=user_id, country_id=country_id)
    db.add(cart)
    db.flush()

    write_activity(
        db,
        method="POST",
        endpoint="/cart",
        user_id=user_id,
        country_id=country_id,
        request_payload=payload.model_dump(),
        response_body={"id": cart.id, "cart_name": cart.cart_name},
    )
    db.commit()
    db.refresh(cart)
    return cart


@router.get("/{user_id}/countries/{country_id}/carts/{cart_id}", response_model=CartResponse)
def get_cart(user_id: int, country_id: int, cart_id: int, db: Session = Depends(get_db)):
    cart = (
        db.query(Cart)
        .filter(Cart.id == cart_id, Cart.user_id == user_id, Cart.country_id == country_id)
        .first()
    )
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    write_activity(db, method="GET", endpoint=f"/cart/{cart_id}", user_id=user_id, country_id=country_id, response_body={"id": cart.id, "cart_name": cart.cart_name})
    db.commit()
    return cart


@router.put("/{user_id}/countries/{country_id}/carts/{cart_id}", response_model=CartResponse)
def update_cart(user_id: int, country_id: int, cart_id: int, payload: CartUpdate, db: Session = Depends(get_db)):
    cart = (
        db.query(Cart)
        .filter(Cart.id == cart_id, Cart.user_id == user_id, Cart.country_id == country_id)
        .first()
    )
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart.cart_name = payload.cart_name.strip()
    cart.budget = payload.budget
    db.flush()

    write_activity(
        db,
        method="PUT",
        endpoint=f"/cart/{cart_id}",
        user_id=user_id,
        country_id=country_id,
        request_payload=payload.model_dump(),
        response_body={"updated": True, "id": cart.id},
    )

    db.commit()
    db.refresh(cart)
    return cart


@router.delete("/{user_id}/countries/{country_id}/carts/{cart_id}")
def delete_cart(user_id: int, country_id: int, cart_id: int, db: Session = Depends(get_db)):
    cart = (
        db.query(Cart)
        .filter(Cart.id == cart_id, Cart.user_id == user_id, Cart.country_id == country_id)
        .first()
    )
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    db.delete(cart)
    write_activity(
        db,
        method="DELETE",
        endpoint=f"/cart/{cart_id}",
        user_id=user_id,
        country_id=country_id,
        response_body={"deleted": True, "id": cart_id},
    )
    db.commit()
    return {"message": "Cart deleted"}


@router.get("/{user_id}/activities", response_model=list[ActivityResponse])
def list_activities(user_id: int, country_id: int | None = Query(default=None), db: Session = Depends(get_db)):
    query = db.query(ActivityLog).filter(ActivityLog.user_id == user_id)
    if country_id is not None:
        query = query.filter(ActivityLog.country_id == country_id)
    return query.order_by(ActivityLog.timestamp.desc()).all()


@router.delete("/{user_id}/activities")
def clear_activities(user_id: int, country_id: int | None = Query(default=None), db: Session = Depends(get_db)):
    query = db.query(ActivityLog).filter(ActivityLog.user_id == user_id)
    if country_id is not None:
        query = query.filter(ActivityLog.country_id == country_id)
    query.delete()
    db.commit()
    return {"message": "Activities cleared"}