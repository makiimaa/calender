import requests
from bs4 import BeautifulSoup
from datetime import date
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

URL = "https://lich.hatinh.gov.vn/toanluu/plugin_working/show_calendar"
WEEKLY_URL = "https://lich.hatinh.gov.vn/toanluu/plugin_working/show_calendar_week"

def scrape_calendar(target_date: date = date.today()):
    res = requests.get(URL, timeout=10, verify=False)
    res.encoding = 'utf-8'
    soup = BeautifulSoup(res.text, 'html.parser')

    data = {"date": target_date.isoformat(), "daily": [], "weekly": []}

    daily_table = soup.select_one(".daily-schedule-table")
    if daily_table:
        rows = daily_table.select("tbody tr")
        for r in rows:
            cols = [c.get_text(strip=True, separator=" ") for c in r.find_all("td")]
            if len(cols) >= 5:
                data["daily"].append({
                    "time": cols[0],
                    "content": cols[1],
                    "host": cols[2],
                    "participants": cols[3],
                    "location": cols[4],
                })

    res_week = requests.get(WEEKLY_URL, timeout=10, verify=False)
    res_week.encoding = 'utf-8'
    soup2 = BeautifulSoup(res_week.text, 'html.parser')
    rows = soup2.select(".daily-schedule-table tbody tr")
    for row in rows:
        cols = [c.get_text(strip=True, separator=" ") for c in row.find_all("td")]
        if len(cols) >= 4:
            data["weekly"].append({
                "day": cols[0],
                "time": cols[1],
                "content": cols[2],
                "participants": cols[3] if len(cols) > 3 else "",
                "location": cols[4] if len(cols) > 4 else ""
            })

    return data
