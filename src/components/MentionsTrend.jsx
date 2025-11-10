import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { getTrendDaily } from "../services/api";

// ใช้ได้ทั้งแบบไม่ส่งช่วงเวลา หรือส่ง prop from/to (รูปแบบ YYYY-MM-DD)
export default function MentionsTrend({ from, to }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const rows = await getTrendDaily({ from, to });
                if (!alive) return;

                // กรองวันที่ว่าง และเรียงวันที่ (กัน backend ส่งสลับ)
                const cleaned = rows
                    .filter((r) => r.date && String(r.date).trim() !== "")
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                setData(cleaned);
            } catch (e) {
                if (!alive) return;
                setError(e.message || "โหลดข้อมูลไม่สำเร็จ");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [from, to]);

    return (
        <div className="widget-card widget-mentions-trend">
            <h3 className="widget-title">Mention Trends</h3>

            {error ? (
                <div className="chart-placeholder">โหลดข้อมูลไม่สำเร็จ</div>
            ) : loading ? (
                <div className="chart-placeholder">กำลังโหลด…</div>
            ) : data.length === 0 ? (
                <div className="chart-placeholder">ไม่มีข้อมูล</div>
            ) : (
                <div style={{ height: 260, background: "var(--light-bg)", borderRadius: 10, padding: 10 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} domain={[0, "auto"]} />
                            <Tooltip
                                labelFormatter={(lbl) => `วันที่ ${lbl}`}
                                formatter={(v) => [`${v} mentions`, "รวมทั้งหมด"]} // [value, name]
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#1e88e5"
                                dot={false}
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                            {/* ถ้าต้องการแยก sentiment ในอนาคต เอาคอมเมนต์ออก
              <Line type="monotone" dataKey="pos" stroke="#2e7d32" dot={false} />
              <Line type="monotone" dataKey="neu" stroke="#f9a825" dot={false} />
              <Line type="monotone" dataKey="neg" stroke="#c62828" dot={false} />
              */}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
