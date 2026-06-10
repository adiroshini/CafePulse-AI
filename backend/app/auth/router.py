import uuid
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from app.database import get_driver
from app.auth.utils import hash_password, verify_password, create_access_token
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

# In-memory OTP store (use Redis in production)
_otp_store: dict = {}


class RegisterRequest(BaseModel):
    email: str
    phone: str
    password: str


class OTPVerifyRequest(BaseModel):
    email: str
    otp: str


class LoginRequest(BaseModel):
    email: str
    password: str


class BusinessSetupRequest(BaseModel):
    cafe_name: str
    location: str
    business_type: str
    num_employees: int
    operating_hours: str


@router.post("/register")
async def register(req: RegisterRequest):
    driver = await get_driver()
    async with driver.session() as session:
        existing = await session.run(
            "MATCH (u:User {email: $email}) RETURN u", {"email": req.email}
        )
        if await existing.single():
            raise HTTPException(status_code=400, detail="Email already registered")

        user_id = str(uuid.uuid4())
        hashed = hash_password(req.password)
        await session.run(
            """
            CREATE (u:User {
                id: $id, email: $email, phone: $phone,
                password: $password, verified: false,
                created_at: datetime()
            })
            """,
            {"id": user_id, "email": req.email, "phone": req.phone, "password": hashed},
        )

    # Generate OTP (static for demo; use real SMS in production)
    otp = "123456"
    _otp_store[req.email] = otp
    return {"message": "Registration successful. OTP sent.", "dev_otp": otp}


@router.post("/verify-otp")
async def verify_otp(req: OTPVerifyRequest):
    stored = _otp_store.get(req.email)
    if not stored or stored != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    driver = await get_driver()
    async with driver.session() as session:
        await session.run(
            "MATCH (u:User {email: $email}) SET u.verified = true", {"email": req.email}
        )
    del _otp_store[req.email]
    return {"message": "OTP verified successfully"}


@router.post("/login")
async def login(req: LoginRequest):
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            "MATCH (u:User {email: $email}) RETURN u", {"email": req.email}
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        user = dict(record["u"])
        if not verify_password(req.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": user["id"]})
        return {"access_token": token, "token_type": "bearer", "user_id": user["id"]}


@router.post("/business-setup")
async def business_setup(req: BusinessSetupRequest, current_user=Depends(get_current_user)):
    driver = await get_driver()
    business_id = str(uuid.uuid4())
    async with driver.session() as session:
        await session.run(
            """
            MATCH (u:User {id: $user_id})
            CREATE (b:Business {
                id: $business_id,
                cafe_name: $cafe_name,
                location: $location,
                business_type: $business_type,
                num_employees: $num_employees,
                operating_hours: $operating_hours,
                created_at: datetime()
            })
            CREATE (u)-[:OWNS]->(b)
            """,
            {
                "user_id": current_user["id"],
                "business_id": business_id,
                **req.model_dump(),
            },
        )
    return {"message": "Business profile created", "business_id": business_id}


@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (u:User {id: $id})-[:OWNS]->(b:Business)
            RETURN b
            """,
            {"id": current_user["id"]},
        )
        record = await result.single()
        business = dict(record["b"]) if record else None
    return {"user": {k: v for k, v in current_user.items() if k != "password"}, "business": business}
