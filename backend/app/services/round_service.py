"""
EKAM Round Service
"""

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.event import Round
from app.schemas.event import RoundCreate


async def create_round_service(
    db: AsyncSession,
    round_data: RoundCreate,
    current_user=None,
):
    round_obj = Round(**round_data.model_dump())
    db.add(round_obj)
    try:
        await db.commit()
        await db.refresh(round_obj)
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Could not create round: {type(e).__name__}: {e}",
        )
    return round_obj


async def list_rounds_service(
    db: AsyncSession,
    event_id,
):
    result = await db.execute(
        select(Round).where(Round.event_id == event_id)
    )
    return result.scalars().all()
