from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from app.database import Base


class CountryMaster(Base):
    __tablename__ = "country_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    pm_name = Column(String, nullable=False)
    is_delete = Column(Boolean, nullable=False, default=False)


class StateMaster(Base):
    __tablename__ = "state_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    cm_name = Column(String, nullable=False)
    country_id = Column(Integer, ForeignKey("country_master.id"), nullable=False, index=True)
    is_delete = Column(Boolean, nullable=False, default=False)


class DistrictMaster(Base):
    __tablename__ = "district_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    dm_name = Column(String, nullable=False)
    country_id = Column(Integer, ForeignKey("country_master.id"), nullable=False, index=True)
    state_id = Column(Integer, ForeignKey("state_master.id"), nullable=False, index=True)
    is_delete = Column(Boolean, nullable=False, default=False)