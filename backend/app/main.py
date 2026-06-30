from fastapi import FastAPI
from pydantic import BaseModel

class chatRequest(BaseModel):
    msg:str
    
app= FastAPI()

@app.post("/")
def chat(request:chatRequest):
    return {
        "message":f"recieved msg: {request.msg}"
    }