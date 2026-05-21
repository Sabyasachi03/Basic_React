from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.master import CountryMaster, DistrictMaster, StateMaster
from app.schemas.master import (
    CountryMasterCreate,
    CountryMasterResponse,
    CountryMasterUpdate,
    DistrictMasterCreate,
    DistrictMasterGetResponse,
    DistrictMasterResponse,
    DistrictMasterUpdate,
    StateMasterCreate,
    StateMasterGetResponse,
    StateMasterResponse,
    StateMasterUpdate,
)

router = APIRouter(prefix="/masters", tags=["Masters"])


@router.get("/countries", response_model=list[CountryMasterResponse])
def list_countries(db: Session = Depends(get_db)):
    return (
        db.query(CountryMaster)
        .filter(CountryMaster.is_delete.is_(False))
        .order_by(CountryMaster.id.desc())
        .all()
    )


@router.post("/countries", response_model=CountryMasterResponse)
def create_country(payload: CountryMasterCreate, db: Session = Depends(get_db)):
    item = CountryMaster(
        name=payload.name.strip(),
        code=payload.code.strip(),
        pm_name=payload.pm_name.strip(),
        is_delete=False,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/countries/{country_id}", response_model=CountryMasterResponse)
def update_country(country_id: int, payload: CountryMasterUpdate, db: Session = Depends(get_db)):
    item = (
        db.query(CountryMaster)
        .filter(CountryMaster.id == country_id, CountryMaster.is_delete.is_(False))
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Country not found")

    item.name = payload.name.strip()
    item.code = payload.code.strip()
    item.pm_name = payload.pm_name.strip()
    db.commit()
    db.refresh(item)
    return item


@router.delete("/countries/{country_id}", response_model=CountryMasterResponse)
def soft_delete_country(country_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(CountryMaster)
        .filter(CountryMaster.id == country_id, CountryMaster.is_delete.is_(False))
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Country not found")

    item.is_delete = True
    db.commit()
    db.refresh(item)
    return item


@router.get("/states", response_model=list[StateMasterResponse])
def list_states(country_id: int | None = Query(default=None), db: Session = Depends(get_db)):
    query = (
        db.query(StateMaster)
        .join(CountryMaster, CountryMaster.id == StateMaster.country_id)
        .filter(StateMaster.is_delete.is_(False), CountryMaster.is_delete.is_(False))
    )

    if country_id is not None:
        query = query.filter(StateMaster.country_id == country_id)

    return query.order_by(StateMaster.id.desc()).all()


@router.get("/states/{state_id}", response_model=StateMasterGetResponse)
def get_state(state_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(StateMaster)
        .filter(StateMaster.id == state_id, StateMaster.is_delete.is_(False))
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="State not found")
    return item


@router.post("/states", response_model=StateMasterGetResponse)
def create_state(payload: StateMasterCreate, db: Session = Depends(get_db)):
    country = (
        db.query(CountryMaster)
        .filter(CountryMaster.id == payload.country_id, CountryMaster.is_delete.is_(False))
        .first()
    )
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")

    item = StateMaster(
        name=payload.name.strip(),
        code=payload.code.strip(),
        cm_name=payload.cm_name.strip(),
        country_id=payload.country_id,
        is_delete=False,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/states/{state_id}", response_model=StateMasterGetResponse)
def update_state(state_id: int, payload: StateMasterUpdate, db: Session = Depends(get_db)):
    item = (
        db.query(StateMaster)
        .filter(StateMaster.id == state_id, StateMaster.is_delete.is_(False))
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="State not found")

    country = (
        db.query(CountryMaster)
        .filter(CountryMaster.id == payload.country_id, CountryMaster.is_delete.is_(False))
        .first()
    )
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")

    item.name = payload.name.strip()
    item.code = payload.code.strip()
    item.cm_name = payload.cm_name.strip()
    item.country_id = payload.country_id
    db.commit()
    db.refresh(item)
    return item


@router.delete("/states/{state_id}", response_model=StateMasterGetResponse)
def soft_delete_state(state_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(StateMaster)
        .filter(StateMaster.id == state_id, StateMaster.is_delete.is_(False))
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="State not found")

    item.is_delete = True
    db.commit()
    db.refresh(item)
    return item


@router.get("/districts", response_model=list[DistrictMasterResponse])
def list_districts(db: Session = Depends(get_db)):
    rows = (
        db.query(
            DistrictMaster,
            CountryMaster.name.label("country_name"),
            StateMaster.name.label("state_name"),
        )
        .join(CountryMaster, CountryMaster.id == DistrictMaster.country_id)
        .join(StateMaster, StateMaster.id == DistrictMaster.state_id)
        .filter(
            DistrictMaster.is_delete.is_(False),
            CountryMaster.is_delete.is_(False),
            StateMaster.is_delete.is_(False),
        )
        .order_by(DistrictMaster.id.desc())
        .all()
    )

    return [
        {
            "id": district.id,
            "name": district.name,
            "code": district.code,
            "dm_name": district.dm_name,
            "country_id": district.country_id,
            "country_name": country_name,
            "state_id": district.state_id,
            "state_name": state_name,
            "is_delete": district.is_delete,
        }
        for district, country_name, state_name in rows
    ]


@router.get("/districts/{district_id}", response_model=DistrictMasterGetResponse)
def get_district(district_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(DistrictMaster)
        .filter(DistrictMaster.id == district_id, DistrictMaster.is_delete.is_(False))
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="District not found")
    return item


@router.post("/districts", response_model=DistrictMasterGetResponse)
def create_district(payload: DistrictMasterCreate, db: Session = Depends(get_db)):
    country = (
        db.query(CountryMaster)
        .filter(CountryMaster.id == payload.country_id, CountryMaster.is_delete.is_(False))
        .first()
    )
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")

    state = (
        db.query(StateMaster)
        .filter(
            StateMaster.id == payload.state_id,
            StateMaster.country_id == payload.country_id,
            StateMaster.is_delete.is_(False),
        )
        .first()
    )
    if not state:
        raise HTTPException(status_code=400, detail="Invalid state id for selected country")

    item = DistrictMaster(
        name=payload.name.strip(),
        code=payload.code.strip(),
        dm_name=payload.dm_name.strip(),
        country_id=payload.country_id,
        state_id=payload.state_id,
        is_delete=False,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/districts/{district_id}", response_model=DistrictMasterGetResponse)
def update_district(district_id: int, payload: DistrictMasterUpdate, db: Session = Depends(get_db)):
    item = (
        db.query(DistrictMaster)
        .filter(DistrictMaster.id == district_id, DistrictMaster.is_delete.is_(False))
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="District not found")

    country = (
        db.query(CountryMaster)
        .filter(CountryMaster.id == payload.country_id, CountryMaster.is_delete.is_(False))
        .first()
    )
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")

    state = (
        db.query(StateMaster)
        .filter(
            StateMaster.id == payload.state_id,
            StateMaster.country_id == payload.country_id,
            StateMaster.is_delete.is_(False),
        )
        .first()
    )
    if not state:
        raise HTTPException(status_code=400, detail="Invalid state id for selected country")

    item.name = payload.name.strip()
    item.code = payload.code.strip()
    item.dm_name = payload.dm_name.strip()
    item.country_id = payload.country_id
    item.state_id = payload.state_id
    db.commit()
    db.refresh(item)
    return item


@router.delete("/districts/{district_id}", response_model=DistrictMasterGetResponse)
def soft_delete_district(district_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(DistrictMaster)
        .filter(DistrictMaster.id == district_id, DistrictMaster.is_delete.is_(False))
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="District not found")

    item.is_delete = True
    db.commit()
    db.refresh(item)
    return item
