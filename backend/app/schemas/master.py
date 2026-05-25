from pydantic import BaseModel


class CountryMasterCreate(BaseModel):
    name: str
    code: str
    pm_name: str


class CountryMasterUpdate(BaseModel):
    name: str
    code: str
    pm_name: str


class CountryMasterResponse(BaseModel):
    id: int
    name: str
    code: str
    pm_name: str
    is_delete: bool

    class Config:
        from_attributes = True


class StateMasterCreate(BaseModel):
    name: str
    code: str
    cm_name: str
    country_id: int


class StateMasterUpdate(BaseModel):
    name: str
    code: str
    cm_name: str
    country_id: int


class StateMasterResponse(BaseModel):
    id: int
    name: str
    code: str
    cm_name: str
    country_id: int
    country_name: str | None = None
    is_delete: bool

    class Config:
        from_attributes = True


class DistrictMasterCreate(BaseModel):
    name: str
    code: str
    dm_name: str
    country_id: int
    state_id: int


class DistrictMasterUpdate(BaseModel):
    name: str
    code: str
    dm_name: str
    country_id: int
    state_id: int


class DistrictMasterResponse(BaseModel):
    id: int
    name: str
    code: str
    dm_name: str
    country_id: int
    state_id: int
    country_name: str | None = None
    state_name: str | None = None
    is_delete: bool

    class Config:
        from_attributes = True


class CityMasterCreate(BaseModel):
    name: str
    code: str
    mayor_name: str
    country_id: int
    state_id: int
    district_id: int


class CityMasterUpdate(BaseModel):
    name: str
    code: str
    mayor_name: str
    country_id: int
    state_id: int
    district_id: int


class CityMasterResponse(BaseModel):
    id: int
    name: str
    code: str
    mayor_name: str
    country_id: int
    state_id: int
    district_id: int
    country_name: str | None = None
    state_name: str | None = None
    district_name: str | None = None
    is_delete: bool

    class Config:
        from_attributes = True