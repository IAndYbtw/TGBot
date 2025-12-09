
from typing import Annotated
from fastapi import Depends, FastAPI
from  pydantic import BaseModel

from contextlib import asynccontextmanager

from database import delete_tables
from database import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
   await delete_tables()
   print("База очищена")
   await create_tables()
   print("База готова")
   yield
   print('Выключение')

 

app = FastAPI(lifespan=lifespan)



class STaskAdd(BaseModel):
    name: str
    discription: str | None = None

class STask(STaskAdd):
    id: int

tasks = []


@app.post("/tasks")
async def add_task(
    task:Annotated [STaskAdd,Depends()]

):
    tasks.append(task)
    return {"ok": True}


#@app.get("/tasks")
#def get_tasks():
#    task = Task(name = "Напиши что нибудь")
#    return {"data":task}