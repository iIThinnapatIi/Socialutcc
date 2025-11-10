// src/components/MentionsTable.jsx
import React, { useEffect, useState } from "react";
import { getMentions } from "../services/api";

function MentionsTable({
                           q = "",
                           faculty = "ทั้งหมด",
                           sent = "ทั้งหมด",
                           from = "",
                           to = "",
                           page = 1,
                           onPageChange,
                       }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const pageSize = 10;

    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const data = await getMentions({
                    q,
                    faculty,
                    sent,
                    from,
                    to,
                    page,
                    size: pageSize,
                });

                // ป้องกัน backend คืน null/undefined
                const safe = (data || []).map((it) => ({
                    id: it.id,
                    title: it.title ?? "-",              // <- มาจาก summary ฝั่ง backend
                    faculty: it.faculty ?? "unknown",    // <- มาจาก faculty_code
                    sentiment: it.sentiment ?? "unknown",
                    created_at: it.created_at ?? "",
                    source: it.source ?? "-",
                }));

                if (!cancel) setRows(safe);
            } catch (e) {
                if (!cancel) setErr(e?.message || "โหลดรายการไม่สำเร็จ");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();

        return () => { cancel = true; };
    }, [q, faculty, sent, from, to, page]);

    const next = () => onPageChange?.(page + 1);
    const prev = () => onPageChange?.(Math.max(1, page - 1));

    return (
        <section className="card">
            <div className="card-header">
                <div className="card-title">รายการโพสต์ทั้งหมด</div>
                <div className="card-actions">
                    <button className="btn ghost" onClick={prev} disabled={page <= 1}>
                        ก่อนหน้า
                    </button>
                    <span style={{ padding: "0 8px" }}>หน้า {page}</span>
                    <button
                        className="btn ghost"
                        onClick={next}
                        disabled={rows.length < pageSize}
                    >
                        ถัดไป
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="card-body">กำลังโหลด...</div>
            ) : err ? (
                <div className="card-body error">เกิดข้อผิดพลาด: {err}</div>
            ) : rows.length === 0 ? (
                <div className="card-body">ไม่พบข้อมูล</div>
            ) : (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                        <tr>
                            <th style={{ width: 56 }}>#</th>
                            <th>Title</th>
                            <th>Faculty</th>
                            <th>Sentiment</th>
                            <th>Date</th>
                            <th>Source</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((item, idx) => (
                            <tr key={item.id ?? `${page}-${idx}`}>
                                <td>{(page - 1) * pageSize + idx + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.faculty}</td>
                                <td className={`tag tag-${(item.sentiment || "").toLowerCase()}`}>
                                    {item.sentiment}
                                </td>
                                <td>{item.created_at}</td>
                                <td>{item.source}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default MentionsTable;
