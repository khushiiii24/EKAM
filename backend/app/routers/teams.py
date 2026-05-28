from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.middleware.auth import require_role

from app.models.user import User, UserRole

from app.schemas.judge import (
    Judge,
    JudgeCreate,
    JudgeAssignment,
    JudgeAssignmentCreate
)

from app.services.judge_service import (
    create_judge_service,
    list_judges_service
)

from app.services.assignment_service import (
    assign_judge_service
)

router = APIRouter(
    prefix="/judges",
    tags=["Judges"]
)


@router.post(
    "/create",
    response_model=Judge,
    status_code=status.HTTP_201_CREATED
)
async def create_judge(
    judge_in: JudgeCreate,
    current_user: User = Depends(
        require_role([UserRole.organizer, UserRole.admin])
    ),
    db: AsyncSession = Depends(get_db)
):
    return await create_judge_service(
        db,
        judge_in
    )


@router.post(
    "/assign",
    response_model=JudgeAssignment,
    status_code=status.HTTP_201_CREATED
)
async def assign_judge(
    assign_in: JudgeAssignmentCreate,
    current_user: User = Depends(
        require_role([UserRole.organizer, UserRole.admin])
    ),
    db: AsyncSession = Depends(get_db)
):
    return await assign_judge_service(
        db,
        assign_in
    )


@router.get("/{event_id}", response_model=List[Judge])
async def list_judges(
    event_id: UUID,
    current_user: User = Depends(
        require_role([UserRole.organizer, UserRole.admin])
    ),
    db: AsyncSession = Depends(get_db)
):
    return await list_judges_service(
        db,
        event_id
    )