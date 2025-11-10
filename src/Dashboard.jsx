// src/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

import {
    getSentimentSummary,   // [{ sentiment, total }]
    getTrendDaily,         // [{ ymd|date, total|count }]
    getSummaryByApp        // [{ app, total, pos, neu, neg }]
} from "./services/api";

import {
    ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell,
    BarChart, Bar, Legend
} from "recharts";

const COLORS = {
    green: "#22C55E",
    red:   "#EF4444",
    gray:  "#ffc107"
};

export default function Dashboard() {
    // ---------- state ----------
    const [sum, setSum] = useState([]);        // donut (sentiment summary)
    const [trend, setTrend] = useState([]);    // daily
    const [apps, setApps] = useState([]);      // by-app summary
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    // ---------- fetch ----------
    useEffect(() => {
        (async () => {
            setLoading(true);
            setErr(null);
            try {
                const [s, tDaily, sApp] = await Promise.all([
                    getSentimentSummary(),
                    getTrendDaily(),
                    getSummaryByApp()
                ]);

                setSum(Array.isArray(s) ? s : []);

                setTrend((Array.isArray(tDaily) ? tDaily : []).map(x => ({
                    date: x.ymd || x.date,
                    count: Number(x.total ?? x.count ?? 0),
                })));

                setApps((Array.isArray(sApp) ? sApp : []).map(r => ({
                    app: r.app || r.source || "-",
                    total: Number(r.total || 0),
                    pos: Number(r.pos || 0),
                    neu: Number(r.neu || 0),
                    neg: Number(r.neg || 0),
                })));
            } catch (e) {
                setErr(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ---------- totals ----------
    const totals = useMemo(() => {
        const pos = Number(sum.find(x => x.sentiment === "positive")?.total || 0);
        const neu = Number(sum.find(x => x.sentiment === "neutral")?.total || 0);
        const neg = Number(sum.find(x => x.sentiment === "negative")?.total || 0);
        return { pos, neu, neg, all: pos + neu + neg };
    }, [sum]);

    const sentShare = useMemo(() => ([
        { name: "Positive", value: totals.pos, color: COLORS.green },
        { name: "Neutral",  value: totals.neu, color: COLORS.gray },
        { name: "Negative", value: totals.neg, color: COLORS.red  },
    ]), [totals]);

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo-container">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/th/f/f5/%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B8%AB%E0%B8%AD%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2.svg"
                        width="100%" alt="UTCC"
                    />
                    <span className="logo-utcc"> UTCC </span>
                    <span className="logo-social"> Social</span>
                </div>

                <nav className="nav-menu">
                    <Link to="/dashboard" className="nav-item active">
                        <i className="far fa-chart-line"></i><span>Dashboard</span>
                    </Link>
                    <Link to="/mentions" className="nav-item">
                        <i className="fas fa-comment-dots"></i><span>Mentions</span>
                    </Link>
                    <Link to="/trends" className="nav-item">
                        <i className="fas fa-stream"></i><span>Trends</span>
                    </Link>
                    <Link to="/settings" className="nav-item">
                        <i className="fas fa-cog"></i><span>Settings</span>
                    </Link>
                </nav>
            </div>

            {/* Main */}
            <div className="main-content">
                <header className="main-header">
                    <div className="header-left">
                        <h1 className="header-title">Dashboard</h1>
                        <div className="subhead">
                            ผลลัพธ์ทั้งหมด <b>{loading ? "…" : totals.all.toLocaleString()}</b> รายการ
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Search" />
                        </div>
                        <div className="profile-icon">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </header>

                {err && (
                    <div className="widget-card error-card">
                        โหลดข้อมูลไม่สำเร็จ: {String(err)}
                    </div>
                )}

                {/* Widgets */}
                <main className="widgets-grid">
                    {/* Metrics */}
                    <div className="widget-metrics">
                        <div className="metric-card">
                            <div className="metric-title">Total Mentions</div>
                            <div className="metric-value">
                                {loading ? "…" : totals.all.toLocaleString()}
                            </div>
                            <div className="metric-sub">
                                {loading ? "" : `POS ${totals.pos} · NEU ${totals.neu} · NEG ${totals.neg}`}
                            </div>
                            <div className="progress">
                                <span className="bar bar-pos" style={{ width: `${(totals.pos/(totals.all||1))*100}%` }} />
                                <span className="bar bar-neu" style={{ width: `${(totals.neu/(totals.all||1))*100}%` }} />
                                <span className="bar bar-neg" style={{ width: `${(totals.neg/(totals.all||1))*100}%` }} />
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-title">Sentiment Overview</div>
                            <div className="pie-wrap">
                                {loading ? (
                                    <div className="chart-placeholder">กำลังโหลด...</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={140}>
                                        <PieChart>
                                            <Pie
                                                data={sentShare}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={38}
                                                outerRadius={58}
                                                paddingAngle={2}
                                            >
                                                {sentShare.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                            {!loading && (
                                <div className="legend-inline">
                                    <span className="dot" style={{ background: COLORS.green }} /> POS &nbsp;&nbsp;
                                    <span className="dot" style={{ background: COLORS.gray  }} /> NEU &nbsp;&nbsp;
                                    <span className="dot" style={{ background: COLORS.red   }} /> NEG
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mentions Trend (Daily) */}
                    <div className="widget-card">
                        <h3 className="widget-title">Mentions Trend</h3>
                        {loading ? (
                            <div className="chart-placeholder">กำลังโหลด...</div>
                        ) : (trend.length === 0 ? (
                            <div className="chart-placeholder">ยังไม่มีข้อมูลวันที่</div>
                        ) : (
                            <div style={{ width: "100%", height: 220 }}>
                                <ResponsiveContainer>
                                    <LineChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" strokeWidth={2} dot />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ))}
                    </div>

                    {/* Top Sources (Apps) */}
                    <div className="widget-card">
                        <h3 className="widget-title">Top Sources (Apps)</h3>
                        {loading ? (
                            <div className="chart-placeholder">กำลังโหลด...</div>
                        ) : apps.length === 0 ? (
                            <div className="chart-placeholder">ไม่พบข้อมูล</div>
                        ) : (
                            <div style={{ width: "100%", height: 220 }}>
                                <ResponsiveContainer>
                                    <BarChart
                                        data={[...apps].sort((a,b)=>b.total-a.total)}
                                        layout="vertical"
                                        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" allowDecimals={false} />
                                        <YAxis type="category" dataKey="app" width={120} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="pos" stackId="a" name="Positive" fill="#2E7D32" />
                                        <Bar dataKey="neu" stackId="a" name="Neutral"  fill="#FBC02D" />
                                        <Bar dataKey="neg" stackId="a" name="Negative" fill="#C62828" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Sentiment by App */}
                    <div className="widget-card">
                        <h3 className="widget-title">Sentiment by App</h3>
                        {loading ? (
                            <div className="chart-placeholder">กำลังโหลด...</div>
                        ) : apps.length === 0 ? (
                            <div className="chart-placeholder">ไม่พบข้อมูล</div>
                        ) : (
                            <div style={{ width: "100%", height: 240 }}>
                                <ResponsiveContainer>
                                    <BarChart
                                        data={[...apps].sort((a,b)=>b.total-a.total)}
                                        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="app" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="pos" stackId="b" name="Positive" fill="#2E7D32" />
                                        <Bar dataKey="neu" stackId="b" name="Neutral"  fill="#FBC02D" />
                                        <Bar dataKey="neg" stackId="b" name="Negative" fill="#C62828" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
