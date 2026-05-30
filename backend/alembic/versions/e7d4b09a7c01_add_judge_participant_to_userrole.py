"""add judge and participant to userrole enum

The initial schema migration originally created the `userrole` Postgres
enum with only `{organizer, admin}`. The application model has always
declared all four roles (organizer, admin, judge, participant), so any
attempt to insert a user with role=judge or role=participant raised
`invalid input value for enum userrole`.

This migration backfills the missing values on existing databases.
Fresh databases get all four directly from the (now corrected) initial
migration, so the ADD VALUE IF NOT EXISTS calls here are no-ops in
that case.

Revision ID: e7d4b09a7c01
Revises: 55919fb22c3c
Create Date: 2026-05-29
"""

from typing import Sequence, Union

from alembic import op


revision: str = "e7d4b09a7c01"
down_revision: Union[str, Sequence[str], None] = "55919fb22c3c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # PostgreSQL ≥ 12 allows ALTER TYPE … ADD VALUE inside a transaction.
    # IF NOT EXISTS keeps this idempotent for any DB that may already
    # have one or both values (e.g. patched by hand in dev).
    op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'judge'")
    op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'participant'")


def downgrade() -> None:
    # Postgres has no portable way to remove an enum value, and dropping
    # values that already have rows would corrupt data. Leave as a no-op.
    pass
