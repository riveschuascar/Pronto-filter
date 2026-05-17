from pydantic import BaseModel

class ChatbotRequestBody(BaseModel):
    phone: str | None = None
    name: str | None = None
    categories: list[str] | None = None
    products: list[str] | None = None
    purchase_intent: str | None = None