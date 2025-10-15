/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDisplay(date: Date) {
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dayName = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dayName}, ngày ${dd}/${mm}/${yyyy}`;
}

export default function Page() {
  const [daily, setDaily] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  async function fetchData(dateStr: string) {
    try {
      const [dailyRes, weeklyRes] = await Promise.all([
        axios.get(`${API_BASE}/daily?date=${dateStr}`),
        axios.get(`${API_BASE}/weekly?date=${dateStr}`),
      ]);
      setDaily(dailyRes.data);
      setWeekly(weeklyRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setDaily([]);
      setWeekly([]);
    }
  }

  useEffect(() => {
    axios.get(`${API_BASE}/available_dates`).then((res) => {
      setAvailableDates(res.data);
    });
  }, []);

  useEffect(() => {
    fetchData(formatDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const el = document.querySelector(".scroll-content");
      if (el) {
        el.scrollTop = (el.scrollTop + 1) % (el.scrollHeight / 2);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [weekly]);

  const todayStr = formatDate(new Date());
  const currentStr = formatDate(selectedDate);

  const hasPrev =
    availableDates.length > 0 && availableDates.indexOf(currentStr) > 0;

  const hasNext =
    availableDates.length > 0 &&
    availableDates.indexOf(currentStr) !== -1 &&
    availableDates.indexOf(currentStr) < availableDates.length - 1 &&
    currentStr !== todayStr;

  const handlePrev = () => {
    if (!hasPrev) return;
    const idx = availableDates.indexOf(currentStr);
    setSelectedDate(new Date(availableDates[idx - 1]));
  };

  const handleNext = () => {
    if (!hasNext) return;
    const idx = availableDates.indexOf(currentStr);
    setSelectedDate(new Date(availableDates[idx + 1]));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Roboto, sans-serif",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url('https://static.mediacdn.vn/TaoMauNhung/images/bg-newsv3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          margin: "10px 20px",
          padding: "15px 25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src="/logo.svg" alt="Logo" style={{ width: 60, height: 60 }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#a90000",
              fontWeight: 900,
              fontSize: "24px",
              textTransform: "uppercase",
            }}
          >
            Lịch công tác
          </div>
          <div
            style={{
              color: "#333",
              fontSize: "16px",
              fontWeight: 500,
              marginTop: "4px",
            }}
          >
            {formatDisplay(selectedDate)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            position: "relative",
          }}
        >
          <button
            onClick={() => {
              const picker = document.getElementById(
                "date-picker"
              ) as HTMLInputElement;
              if (picker) {
                picker.style.visibility = "visible";
                picker.style.opacity = "1";
                picker.style.pointerEvents = "auto";
                picker.showPicker?.();
                setTimeout(() => {
                  picker.style.visibility = "hidden";
                  picker.style.opacity = "0";
                  picker.style.pointerEvents = "none";
                }, 300);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 600,
              color: "#a90000",
              textTransform: "uppercase",
            }}
          >
            <span style={{ fontSize: "24px" }}>📅</span> Lịch ngày
          </button>

          <input
            id="date-picker"
            type="date"
            onChange={(e) => {
              if (e.target.value) setSelectedDate(new Date(e.target.value));
            }}
            value={formatDate(selectedDate)}
            max={todayStr}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              zIndex: 10,
              transform: "translateY(10px)",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px 15px",
              fontSize: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "white",
              visibility: "hidden",
              opacity: 0,
              pointerEvents: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          />
        </div>
      </header>

      {/* ================= NỘI DUNG ================= */}
      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: "20px",
          padding: "10px 20px 0",
          alignItems: "start",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#a90000",
              color: "white",
              fontWeight: 700,
              fontSize: "18px",
              padding: "10px 15px",
            }}
          >
            Lịch trong ngày
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: "8px" }}>Thời gian</th>
                <th style={{ padding: "8px" }}>Nội dung</th>
                <th style={{ padding: "8px" }}>Thành phần</th>
                <th style={{ padding: "8px" }}>Địa điểm</th>
              </tr>
            </thead>
            <tbody>
              {daily.length > 0 ? (
                daily.map((d, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      {d.time}
                    </td>
                    <td style={{ padding: "8px" }}>{d.content}</td>
                    <td style={{ padding: "8px" }}>{d.participants}</td>
                    <td style={{ padding: "8px" }}>{d.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "15px",
                      fontStyle: "italic",
                      color: "#555",
                    }}
                  >
                    Không có lịch công tác cho ngày này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
            height: "calc(100vh - 200px)",
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundColor: "#a90000",
              color: "white",
              fontWeight: 700,
              fontSize: "18px",
              padding: "10px 15px",
              textAlign: "center",
            }}
          >
            Lịch trong tuần
          </div>

          <div
            style={{
              height: "100%",
              overflowY: "hidden",
              position: "relative",
            }}
          >
            <div
              className="scroll-content"
              style={{
                position: "absolute",
                width: "100%",
                animation: "scroll-up 50s linear infinite",
              }}
            >
              {[...weekly, ...weekly].map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "25% 20% 55%",
                    borderBottom: "1px solid #eee",
                    padding: "8px 12px",
                    backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <div style={{ textAlign: "center" }}>{w.day || "-"}</div>
                  <div style={{ textAlign: "center" }}>{w.time || "-"}</div>
                  <div>{w.content || ""}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>
          {`
          @keyframes scroll-up {
            0%   { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .scroll-content:hover {
            animation-play-state: paused;
          }
          `}
        </style>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 30px",
          marginTop: "10px",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          style={{
            backgroundColor: hasPrev ? "#a90000" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: "10px 20px",
            fontWeight: 600,
            cursor: hasPrev ? "pointer" : "not-allowed",
            boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
          }}
        >
          ⬅️ Ngày trước
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNext}
          style={{
            backgroundColor: hasNext ? "#a90000" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: "10px 20px",
            fontWeight: 600,
            cursor: hasNext ? "pointer" : "not-allowed",
            boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
          }}
        >
          Ngày kế tiếp ➡️
        </button>
      </footer>
    </div>
  );
}
