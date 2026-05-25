from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
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

    country = relationship("CountryMaster")

    @property
    def country_name(self) -> str | None:
        return self.country.name if self.country else None


class DistrictMaster(Base):
    __tablename__ = "district_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    dm_name = Column(String, nullable=False)
    country_id = Column(Integer, ForeignKey("country_master.id"), nullable=False, index=True)
    state_id = Column(Integer, ForeignKey("state_master.id"), nullable=False, index=True)
    is_delete = Column(Boolean, nullable=False, default=False)

    country = relationship("CountryMaster")
    state = relationship("StateMaster")

    @property
    def country_name(self) -> str | None:
        return self.country.name if self.country else None

    @property
    def state_name(self) -> str | None:
        return self.state.name if self.state else None


class CityMaster(Base):
    __tablename__ = "city_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    mayor_name = Column(String, nullable=False)
    country_id = Column(Integer, ForeignKey("country_master.id"), nullable=False, index=True)
    state_id = Column(Integer, ForeignKey("state_master.id"), nullable=False, index=True)
    district_id = Column(Integer, ForeignKey("district_master.id"), nullable=False, index=True)
    is_delete = Column(Boolean, nullable=False, default=False)

    country = relationship("CountryMaster")
    state = relationship("StateMaster")
    district = relationship("DistrictMaster")

    @property
    def country_name(self) -> str | None:
        return self.country.name if self.country else None

    @property
    def state_name(self) -> str | None:
        return self.state.name if self.state else None

    @property
    def district_name(self) -> str | None:
        return self.district.name if self.district else None