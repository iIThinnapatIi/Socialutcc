// src/SentimentLexicon.jsx
import React, { useState } from "react";

const initialWords = [
    { id: 1, phrase: "มหาลัยน่ารักมาก", sentiment: "positive" },
    { id: 2, phrase: "เฉยๆ ไม่ได้ว้าว", sentiment: "neutral" },
    { id: 3, phrase: "เกินอะแก", sentiment: "negative" }, // ตัวอย่างคำใหม่
];

const sentimentLabel = {
    positive: "positive",
    neutral: "neutral",
    negative: "negative",
};

export default function SentimentLexicon() {
    const [items, setItems] = useState(initialWords);
    const [phrase, setPhrase] = useState("");
    const [sentiment, setSentiment] = useState("positive");

    const handleAdd = (e) => {
        e.preventDefault();
        if (!phrase.trim()) return;

        const newItem = {
            id: Date.now(),
            phrase: phrase.trim(),
            sentiment,
        };

        // ตอนนี้เก็บใน state ก่อน (ให้เห็นรูปร่าง)
        setItems((prev) => [newItem, ...prev]);
        setPhrase("");

        // -----------------------------
        // TODO: ต่อ backend ภายหลัง
        // ตัวอย่าง (เมื่อมี API จริง):
        //
        // await axios.post("/api/lexicon", {
        //   phrase: newItem.phrase,
        //   sentiment: newItem.sentiment,
        // });
        // -----------------------------
    };

    return (
        <>
            <h3 className="card-title">Custom Sentiment Dictionary</h3>
            <p className="card-sub">
                เพิ่มคำ/สำนวนที่ใช้จริงในโซเชียล แล้วระบุว่าคำนี้เป็นแง่ดี กลาง หรือแย่
                เพื่อช่วยให้ระบบวิเคราะห์ได้ตรงกับบริบทปัจจุบันมากขึ้น
            </p>

            {/* ฟอร์มเพิ่มคำใหม่ */}
            <form onSubmit={handleAdd} style={{ marginTop: 10 }}>
                <div className="filters-row">
                    <div className="filter-item" style={{ flex: 2 }}>
                        <label>คำ / สำนวน</label>
                        <input
                            type="text"
                            placeholder="เช่น เกินอะแก, ดีย์, เฟลมาก"
                            value={phrase}
                            onChange={(e) => setPhrase(e.target.value)}
                        />
                    </div>

                    <div className="filter-item" style={{ minWidth: 160 }}>
                        <label>ค่า sentiment</label>
                        <select
                            value={sentiment}
                            onChange={(e) => setSentiment(e.target.value)}
                        >
                            <option value="positive">positive</option>
                            <option value="neutral">neutral</option>
                            <option value="negative">negative</option>
                        </select>
                    </div>

                    <div
                        className="filter-item"
                        style={{ alignSelf: "flex-end", marginBottom: 2 }}
                    >
                        <button type="submit" className="primary-btn">
                            + เพิ่มคำใหม่
                        </button>
                    </div>
                </div>
            </form>

            {/* ตารางคำที่ถูกเพิ่มไว้ */}
            <div className="table-wrapper" style={{ marginTop: 14 }}>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>คำ / สำนวน</th>
                        <th>ค่า sentiment</th>
                        <th>ตัวอย่างการใช้งาน (อนาคตต่อยอดได้)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((w) => (
                        <tr key={w.id}>
                            <td>{w.phrase}</td>
                            <td>
                  <span
                      className={`pill ${
                          w.sentiment === "positive"
                              ? "pill-pos"
                              : w.sentiment === "neutral"
                                  ? "pill-neu"
                                  : "pill-neg"
                      }`}
                  >
                    {sentimentLabel[w.sentiment]}
                  </span>
                            </td>
                            <td style={{ fontSize: 12, color: "#9ca3af" }}>
                                (ไว้แสดงตัวอย่างโพสต์ที่มีคำนี้ในอนาคต)
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={3} style={{ fontSize: 13, color: "#9ca3af" }}>
                                ยังไม่มีคำที่กำหนดเอง ลองเพิ่มคำใหม่ด้านบน
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
