"""
Smart Action Tracker — tracks which recommendations were implemented
and measures their impact.
"""
import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.database import get_driver
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/actions", tags=["actions"])


class ActionRequest(BaseModel):
    recommendation: str
    category: str  # staffing | inventory | promotion | menu | pricing


class ActionUpdateRequest(BaseModel):
    action_id: str
    status: str  # yes | no | partially
    impact_notes: Optional[str] = ""


async def _get_business_id(user_id: str) -> str:
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            "MATCH (u:User {id: $uid})-[:OWNS]->(b:Business) RETURN b.id AS bid",
            {"uid": user_id},
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Business not found")
        return record["bid"]


@router.get("/pending")
async def get_pending_actions(current_user=Depends(get_current_user)):
    """Get all pending recommendations that haven't been acted on yet."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_ACTION]->(a:Action)
            WHERE a.status = 'pending'
            RETURN a.id AS id, a.recommendation AS recommendation,
                   a.category AS category, a.created_at AS created_at
            ORDER BY a.created_at DESC
            """,
            {"bid": business_id},
        )
        actions = [dict(r) for r in await result.data()]

    return {"pending_actions": actions}


@router.post("/create")
async def create_action(req: ActionRequest, current_user=Depends(get_current_user)):
    """Log a new recommended action for tracking."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])
    action_id = str(uuid.uuid4())

    async with driver.session() as session:
        await session.run(
            """
            MATCH (b:Business {id: $bid})
            CREATE (a:Action {
                id: $action_id,
                recommendation: $recommendation,
                category: $category,
                status: 'pending',
                created_at: datetime()
            })
            CREATE (b)-[:HAS_ACTION]->(a)
            """,
            {
                "bid": business_id,
                "action_id": action_id,
                "recommendation": req.recommendation,
                "category": req.category,
            },
        )

    return {"action_id": action_id, "message": "Action logged for tracking"}


@router.post("/update")
async def update_action_status(req: ActionUpdateRequest, current_user=Depends(get_current_user)):
    """Mark an action as implemented (yes/no/partially) and record impact."""
    driver = await get_driver()
    async with driver.session() as session:
        await session.run(
            """
            MATCH (a:Action {id: $action_id})
            SET a.status = $status,
                a.impact_notes = $impact_notes,
                a.updated_at = datetime()
            """,
            {
                "action_id": req.action_id,
                "status": req.status,
                "impact_notes": req.impact_notes,
            },
        )
    return {"message": f"Action updated to: {req.status}", "action_id": req.action_id}


@router.get("/history")
async def get_action_history(current_user=Depends(get_current_user)):
    """Get all tracked actions and their outcomes."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_ACTION]->(a:Action)
            RETURN a.id AS id, a.recommendation AS recommendation,
                   a.category AS category, a.status AS status,
                   a.impact_notes AS impact_notes,
                   a.created_at AS created_at, a.updated_at AS updated_at
            ORDER BY a.created_at DESC
            """,
            {"bid": business_id},
        )
        actions = [dict(r) for r in await result.data()]

    implemented = [a for a in actions if a["status"] == "yes"]
    partial = [a for a in actions if a["status"] == "partially"]
    skipped = [a for a in actions if a["status"] == "no"]

    return {
        "actions": actions,
        "summary": {
            "total": len(actions),
            "implemented": len(implemented),
            "partially_done": len(partial),
            "skipped": len(skipped),
        },
    }
