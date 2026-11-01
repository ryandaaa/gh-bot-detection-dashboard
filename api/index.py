"""
FastAPI Backend for GitHub Bot Detection Dashboard
Deployment-ready for Vercel Serverless Functions and local execution.
"""

import asyncio
import json
import logging
import os
import re
import warnings
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

import httpx
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, Query
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
    features: Optional[Dict[str, Any]] = None
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


class UserInfo(BaseModel):
    username: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    public_repos: int = 0
    followers: int = 0
    created_at: Optional[str] = None
    html_url: str
    is_official_bot: Optional[bool] = False
    user_type: Optional[str] = "User"


class RawMetrics(BaseModel):
    n_events: int
    n_repos: int
    active_hours: int
    push_ratio: float
    pr_ratio: float
    issue_ratio: float
    create_ratio: float
    social_ratio: float
    max_repo_share: float
    hour_entropy: float
    active_frac: float
    max_per_hour: int


class AnalyzePrediction(BaseModel):
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


class AnalyzeGitHubResponse(BaseModel):
    user_info: UserInfo
    raw_metrics: RawMetrics
    prediction: AnalyzePrediction


def sanitize_github_username(raw_input: str) -> str:
    """
    Extracts clean GitHub username from URL, profile link, or raw handle.
    Handles:
      - 'https://github.com/torvalds' -> 'torvalds'
      - 'https://github.com/torvalds/' -> 'torvalds'
      - 'http://github.com/mccartyashley284' -> 'mccartyashley284'
      - 'github.com/hiro-kurage?tab=repositories' -> 'hiro-kurage'
      - '@nonkh' -> 'nonkh'
      - 'torvalds' -> 'torvalds'
    """
    if not raw_input:
        return ""
    s = raw_input.strip()
    if s.startswith("@"):
        s = s[1:]

    if "github.com" in s or s.startswith("http://") or s.startswith("https://"):
        if not s.startswith("http://") and not s.startswith("https://"):
            s = "https://" + s
        try:
            parsed = urlparse(s)
            path_parts = [p.strip() for p in parsed.path.split("/") if p.strip()]
            if path_parts:
                s = path_parts[0]
            else:
                s = ""
        except Exception:
            pass
    else:
        s = s.split("?")[0].split("#")[0].strip("/")
        if "/" in s:
            s = s.split("/")[0]

    s = re.sub(r"[^a-zA-Z0-9\-]", "", s).strip()
    return s


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
            "/api/predict",
            "/api/analyze-github"
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

    # Unpack nested features dict if passed
    if payload.features and isinstance(payload.features, dict):
        f = payload.features
        if "n_events" in f and payload.n_events is None: payload.n_events = f.get("n_events")
        if "n_repos" in f and (payload.n_repos == 1.0 or payload.n_repos is None): payload.n_repos = f.get("n_repos")
        if "jam_aktif" in f and payload.jam_aktif is None: payload.jam_aktif = f.get("jam_aktif")
        if "frac_push" in f and payload.frac_push == 0.0: payload.frac_push = float(f.get("frac_push", 0.0))
        if "frac_create" in f and payload.frac_create == 0.0: payload.frac_create = float(f.get("frac_create", 0.0))
        if "frac_pr" in f and payload.frac_pr == 0.0: payload.frac_pr = float(f.get("frac_pr", 0.0))
        if "frac_issue" in f and payload.frac_issue == 0.0: payload.frac_issue = float(f.get("frac_issue", 0.0))
        if "frac_social" in f and payload.frac_social == 0.0: payload.frac_social = float(f.get("frac_social", 0.0))
        if "max_repo_share" in f and payload.max_repo_share == 1.0: payload.max_repo_share = float(f.get("max_repo_share", 1.0))
        if "hour_entropy" in f and payload.hour_entropy == 0.5: payload.hour_entropy = float(f.get("hour_entropy", 0.5))
        if "active_frac" in f and payload.active_frac is None: payload.active_frac = f.get("active_frac")
        if "max_per_hour" in f and payload.max_per_hour is None: payload.max_per_hour = f.get("max_per_hour")
        if "log_n" in f and payload.log_n is None: payload.log_n = f.get("log_n")
        if "log_events_per_repo" in f and payload.log_events_per_repo is None: payload.log_events_per_repo = f.get("log_events_per_repo")
        if "log_max_per_hour" in f and payload.log_max_per_hour is None: payload.log_max_per_hour = f.get("log_max_per_hour")

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


