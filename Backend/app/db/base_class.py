from sqlalchemy.orm import as_declarative, declared_attr

@as_declarative()
class Base:
    """
    Base class for all SQLAlchemy models in the application.
    It automatically generates a __tablename__.
    """
    id: int
    __name__: str

    # to generate tablename from classname
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()