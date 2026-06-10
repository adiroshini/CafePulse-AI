from neo4j import AsyncGraphDatabase, AsyncDriver
from app.config import get_settings
from typing import Optional

settings = get_settings()

_driver: Optional[AsyncDriver] = None


async def get_driver() -> AsyncDriver:
    global _driver
    if _driver is None:
        _driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_username, settings.neo4j_password),
        )
    return _driver


async def close_driver():
    global _driver
    if _driver:
        await _driver.close()
        _driver = None


async def init_db():
    """Create constraints and indexes on startup."""
    driver = await get_driver()
    try:
        async with driver.session() as session:
            constraints = [
                "CREATE CONSTRAINT user_email IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE",
                "CREATE CONSTRAINT business_id IF NOT EXISTS FOR (b:Business) REQUIRE b.id IS UNIQUE",
                "CREATE CONSTRAINT customer_id IF NOT EXISTS FOR (c:Customer) REQUIRE c.id IS UNIQUE",
                "CREATE CONSTRAINT product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE",
                "CREATE CONSTRAINT review_id IF NOT EXISTS FOR (r:Review) REQUIRE r.id IS UNIQUE",
                "CREATE CONSTRAINT order_id IF NOT EXISTS FOR (o:Order) REQUIRE o.id IS UNIQUE",
                "CREATE CONSTRAINT inventory_id IF NOT EXISTS FOR (i:Inventory) REQUIRE i.id IS UNIQUE",
            ]
            for constraint in constraints:
                try:
                    await session.run(constraint)
                except Exception:
                    pass
    except Exception as e:
        # Neo4j not running — app will still start, DB errors surfaced per-request
        print(f"[WARNING] Neo4j connection failed on startup: {e}")
        print("[INFO] Start Neo4j and the app will connect automatically.")
