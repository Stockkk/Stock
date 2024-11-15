from typing import Optional
from fastapi import FastAPI
from router.analysisRouter import router as analysisRouter
import datetime
from fastapi.staticfiles import StaticFiles
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # React 개발 서버 URL (3000 포트)
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # "*"로 설정하면 모든 출처 허용 (테스트 후 필요한 출처만 허용)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysisRouter, prefix="/analysis")



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)