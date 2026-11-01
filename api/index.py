"""
FastAPI Backend for GitHub Bot Detection Dashboard
Deployment-ready for Vercel Serverless Functions and local execution.
"""

import json
import logging
import warnings
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Filter serialization / version warnings
warnings.filterwarnings("ignore")
logger = logging.getLogger("gh_bot_api")

# Initialize FastAPI application
app = FastAPI(
    title="GH Bot Detection API",
    description="Serverless ML API for GitHub Bot & Anomaly Detection (Isolation Forest, K-Means, PCA)",
    version="1.0.0",
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Model & Metadata Loading (Relative to index.py or root)
# ---------------------------------------------------------
MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
if not MODELS_DIR.exists():
    MODELS_DIR = Path("models").resolve()

try:
    scaler = joblib.load(MODELS_DIR / "scaler.joblib")
    iso_forest = joblib.load(MODELS_DIR / "iso_forest.joblib")
    kmeans = joblib.load(MODELS_DIR / "kmeans.joblib")
    pca = joblib.load(MODELS_DIR / "pca.joblib")

    with open(MODELS_DIR / "model_metadata.json", "r", encoding="utf-8") as f:
        MODEL_METADATA = json.load(f)

    with open(MODELS_DIR / "cluster_profiles.json", "r", encoding="utf-8") as f:
        CLUSTER_PROFILES = json.load(f)

    MODELS_LOADED = True
    THRESHOLD = float(MODEL_METADATA.get("threshold_skor", 0.55139))
    FITUR_COLS = MODEL_METADATA.get("fitur", [
        "log_n", "frac_push", "frac_create", "frac_pr", "frac_issue", "frac_social",
        "log_events_per_repo", "max_repo_share", "hour_entropy", "active_frac", "log_max_per_hour"
    ])
except Exception as e:
    MODELS_LOADED = False
    THRESHOLD = 0.55139
    FITUR_COLS = []
    MODEL_METADATA = {"error": f"Failed to load models: {str(e)}"}
    CLUSTER_PROFILES = {}
    logger.error("Error loading model artifacts: %s", e)


# ---------------------------------------------------------
# Preset Accounts (Empirical Case Studies & Prototypes)
# ---------------------------------------------------------
PRESETS: List[Dict[str, Any]] = [
    {
        "id": "black-hat-seo",
        "name": "Black-Hat SEO Gambling Bot",
        "category": "High-Risk Bot (Stealth)",
        "description": "Akun eksploitasi markdown dengan ribuan backlink judi daring / SEO spam. Event terkonsentrasi dalam hitungan menit (burst rate tinggi pada repositori tunggal).",
        "features": {
            "n_events": 35,
            "n_repos": 1,
            "jam_aktif": 2,
            "frac_push": 1.0,
            "frac_create": 0.0,
            "frac_pr": 0.0,
            "frac_issue": 0.0,
            "frac_social": 0.0,
            "max_repo_share": 1.0,
            "hour_entropy": 0.28,
            "active_frac": 0.026,
            "max_per_hour": 25
        }
    },
    {
        "id": "forex-ea",
        "name": "Forex Trading EA Auto-Deployer",
        "category": "Persistent Automated Bot",
        "description": "Bot trading valuta asing (Expert Advisor) yang melakukan auto-commit sinkronisasi status setiap 15 menit tanpa jeda tidur (aktif 22+ jam/hari).",
        "features": {
            "n_events": 48,
            "n_repos": 1,
            "jam_aktif": 22,
            "frac_push": 1.0,
            "frac_create": 0.0,
            "frac_pr": 0.0,
            "frac_issue": 0.0,
            "frac_social": 0.0,
            "max_repo_share": 1.0,
            "hour_entropy": 0.95,
            "active_frac": 0.88,
            "max_per_hour": 3
        }
    },
    {
        "id": "commit-spoofer",
        "name": "100k Commit Spoofer",
        "category": "Extreme Profile Spoofer",
        "description": "Skrip background infinite commit loop yang membanjiri repositori personal dengan ribuan commit untuk memanipulasi grafik hijau portofolio pengembang.",
        "features": {
            "n_events": 1868,
            "n_repos": 1,
            "jam_aktif": 78,
            "frac_push": 1.0,
            "frac_create": 0.0,
            "frac_pr": 0.0,
            "frac_issue": 0.0,
            "frac_social": 0.0,
            "max_repo_share": 1.0,
            "hour_entropy": 0.98,
            "active_frac": 1.0,
            "max_per_hour": 45
        }
    },
    {
        "id": "automated-ci",
        "name": "Automated CI / Dependency Bot",
        "category": "Official CI / Tooling Bot",
        "description": "Bot otomasi dependency upgrade dan Pull Request multi-repo (seperti Dependabot). Didominasi event PR & Issue dengan entropy jam terdistribusi.",
        "features": {
            "n_events": 85,
            "n_repos": 12,
            "jam_aktif": 30,
            "frac_push": 0.15,
            "frac_create": 0.05,
            "frac_pr": 0.65,
            "frac_issue": 0.15,
            "frac_social": 0.0,
            "max_repo_share": 0.20,
            "hour_entropy": 0.82,
            "active_frac": 0.38,
            "max_per_hour": 10
        }
    },
    {
        "id": "normal-developer",
        "name": "Normal Human Developer",
        "category": "Legitimate Contributor",
        "description": "Pengembang manusia dengan ritme sirkadian organik: aktivitas beristirahat di malam hari, bervariasi antara commit push, review, serta issue.",
        "features": {
            "n_events": 32,
            "n_repos": 3,
            "jam_aktif": 14,
            "frac_push": 0.60,
            "frac_create": 0.10,
            "frac_pr": 0.20,
            "frac_issue": 0.10,
            "frac_social": 0.0,
            "max_repo_share": 0.65,
            "hour_entropy": 0.68,
            "active_frac": 0.18,
            "max_per_hour": 5
        }
    }
]


# ---------------------------------------------------------
# Request & Response Schemas
# ---------------------------------------------------------
class PredictRequest(BaseModel):
    n_events: Optional[float] = Field(None, description="Total events (n)")
    n_repos: Optional[float] = Field(1.0, description="Number of distinct repositories")
    jam_aktif: Optional[float] = Field(None, description="Active hours count")
    frac_push: float = Field(0.0, description="Fraction of PushEvent [0, 1]")
    frac_create: float = Field(0.0, description="Fraction of CreateEvent [0, 1]")
    frac_pr: float = Field(0.0, description="Fraction of PullRequest events [0, 1]")
    frac_issue: float = Field(0.0, description="Fraction of Issue events [0, 1]")
    frac_social: float = Field(0.0, description="Fraction of Watch/Fork events [0, 1]")
    max_repo_share: float = Field(1.0, description="Share of top repository [0, 1]")
    hour_entropy: float = Field(0.5, description="Normalized 24h entropy [0, 1]")
    active_frac: Optional[float] = Field(None, description="Fraction of time active [0, 1]")
    max_per_hour: Optional[float] = Field(None, description="Max events in any single hour")

    # Optional direct precomputed log values
    log_n: Optional[float] = None
    log_events_per_repo: Optional[float] = None
    log_max_per_hour: Optional[float] = None


class PredictResponse(BaseModel):
    score: float
    threshold: float
    is_anomaly: bool
    status: str
    cluster_id: int
    cluster_badge: str
    cluster_title: str
    cluster_characteristics: List[str]
    pc1: float
    pc2: float
    features_transformed: Dict[str, float]


# ---------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------
@app.get("/")
@app.get("/api")
def api_root():
    return {
        "name": "GH Bot Detection API",
        "status": "online",
        "docs": "/docs",
        "models_loaded": MODELS_LOADED,
        "endpoints": [
            "/api/health",
            "/api/metadata",
            "/api/clusters",
            "/api/presets",
            "/api/predict"
        ]
    }


@app.get("/api/health")
@app.get("/health")
def health():
    """Health check endpoint confirming model status."""
    return {
        "status": "ok" if MODELS_LOADED else "degraded",
        "models_loaded": MODELS_LOADED,
        "threshold": THRESHOLD,
        "features_count": len(FITUR_COLS)
    }


@app.get("/api/metadata")
@app.get("/metadata")
def get_metadata():
    """Returns training metadata and feature schema."""
    if not MODELS_LOADED:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return MODEL_METADATA


@app.get("/api/clusters")
@app.get("/clusters")
def get_clusters():
    """Returns behavioral cluster profiles (7 clusters)."""
    if not MODELS_LOADED:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return CLUSTER_PROFILES


@app.get("/api/presets")
@app.get("/presets")
def get_presets():
    """Returns preset example accounts for interactive simulation."""
    return {"presets": PRESETS}


@app.post("/api/predict", response_model=PredictResponse)
@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    """
    Predict anomaly score, anomaly status, K-Means cluster, and 2D PCA projection
    based on 11 behavioral features.
    """
    if not MODELS_LOADED:
        raise HTTPException(status_code=503, detail="Models not loaded")

    # 1. Feature normalization and log transforms
    # log_n
    if payload.log_n is not None:
        val_log_n = float(payload.log_n)
    elif payload.n_events is not None:
        val_log_n = float(np.log1p(max(payload.n_events, 0.0)))
    else:
        val_log_n = 0.0

    n_events_effective = payload.n_events if payload.n_events is not None else float(np.expm1(val_log_n))

    # Event proportions [0, 1]
    val_frac_push = float(np.clip(payload.frac_push, 0.0, 1.0))
    val_frac_create = float(np.clip(payload.frac_create, 0.0, 1.0))
    val_frac_pr = float(np.clip(payload.frac_pr, 0.0, 1.0))
    val_frac_issue = float(np.clip(payload.frac_issue, 0.0, 1.0))
    val_frac_social = float(np.clip(payload.frac_social, 0.0, 1.0))

    # log_events_per_repo
    if payload.log_events_per_repo is not None:
        val_log_events_per_repo = float(payload.log_events_per_repo)
    else:
        repos = max(payload.n_repos or 1.0, 1.0)
        val_log_events_per_repo = float(np.log1p(n_events_effective / repos))

    # max_repo_share and hour_entropy [0, 1]
    val_max_repo_share = float(np.clip(payload.max_repo_share, 0.0, 1.0))
    val_hour_entropy = float(np.clip(payload.hour_entropy, 0.0, 1.0))

    # active_frac
    if payload.active_frac is not None:
        val_active_frac = float(np.clip(payload.active_frac, 0.0, 1.0))
    elif payload.jam_aktif is not None:
        # Standard observation window is 152 hours across 2 blocks
        if payload.jam_aktif > 1.0:
            val_active_frac = float(np.clip(payload.jam_aktif / 152.0, 0.0, 1.0))
        else:
            val_active_frac = float(np.clip(payload.jam_aktif, 0.0, 1.0))
    else:
        val_active_frac = 0.2

    # log_max_per_hour
    if payload.log_max_per_hour is not None:
        val_log_max_per_hour = float(payload.log_max_per_hour)
    elif payload.max_per_hour is not None:
        val_log_max_per_hour = float(np.log1p(max(payload.max_per_hour, 0.0)))
    else:
        val_log_max_per_hour = float(np.log1p(n_events_effective))

    # Assemble feature dictionary matching exact FITUR names
    features = {
        "log_n": val_log_n,
        "frac_push": val_frac_push,
        "frac_create": val_frac_create,
        "frac_pr": val_frac_pr,
        "frac_issue": val_frac_issue,
        "frac_social": val_frac_social,
        "log_events_per_repo": val_log_events_per_repo,
        "max_repo_share": val_max_repo_share,
        "hour_entropy": val_hour_entropy,
        "active_frac": val_active_frac,
        "log_max_per_hour": val_log_max_per_hour,
    }

    feature_vector = np.array([[features[col] for col in FITUR_COLS]], dtype=np.float64)

    # 2. Scale features
    X_scaled = scaler.transform(feature_vector)

    # 3. Isolation Forest Anomaly Score
    score = -float(iso_forest.score_samples(X_scaled)[0])

    # 4. Anomaly Decision
    is_anomaly = bool(score >= THRESHOLD)
    status_label = "Anomaly (Bot-like)" if is_anomaly else "Normal"

    # 5. K-Means Cluster Assignment
    cluster_id = int(kmeans.predict(X_scaled)[0])

    # 6. PCA 2D coordinates
    pc = pca.transform(X_scaled)[0]
    pc1 = float(pc[0])
    pc2 = float(pc[1])

    # 7. Cluster Profile Metadata
    cluster_info = CLUSTER_PROFILES.get(str(cluster_id), {})
    cluster_badge = cluster_info.get("badge", f"Cluster {cluster_id}")
    cluster_title = cluster_info.get("title", f"Cluster {cluster_id}")
    cluster_characteristics = cluster_info.get("characteristics", [])

    return PredictResponse(
        score=round(score, 4),
        threshold=round(THRESHOLD, 4),
        is_anomaly=is_anomaly,
        status=status_label,
        cluster_id=cluster_id,
        cluster_badge=cluster_badge,
        cluster_title=cluster_title,
        cluster_characteristics=cluster_characteristics,
        pc1=round(pc1, 4),
        pc2=round(pc2, 4),
        features_transformed={col: round(features[col], 4) for col in FITUR_COLS}
    )
