// src/Trends.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./Trends.css";
import { Link } from "react-router-dom";
import { getTopicsSummary, getLatest } from "./services/api";

const clip = (s, n = 60) => (s && s.length > n ? s.slice(0, n) + "…" : s || "-");

export default function Trends() {
    // ------------ state ------------
    const [topics, setTopics] = useState([]);   // [{topic,total}]
    const [latest, setLatest] = useState([]);   // rows จาก v_latest_mentions
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [q, setQ] = useState("");

    // ------------ fetch ------------
    useEffect(() => {
        (async () => {
            setLoading(true);
            setErr(null);
            try {
                const [tp, lt] = await Promise.all([
                    getTopicsSummary(),              // -> [{topic,total}] (เรียงมาก→น้อยอยู่แล้ว)
                    getLatest({ page: 0, size: 20 }),// -> รายการล่าสุด
                ]);
                setTopics(Array.isArray(tp) ? tp : []);
                setLatest(Array.isArray(lt) ? lt : []);
            } catch (e) {
                setErr(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // top10 chips จาก /topics/summary
    const keywordsTop10 = useMemo(
        () => topics.slice(0, 10).map(x => ({ keyword: x.topic, count: Number(x.total || 0) })),
        [topics]
    );

    // map latest -> ตาราง
    const trendingPosts = useMemo(() => {
        return latest.map((r, i) => {
            const title =
                r.title ||
                r.text ||
                (Array.isArray(r.topics) && r.topics.length ? r.topics.join(", ") : "โพสต์");
            const date =
                (r.created_at || r.analyzed_at || r.createdAt || r.analyzedAt || "").toString().slice(0, 10);
            const url =
                r.url
                    ? r.url
                    : r.tweet_id
                        ? `https://x.com/i/web/status/${r.tweet_id}`
                        : "#";
            const source = r.source || r.app || r.source_table || "X";

            return {
                id: r.id ?? r.tweet_id ?? i,
                title: clip(title, 80),
                date,
                source,
                url,
            };
        });
    }, [latest]);

    // ค้นหาในตาราง
    const filteredTrending = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return trendingPosts;
        return trendingPosts.filter(p =>
            `${p.title} ${p.source}`.toLowerCase().includes(qq)
        );
    }, [q, trendingPosts]);

    const totalMentions = latest.length;

    return (
        <div className="trends-layout">
            {/* Sidebar ให้หน้าตาเหมือนหน้าอื่น */}
            <aside className="sidebar">
                <div className="logo-container">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/th/f/f5/%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B8%AB%E0%B8%AD%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2.svg"
                        width="100%" alt="UTCC"
                    />
                    <span className="logo-utcc"> UTCC </span>
                    <span className="logo-social"> Social</span>
                </div>

                <nav className="nav-menu">
                    <Link to="/dashboard" className="nav-item">
                        <i className="far fa-chart-line"></i><span>Dashboard</span>
                    </Link>
                    <Link to="/mentions" className="nav-item">
                        <i className="fas fa-comment-dots"></i><span>Mentions</span>
                    </Link>
                    <Link to="/trends" className="nav-item active">
                        <i className="fas fa-stream"></i><span>Trends</span>
                    </Link>
                    <Link to="/settings" className="nav-item">
                        <i className="fas fa-cog"></i><span>Settings</span>
                    </Link>
                </nav>
            </aside>

            {/* Content */}
            <main className="main-content">
                <header className="page-header">
                    <div className="title-wrap">
                        <h1 className="page-title">Trends</h1>
                        <div className="page-sub">
                            * รวมทั้งหมด <b>{totalMentions}</b> รายการ
                        </div>
                    </div>
                </header>

                <div className="content-wrap">
                    {/* Top Keywords */}
                    <section className="card">
                        <div className="card-head">
                            <h3 className="widget-title">Top Keywords</h3>
                        </div>

                        {loading ? (
                            <div className="placeholder">กำลังโหลด...</div>
                        ) : keywordsTop10.length === 0 ? (
                            <div className="placeholder">ไม่มีข้อมูล</div>
                        ) : (
                            <div className="keywords-grid">
                                {keywordsTop10.map((k) => (
                                    <div key={k.keyword} className="kw-chip" title={`${k.keyword} · ${k.count}`}>
                                        <div className="kw-word">{k.keyword}</div>
                                        <div className="kw-count">{k.count}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Trending Posts */}
                    <section className="card">
                        <div className="card-head">
                            <h3 className="widget-title">Trending Posts</h3>
                            <input
                                className="search"
                                placeholder="🔍 ค้นหาโพสต์"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </div>

                        {err && <div className="error-card">โหลดข้อมูลไม่สำเร็จ: {String(err)}</div>}

                        {loading ? (
                            <div className="placeholder">กำลังโหลด...</div>
                        ) : (
                            <div className="table">
                                <div className="t-head">
                                    <div>Title</div>
                                    <div>Date</div>
                                    <div>Source</div>
                                    <div>Link</div>
                                </div>

                                {filteredTrending.map((p) => (
                                    <div className="t-row" key={p.id}>
                                        <div className="title-cell" title={p.title}>{p.title}</div>
                                        <div>{p.date || "-"}</div>
                                        <div>{p.source}</div>
                                        <div>
                                            {p.url && p.url !== "#" ? (
                                                <a className="link" href={p.url} target="_blank" rel="noreferrer">เปิดลิงก์</a>
                                            ) : "-"}
                                        </div>
                                    </div>
                                ))}

                                {filteredTrending.length === 0 && (
                                    <div className="empty-row">ไม่พบรายการ</div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
