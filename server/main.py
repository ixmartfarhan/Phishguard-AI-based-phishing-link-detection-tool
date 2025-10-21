import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.resolve()))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model_loader import model
from trainer.utils import extract_features

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLReq(BaseModel):
    url: str

@app.post("/v1/check")
def check(req: URLReq):
    feats = extract_features(req.url)
    X = [[feats[k] for k in sorted(feats.keys())]]
    score = float(model.predict_proba(X)[0][1])
    verdict = "phishing" if score >= 0.5 else "safe"
    return {"verdict": verdict, "score": score, "explanation": feats, "model_version": "v2"}
