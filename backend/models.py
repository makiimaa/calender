from pymongo import MongoClient, ASCENDING

MONGO_URL = "mongodb://localhost:27017"
client = MongoClient(MONGO_URL)
db = client["lich_toanluu"]

daily_col = db["daily_events"]
weekly_col = db["weekly_events"]

daily_col.create_index([("date", ASCENDING)])
weekly_col.create_index([("week_start", ASCENDING)])
