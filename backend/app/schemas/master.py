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
    is_delete: bool

    class Config:
        from_attributes = True


class StateMasterGetResponse(BaseModel):
    id: int
    name: str
    code: str
    cm_name: str
    country_id: int
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
    country_name: str
    state_id: int
    state_name: str
    is_delete: bool


class DistrictMasterGetResponse(BaseModel):
    id: int
    name: str
    code: str
    dm_name: str
    country_id: int
    state_id: int
    is_delete: bool

    class Config:
        from_attributes = True
