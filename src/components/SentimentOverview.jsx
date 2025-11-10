// src/components/SentimentOverview.jsx
import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip, Legend
} from "recharts";
import { getSentimentSummary } from "../services/api";

const COLORS = {
    positive: "#22C55E", // เขียว
    neutral:  "#ffc107", // เทา
    negative: "#EF4444", // แดง
    unknown:  "#9E9E9E", // สำรอง (ถ้ามี Unknown)
};

export default function SentimentOverview() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await getSentimentSummary();

                // แปลงข้อมูลจาก backend ให้อยู่ในรูปแบบ PieChart ใช้ได้
                // [{ sentiment:'positive', total:26 }, ...]
                const mapped = (res || []).map((d) => {
                    const s = (d.sentiment || "").toLowerCase();
                    return {
                        name:
                            s === "positive" ? "Positive" :
                                s === "negative" ? "Negative" :
                                    s === "neutral"  ? "Neutral"  : "Unknown",
                        value: Number(d.total || 0),
                    };
                });

                // เรียงเป็น Positive → Neutral → Negative → Unknown
                const order = { Positive: 0, Neutral: 1, Negative: 2, Unknown: 3 };
                mapped.sort((a, b) => order[a.name] - order[b.name]);

                setData(mapped);
            } catch (e) {
                console.error("Error loading sentiment summary:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const colorOf = (name) => {
        const n = (name || "").toLowerCase();
        if (n === "positive") return COLORS.positive;
        if (n === "negative") return COLORS.negative;
        if (n === "neutral") return COLORS.neutral;
        return COLORS.unknown;
    };

    return (
        <div className="widget-card widget-sentiment">
            <h3 className="widget-title">Sentiment Overview</h3>
            <div style={{ width: "100%", height: 260 }}>
                {error ? (
                    <div className="chart-placeholder">โหลดข้อมูลไม่สำเร็จ</div>
                ) : loading ? (
                    <div className="chart-placeholder">กำลังโหลด…</div>
                ) : (
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={90}
                                label
                                paddingAngle={2}
                            >
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={colorOf(entry.name)} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            {!loading && !error && (
                <div className="legend-inline" style={{ marginTop: 8 }}>
                    <span className="dot" style={{ background: COLORS.positive }} /> Positive&nbsp;&nbsp;
                    <span className="dot" style={{ background: COLORS.neutral  }} /> Neutral&nbsp;&nbsp;
                    <span className="dot" style={{ background: COLORS.negative }} /> Negative
                </div>
            )}
        </div>
    );
}
