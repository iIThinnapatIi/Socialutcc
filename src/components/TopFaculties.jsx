// src/components/TopFaculties.jsx
import { useEffect, useState } from "react";
import { getFacultySummary } from "../services/api";

export default function TopFaculties() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await getFacultySummary(); // [{ faculty_code, faculty_name, total }]
                setItems(data || []);
            } catch (e) {
                setError(e.message || "โหลดข้อมูลไม่สำเร็จ");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (error) return <div className="widget-card">โหลดข้อมูลไม่สำเร็จ: {error}</div>;
    if (loading) return <div className="widget-card">กำลังโหลดข้อมูล...</div>;

    return (
        <div className="widget-card">
            <h3 className="widget-title">Top Faculties</h3>
            <ul style={{ marginTop: 10 }}>
                {items.map((f, i) => (
                    <li key={i}>
                        <b>{f.faculty_name || f.faculty_code}</b> — {f.total} mentions
                    </li>
                ))}
            </ul>
        </div>
    );
}
