from sqlalchemy import select
from database import new_session
from main import STaskAdd
from database import TaskOrm

class TaskRepository:
    @classmethod
    async def add_one(cls,date: STaskAdd)-> int:
        async with new_session() as session:
            task_dict = date.model_dump

            task = TaskOrm(** task_dict)
            session.add(task)
            await session.flush()
            await session.commit()
            return task.id

    
    @classmethod
    async def find_all(cls):
        query = select(TaskOrm)
        result = await session.execute(query)
        task_models = result.scalars().all()
        return task_models