@app.get("/api/analyze-github", response_model=AnalyzeGitHubResponse)
@app.get("/analyze-github", response_model=AnalyzeGitHubResponse)
async def analyze_github(
    username: Optional[str] = Query(None, description="GitHub username or profile URL"),
    username_or_url: Optional[str] = Query(None, description="Alternative parameter for GitHub username or profile URL")
):
    """
    Live GitHub Account Lookup & Feature Extraction:
    1. Sanitizes username/URL input
    2. Fetches public profile and recent 100 public events from GitHub REST API
    3. Computes the 11 behavioral features
    4. Evaluates through ML pipeline (StandardScaler -> Isolation Forest -> K-Means -> PCA)
    5. Returns user info, raw metrics, and anomaly detection results.
    """
    if not MODELS_LOADED:
        raise HTTPException(status_code=503, detail="Models not loaded")

    raw_target = username or username_or_url
    if not raw_target:
        raise HTTPException(
            status_code=400,
            detail="Parameter 'username' atau 'username_or_url' wajib disertakan."
        )

    clean_username = sanitize_github_username(raw_target)
    if not clean_username:
        raise HTTPException(
            status_code=400,
            detail=f"Input '{raw_target}' tidak menghasilkan username GitHub yang valid."
        )

    headers = {
        "User-Agent": "gh-bot-detector-app/1.0",
        "Accept": "application/vnd.github.v3+json",
    }
    gh_token = os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN")
    if not gh_token:
        try:
            import subprocess
            _res = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, timeout=2)
            if _res.returncode == 0 and _res.stdout.strip():
                gh_token = _res.stdout.strip()
        except Exception:
            pass

    if gh_token:
        headers["Authorization"] = f"Bearer {gh_token}"

    async with httpx.AsyncClient(timeout=15.0, headers=headers) as client:
        # 1. Fetch user profile
        try:
            user_resp = await client.get(f"https://api.github.com/users/{clean_username}")
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Gagal menghubungi GitHub API: {str(exc)}"
            )

        if user_resp.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=f"Akun GitHub '{clean_username}' tidak ditemukan (404 Not Found)."
            )
        elif user_resp.status_code == 403:
            msg = user_resp.json().get("message", "GitHub API rate limit exceeded.")
            raise HTTPException(
                status_code=429 if "rate limit" in msg.lower() else 403,
                detail=f"GitHub API limit: {msg}"
            )
        elif user_resp.status_code != 200:
            raise HTTPException(
                status_code=user_resp.status_code,
                detail=f"GitHub API error ({user_resp.status_code}): {user_resp.text}"
            )

        user_data = user_resp.json()
        user_type = user_data.get("type", "User")
        is_official_bot = bool(
            user_type == "Bot" or
            clean_username.lower().endswith("[bot]") or
            clean_username.lower().endswith("-bot") or
            "[bot]" in (user_data.get("name") or "").lower()
        )

        # 2. Fetch up to 300 recent public events across 3 pages (GitHub hard limit is 300)
        events = []
        try:
            page_tasks = [
                client.get(f"https://api.github.com/users/{clean_username}/events?per_page=100&page={p}")
                for p in [1, 2, 3]
            ]
            page_resps = await asyncio.gather(*page_tasks, return_exceptions=True)
            for r in page_resps:
                if isinstance(r, httpx.Response) and r.status_code == 200:
                    page_items = r.json()
                    if isinstance(page_items, list):
                        events.extend(page_items)
                elif isinstance(r, httpx.Response) and r.status_code == 403:
                    msg = r.json().get("message", "GitHub API rate limit exceeded.")
                    if "rate limit" in msg.lower():
                        raise HTTPException(
                            status_code=429,
                            detail=f"GitHub API limit: {msg}"
                        )
        except HTTPException:
            raise
        except Exception as exc:
            logger.warning(f"Error fetching pages for {clean_username}: {exc}")

    # 3. Check for 0 events
    if not events or len(events) == 0:
        raise HTTPException(
            status_code=400,
            detail=f"Akun '{clean_username}' tidak memiliki aktivitas publik baru untuk dianalisis (0 public events)."
        )

    n_events = len(events)

    # 4. Extract 11 behavioral features
    # Repositories
    repos = [
        e.get("repo", {}).get("name")
        for e in events
        if e.get("repo") and e.get("repo", {}).get("name")
    ]
    repo_counts = Counter(repos)
    n_repos = len(repo_counts) if repo_counts else 1
    max_repo_share = float(max(repo_counts.values()) / n_events) if (n_events > 0 and repo_counts) else 0.0

    # Event types
    tipe_counts = Counter(e.get("type") for e in events)
    frac_push = float(tipe_counts.get("PushEvent", 0) / n_events)
    frac_create = float(tipe_counts.get("CreateEvent", 0) / n_events)

    tipe_pr = {"PullRequestEvent", "PullRequestReviewEvent", "PullRequestReviewCommentEvent"}
    frac_pr = float(sum(tipe_counts.get(t, 0) for t in tipe_pr) / n_events)

    tipe_issue = {"IssuesEvent", "IssueCommentEvent"}
    frac_issue = float(sum(tipe_counts.get(t, 0) for t in tipe_issue) / n_events)

    tipe_social = {"WatchEvent", "ForkEvent"}
    frac_social = float(sum(tipe_counts.get(t, 0) for t in tipe_social) / n_events)

    # Hourly distribution and active hours
    hour_keys = []
    hours_of_day = []
    for e in events:
        ts_str = e.get("created_at")
        if ts_str:
            try:
                dt = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
                hour_keys.append(dt.strftime("%Y-%m-%d-%H"))
                hours_of_day.append(dt.hour)
            except Exception:
                pass

    unique_active_hours = set(hour_keys)
    active_hours_count = len(unique_active_hours)
    active_frac = float(np.clip(active_hours_count / 152.0, 0.0, 1.0))

    counts_per_hour = Counter(hour_keys)
    max_per_hour = max(counts_per_hour.values()) if counts_per_hour else 1

    # hour_entropy = -sum(p * log2(p)) / log2(24) from distribution of hours 0-23
    hod = np.zeros(24)
    for h in hours_of_day:
        hod[h] += 1
    p = hod[hod > 0] / hod.sum() if hod.sum() > 0 else np.array([])
    hour_entropy = float(-(p * np.log2(p)).sum() / np.log2(24)) if len(p) > 0 else 0.0

    # 5. Model Inference
    features = {
        "log_n": float(np.log1p(n_events)),
        "frac_push": float(np.clip(frac_push, 0.0, 1.0)),
        "frac_create": float(np.clip(frac_create, 0.0, 1.0)),
        "frac_pr": float(np.clip(frac_pr, 0.0, 1.0)),
        "frac_issue": float(np.clip(frac_issue, 0.0, 1.0)),
        "frac_social": float(np.clip(frac_social, 0.0, 1.0)),
        "log_events_per_repo": float(np.log1p(n_events / max(n_repos, 1))),
        "max_repo_share": float(np.clip(max_repo_share, 0.0, 1.0)),
        "hour_entropy": float(np.clip(hour_entropy, 0.0, 1.0)),
        "active_frac": active_frac,
        "log_max_per_hour": float(np.log1p(max_per_hour)),
    }

    feature_vector = np.array([[features[col] for col in FITUR_COLS]], dtype=np.float64)
    X_scaled = scaler.transform(feature_vector)
    score = -float(iso_forest.score_samples(X_scaled)[0])
    is_anomaly = bool(score >= THRESHOLD)
    status_label = "Anomaly (Bot-like)" if is_anomaly else "Normal"
    cluster_id = int(kmeans.predict(X_scaled)[0])
    pc = pca.transform(X_scaled)[0]
    pc1 = float(pc[0])
    pc2 = float(pc[1])

    cluster_info = CLUSTER_PROFILES.get(str(cluster_id), {})
    cluster_badge = cluster_info.get("badge", f"Cluster {cluster_id}")
    cluster_title = cluster_info.get("title", f"Cluster {cluster_id}")
    cluster_characteristics = cluster_info.get("characteristics", [])

    return AnalyzeGitHubResponse(
        user_info=UserInfo(
            username=user_data.get("login") or clean_username,
            name=user_data.get("name"),
            avatar_url=user_data.get("avatar_url"),
            bio=user_data.get("bio"),
            public_repos=int(user_data.get("public_repos") or 0),
            followers=int(user_data.get("followers") or 0),
            created_at=user_data.get("created_at"),
            html_url=user_data.get("html_url") or f"https://github.com/{clean_username}",
            is_official_bot=is_official_bot,
            user_type=user_type,
        ),
        raw_metrics=RawMetrics(
            n_events=n_events,
            n_repos=n_repos,
            active_hours=active_hours_count,
            push_ratio=round(frac_push, 4),
            pr_ratio=round(frac_pr, 4),
            issue_ratio=round(frac_issue, 4),
            create_ratio=round(frac_create, 4),
            social_ratio=round(frac_social, 4),
            max_repo_share=round(max_repo_share, 4),
            hour_entropy=round(hour_entropy, 4),
            active_frac=round(active_frac, 4),
            max_per_hour=int(max_per_hour),
        ),
        prediction=AnalyzePrediction(
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
        ),
    )
