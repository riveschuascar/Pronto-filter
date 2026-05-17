from fastapi import FastAPI, HTTPException
import firebase_admin
import os
import json
import base64
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
from src.models.ChatbotRequestBody import ChatbotRequestBody

load_dotenv()

app = FastAPI()

cred_str = os.environ.get("FIREBASE_CREDENTIALS")
cred_dict = json.loads(base64.b64decode(cred_str).decode("utf-8"))
cred = credentials.Certificate(cred_dict)

firebase_admin.initialize_app(cred)
db = firestore.client()

@app.get("/")
async def root():
    return {"message": "Welcome to FASTAPI"}


@app.post("/chatbot", status_code=201)
async def get_json_from_chatbot(body: ChatbotRequestBody):
    data = {k: v for k, v in body.model_dump().items() if v is not None}

    if not data:
        raise HTTPException(status_code=400, detail="El body no puede estar vacío")

    data["created_at"] = firestore.SERVER_TIMESTAMP

    if body.phone:
        doc_ref = db.collection("conversations").document(body.phone)
        if doc_ref.get().exists:
            raise HTTPException(status_code=409, detail=f"Ya existe una conversación para {body.phone}")
        doc_ref.set(data)
    else:
        _, doc_ref = db.collection("conversations").add(data)

    return {"id": doc_ref.id, "data": data}


@app.patch("/chatbot/{phone}", status_code=200)
async def get_updated_json_from_chatbot(phone: str, body: ChatbotRequestBody):
    doc_ref = db.collection("conversations").document(phone)

    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail=f"No existe una conversación para {phone}")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}

    if not updates:
        raise HTTPException(status_code=400, detail="No hay campos para actualizar")

    updates["updated_at"] = firestore.SERVER_TIMESTAMP
    doc_ref.update(updates)

    return {"id": doc_ref.id, "updated_fields": list(updates.keys())}