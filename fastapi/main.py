from typing import Optional
from fastapi import FastAPI
from router.analysisRouter import router as analysisRouter
import datetime

app = FastAPI()


app.include_router(analysisRouter, prefix="/analysis")


app.mount("/", StaticFiles(directory="view/build", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)