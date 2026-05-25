from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.master import CountryMaster, StateMaster, DistrictMaster, CityMaster
from app.schemas.master import (
    CountryMasterCreate,
    CountryMasterUpdate,
    CountryMasterResponse,
    StateMasterCreate,
    StateMasterUpdate,
    StateMasterResponse,
    DistrictMasterCreate,
    DistrictMasterUpdate,
    DistrictMasterResponse,
    CityMasterCreate,
    CityMasterUpdate,
    CityMasterResponse,
)

router = APIRouter(prefix="/masters", tags=["Masters"])


def _soft_query(model, db: Session):
    return db.query(model).filter(model.is_delete.is_(False))


@router.get("/countries", response_model=list[CountryMasterResponse])
def list_countries(db: Session = Depends(get_db)):
    return _soft_query(CountryMaster, db).order_by(CountryMaster.id.desc()).all()


@router.post("/countries", response_model=CountryMasterResponse)
def create_country(payload: CountryMasterCreate, db: Session = Depends(get_db)):
    item = CountryMaster(name=payload.name.strip(), code=payload.code.strip(), pm_name=payload.pm_name.strip(), is_delete=False)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/countries/{country_id}", response_model=CountryMasterResponse)
def update_country(country_id: int, payload: CountryMasterUpdate, db: Session = Depends(get_db)):
    item = _soft_query(CountryMaster, db).filter(CountryMaster.id == country_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Country not found")
    item.name = payload.name.strip()
    item.code = payload.code.strip()
    item.pm_name = payload.pm_name.strip()
    db.commit()
    db.refresh(item)
    return item


@router.delete("/countries/{country_id}", response_model=CountryMasterResponse)
def delete_country(country_id: int, db: Session = Depends(get_db)):
    item = _soft_query(CountryMaster, db).filter(CountryMaster.id == country_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Country not found")
    item.is_delete = True
    db.commit()
    db.refresh(item)
    return item


@router.get("/states", response_model=list[StateMasterResponse])
def list_states(country_id: int | None = Query(default=None), db: Session = Depends(get_db)):
    q = _soft_query(StateMaster, db).options(joinedload(StateMaster.country))
    if country_id:
        q = q.filter(StateMaster.country_id == country_id)
    return q.order_by(StateMaster.id.desc()).all()


@router.get("/states/{state_id}", response_model=StateMasterResponse)
def get_state(state_id: int, db: Session = Depends(get_db)):
    item = _soft_query(StateMaster, db).options(joinedload(StateMaster.country)).filter(StateMaster.id == state_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="State not found")
    return item


@router.post("/states", response_model=StateMasterResponse)
def create_state(payload: StateMasterCreate, db: Session = Depends(get_db)):
    country = _soft_query(CountryMaster, db).filter(CountryMaster.id == payload.country_id).first()
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")
    item = StateMaster(name=payload.name.strip(), code=payload.code.strip(), cm_name=payload.cm_name.strip(), country_id=payload.country_id, is_delete=False)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/states/{state_id}", response_model=StateMasterResponse)
def update_state(state_id: int, payload: StateMasterUpdate, db: Session = Depends(get_db)):
    item = _soft_query(StateMaster, db).filter(StateMaster.id == state_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="State not found")
    country = _soft_query(CountryMaster, db).filter(CountryMaster.id == payload.country_id).first()
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")
    item.name = payload.name.strip()
    item.code = payload.code.strip()
    item.cm_name = payload.cm_name.strip()
    item.country_id = payload.country_id
    db.commit()
    db.refresh(item)
    return item


@router.delete("/states/{state_id}", response_model=StateMasterResponse)
def delete_state(state_id: int, db: Session = Depends(get_db)):
    item = _soft_query(StateMaster, db).filter(StateMaster.id == state_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="State not found")
    item.is_delete = True
    db.commit()
    db.refresh(item)
    return item


@router.get("/districts", response_model=list[DistrictMasterResponse])
def list_districts(country_id: int | None = Query(default=None), state_id: int | None = Query(default=None), db: Session = Depends(get_db)):
    q = _soft_query(DistrictMaster, db).options(
        joinedload(DistrictMaster.country),
        joinedload(DistrictMaster.state)
    )
    if country_id:
        q = q.filter(DistrictMaster.country_id == country_id)
    if state_id:
        q = q.filter(DistrictMaster.state_id == state_id)
    return q.order_by(DistrictMaster.id.desc()).all()


@router.get("/districts/{district_id}", response_model=DistrictMasterResponse)
def get_district(district_id: int, db: Session = Depends(get_db)):
    item = _soft_query(DistrictMaster, db).options(
        joinedload(DistrictMaster.country),
        joinedload(DistrictMaster.state)
    ).filter(DistrictMaster.id == district_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="District not found")
    return item


@router.post("/districts", response_model=DistrictMasterResponse)
def create_district(payload: DistrictMasterCreate, db: Session = Depends(get_db)):
    country = _soft_query(CountryMaster, db).filter(CountryMaster.id == payload.country_id).first()
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")
    state = _soft_query(StateMaster, db).filter(StateMaster.id == payload.state_id, StateMaster.country_id == payload.country_id).first()
    if not state:
        raise HTTPException(status_code=400, detail="Invalid state id for selected country")
    item = DistrictMaster(name=payload.name.strip(), code=payload.code.strip(), dm_name=payload.dm_name.strip(), country_id=payload.country_id, state_id=payload.state_id, is_delete=False)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/districts/{district_id}", response_model=DistrictMasterResponse)
def update_district(district_id: int, payload: DistrictMasterUpdate, db: Session = Depends(get_db)):
    item = _soft_query(DistrictMaster, db).filter(DistrictMaster.id == district_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="District not found")
    country = _soft_query(CountryMaster, db).filter(CountryMaster.id == payload.country_id).first()
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")
    state = _soft_query(StateMaster, db).filter(StateMaster.id == payload.state_id, StateMaster.country_id == payload.country_id).first()
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


@router.delete("/districts/{district_id}", response_model=DistrictMasterResponse)
def delete_district(district_id: int, db: Session = Depends(get_db)):
    item = _soft_query(DistrictMaster, db).filter(DistrictMaster.id == district_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="District not found")
    item.is_delete = True
    db.commit()
    db.refresh(item)
    return item


@router.get("/cities", response_model=list[CityMasterResponse])
def list_cities(country_id: int | None = Query(default=None), state_id: int | None = Query(default=None), district_id: int | None = Query(default=None), db: Session = Depends(get_db)):
    q = _soft_query(CityMaster, db).options(
        joinedload(CityMaster.country),
        joinedload(CityMaster.state),
        joinedload(CityMaster.district)
    )
    if country_id:
        q = q.filter(CityMaster.country_id == country_id)
    if state_id:
        q = q.filter(CityMaster.state_id == state_id)
    if district_id:
        q = q.filter(CityMaster.district_id == district_id)
    return q.order_by(CityMaster.id.desc()).all()


@router.get("/cities/{city_id}", response_model=CityMasterResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    item = _soft_query(CityMaster, db).options(
        joinedload(CityMaster.country),
        joinedload(CityMaster.state),
        joinedload(CityMaster.district)
    ).filter(CityMaster.id == city_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="City not found")
    return item


@router.post("/cities", response_model=CityMasterResponse)
def create_city(payload: CityMasterCreate, db: Session = Depends(get_db)):
    country = _soft_query(CountryMaster, db).filter(CountryMaster.id == payload.country_id).first()
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")
    state = _soft_query(StateMaster, db).filter(StateMaster.id == payload.state_id, StateMaster.country_id == payload.country_id).first()
    if not state:
        raise HTTPException(status_code=400, detail="Invalid state id for selected country")
    district = _soft_query(DistrictMaster, db).filter(DistrictMaster.id == payload.district_id, DistrictMaster.state_id == payload.state_id, DistrictMaster.country_id == payload.country_id).first()
    if not district:
        raise HTTPException(status_code=400, detail="Invalid district id for selected state/country")

    item = CityMaster(
        name=payload.name.strip(),
        code=payload.code.strip(),
        mayor_name=payload.mayor_name.strip(),
        country_id=payload.country_id,
        state_id=payload.state_id,
        district_id=payload.district_id,
        is_delete=False,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/cities/{city_id}", response_model=CityMasterResponse)
def update_city(city_id: int, payload: CityMasterUpdate, db: Session = Depends(get_db)):
    item = _soft_query(CityMaster, db).filter(CityMaster.id == city_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="City not found")
    country = _soft_query(CountryMaster, db).filter(CountryMaster.id == payload.country_id).first()
    if not country:
        raise HTTPException(status_code=400, detail="Invalid country id")
    state = _soft_query(StateMaster, db).filter(StateMaster.id == payload.state_id, StateMaster.country_id == payload.country_id).first()
    if not state:
        raise HTTPException(status_code=400, detail="Invalid state id for selected country")
    district = _soft_query(DistrictMaster, db).filter(DistrictMaster.id == payload.district_id, DistrictMaster.state_id == payload.state_id, DistrictMaster.country_id == payload.country_id).first()
    if not district:
        raise HTTPException(status_code=400, detail="Invalid district id for selected state/country")

    item.name = payload.name.strip()
    item.code = payload.code.strip()
    item.mayor_name = payload.mayor_name.strip()
    item.country_id = payload.country_id
    item.state_id = payload.state_id
    item.district_id = payload.district_id
    db.commit()
    db.refresh(item)
    return item


@router.delete("/cities/{city_id}", response_model=CityMasterResponse)
def delete_city(city_id: int, db: Session = Depends(get_db)):
    item = _soft_query(CityMaster, db).filter(CityMaster.id == city_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="City not found")
    item.is_delete = True
    db.commit()
    db.refresh(item)
    return item