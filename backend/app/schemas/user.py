from pydantic import BaseModel, EmailStr
from pydantic import field_validator
import re

PASSWORD_RULE = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$")


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not PASSWORD_RULE.match(value):
            raise ValueError(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
            )
        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not PASSWORD_RULE.match(value):
            raise ValueError(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
            )
        return value


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    message: str
    user: UserResponse
