from fastapi import FastAPI, Query
from scraper import scrape_calendar
from models import daily_col, weekly_col
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime, timedelta
import threading, time

app = FastAPI(title="Lich UBND Toan Luu")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/daily")
def get_daily(date_str: str | None = Query(None, alias="date")):
    target_date = date.fromisoformat(date_str) if date_str else datetime.today().date()
    record = daily_col.find_one({"date": target_date.isoformat()}, {"_id": 0})
    return record.get("daily", []) if record else []

@app.get("/weekly")
def get_weekly(date_str: str | None = Query(None, alias="date")):
    target_date = date.fromisoformat(date_str) if date_str else datetime.today().date()
    week_start = (target_date - timedelta(days=target_date.weekday())).isoformat()
    record = weekly_col.find_one({"week_start": week_start}, {"_id": 0})
    return record.get("weekly", []) if record else []


@app.get("/available_dates")
def get_available_dates():
    dates = daily_col.distinct("date")
    return sorted(dates)


# =============== SYNC ===============

@app.get("/sync")
def sync_calendar():
    today = date.today()
    data = scrape_calendar(today)

    # DAILY
    daily_col.delete_one({"date": today.isoformat()})
    daily_col.insert_one({
        "date": today.isoformat(),
        "daily": data["daily"],
        "synced_at": datetime.now().isoformat()
    })

    # WEEKLY
    week_start = (today - timedelta(days=today.weekday())).isoformat()
    weekly_col.delete_one({"week_start": week_start})
    weekly_col.insert_one({
        "week_start": week_start,
        "weekly": data["weekly"],
        "synced_at": datetime.now().isoformat()
    })

    return {
        "status": "ok",
        "date": today.isoformat(),
        "daily_count": len(data["daily"]),
        "weekly_count": len(data["weekly"])
    }

def auto_sync():
    while True:
        print("[SYNC] Bắt đầu đồng bộ lịch...")
        try:
            sync_calendar()
        except Exception as e:
            print("[SYNC] Lỗi:", e)
        time.sleep(3600) 
 
threading.Thread(target=auto_sync, daemon=True).start()
