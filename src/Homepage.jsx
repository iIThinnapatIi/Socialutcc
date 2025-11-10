// src/Homepage.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";

// services
import { getSentimentSummary, getMentionsTrend } from "./services/api";

// components
import FiltersBar from "./components/FiltersBar";
import SentimentOverview from "./components/SentimentOverview";
import MentionsTrend from "./components/MentionsTrend";
import MetricsRow from "./components/MetricsRow";
import MentionsTable from "./components/MentionsTable";
import { downloadCSV } from "./utils/csv";

function Homepage() {
    // ---------- filter states ----------
    const [q, setQ] = useState("");
    const [faculty, setFaculty] = useState("ทั้งหมด");
    const [sent, setSent] = useState("ทั้งหมด");
    const [from, setFrom] = useState(""); // YYYY-MM-DD (หรือมีเวลาได้)
    const [to, setTo] = useState("");
    const [page, setPage] = useState(1);

    // faculties ที่โชว์ใน dropdown (ปรับเพิ่ม/ลดได้)
    const faculties = useMemo(
        () => [
            "ทั้งหมด",
            "คณะบริหารธุรกิจ",
            "คณะวิทยาศาสตร์ฯ (CS)",
            "คณะนิติศาสตร์",
            "คณะบัญชี",
            "บริการ/สิ่งอำนวยความสะดวก",
        ],
        []
    );

    // ---------- load sentiment summary ----------
    const [sumData, setSumData] = useState([]);
    const [sumLoading, setSumLoading] = useState(true);
    const [sumErr, setSumErr] = useState(null);

    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                setSumLoading(true);
                setSumErr(null);
                const rows = await getSentimentSummary(); // -> [{sentiment,total}]
                const toName = (s) => {
                    const x = (s || "").toLowerCase();
                    if (x === "positive" || x === "pos") return "Positive";
                    if (x === "negative" || x === "neg") return "Negative";
                    return "Neutral";
                };
                const mapped = (rows || []).map((r) => ({
                    name: toName(r.sentiment),
                    value: Number(r.total || 0),
                }));
                // ให้เรียงเป็น Pos/Neu/Neg เพื่อแมตช์สีใน component
                const order = { Positive: 0, Neutral: 1, Negative: 2 };
                mapped.sort((a, b) => order[a.name] - order[b.name]);
                if (!cancel) setSumData(mapped);
            } catch (e) {
                if (!cancel) setSumErr(e?.message || "โหลดสรุปอารมณ์ไม่สำเร็จ");
            } finally {
                if (!cancel) setSumLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, []);

    // KPI รวม (ดึงจาก sumData เพื่อให้ตรงกับวงกลม)
    const total = useMemo(() => sumData.reduce((acc, r) => acc + (r.value || 0), 0), [sumData]);
    const pos = useMemo(() => sumData.find((x) => x.name === "Positive")?.value || 0, [sumData]);
    const neu = useMemo(() => sumData.find((x) => x.name === "Neutral")?.value || 0, [sumData]);
    const neg = useMemo(() => sumData.find((x) => x.name === "Negative")?.value || 0, [sumData]);

    // ---------- load trend ----------
    const [trendData, setTrendData] = useState([]);
    const [trendLoading, setTrendLoading] = useState(true);
    const [trendErr, setTrendErr] = useState(null);

    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                setTrendLoading(true);
                setTrendErr(null);
                const rows = await getMentionsTrend(); // -> [{ymd,count}]
                const mapped = (rows || []).map((r) => ({
                    date: r.ymd,            // 'YYYY-MM-DD'
                    count: Number(r.count || 0),
                }));
                if (!cancel) setTrendData(mapped);
            } catch (e) {
                if (!cancel) setTrendErr(e?.message || "โหลดเทรนด์ไม่สำเร็จ");
            } finally {
                if (!cancel) setTrendLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, []);

    // ---------- export CSV (จาก KPI summary) ----------
    const exportCSV = () => {
        const flat = [
            { sentiment: "Positive", total: pos },
            { sentiment: "Neutral", total: neu },
            { sentiment: "Negative", total: neg },
            { sentiment: "All", total },
        ];
        downloadCSV(flat, "sentiment_summary.csv");
    };

    const resetFilters = () => {
        setQ("");
        setFaculty("ทั้งหมด");
        setSent("ทั้งหมด");
        setFrom("");
        setTo("");
        setPage(1);
    };

    return (
        <div className="homepage-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo-container">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/th/f/f5/%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B8%AB%E0%B8%AD%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2.svg"
                        width="100%"
                        alt="UTCC"
                    />
                    <span className="logo-utcc"> UTCC </span>
                    <span className="logo-social"> Social</span>
                </div>

                <nav className="nav-menu">
                    <Link to="/dashboard" className="nav-item">
                        <i className="far fa-chart-line"></i>
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/mentions" className="nav-item active">
                        <i className="fas fa-comment-dots"></i>
                        <span>Mentions</span>
                    </Link>

                    <Link to="/trends" className="nav-item">
                        <i className="fas fa-stream"></i>
                        <span>Trends</span>
                    </Link>
                    <Link to="/settings" className="nav-item">
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <header className="main-header">
                    <div className="header-left">
                        <h1 className="header-title">Mentions & Sentiment</h1>
                        <div className="subhead">
                            ผลลัพธ์ทั้งหมด <b>{total.toLocaleString()}</b> รายการ
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="toolbar">
                            <button className="btn ghost" onClick={resetFilters}>
                                รีเซ็ตตัวกรอง
                            </button>
                            <button className="btn primary" onClick={exportCSV}>
                                Export CSV
                            </button>
                        </div>
                        <div className="profile-icon">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className="filters-sticky">
                    <FiltersBar
                        q={q}
                        setQ={setQ}
                        faculty={faculty}
                        setFaculty={setFaculty}
                        sent={sent}
                        setSent={setSent}
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        faculties={faculties}
                        onReset={resetFilters}
                    />
                </div>

                {/* KPI */}
                <section className="kpi-grid">
                    <div className="kpi-card pos">
                        <div className="kpi-title">Positive</div>
                        <div className="kpi-value">{pos}</div>
                    </div>
                    <div className="kpi-card neu">
                        <div className="kpi-title">Neutral</div>
                        <div className="kpi-value">{neu}</div>
                    </div>
                    <div className="kpi-card neg">
                        <div className="kpi-title">Negative</div>
                        <div className="kpi-value">{neg}</div>
                    </div>
                </section>

                {/* Charts */}
                <main className="widgets-grid">
                    <SentimentOverview data={sumData} loading={sumLoading} error={sumErr} />
                    <MentionsTrend data={trendData} loading={trendLoading} error={trendErr} />
                    <MetricsRow total={total} loading={sumLoading || trendLoading} />
                </main>

                {/* ตารางโพสต์: ให้ดึงตรงจาก backend เอง (เราทำไว้ใน MentionsTable แล้ว) */}
                <MentionsTable
                    q={q}
                    faculty={faculty}
                    sent={sent}
                    from={from}
                    to={to}
                    page={page}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}

export default Homepage;
