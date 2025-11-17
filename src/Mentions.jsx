// src/Mentions.jsx
import React from "react";

export default function Mentions() {
    return (
        <div className="page">
            <div className="page-header">
                <h2>Mentions Management</h2>
                <p>ดูและจัดการโพสต์/คอมเมนต์ที่พูดถึงมหาวิทยาลัยแบบ real-time</p>
            </div>

            {/* filter bar */}
            <section className="card">
                <h3 className="card-title">Filters</h3>
                <div className="filters-row">
                    <div className="filter-item">
                        <label>ค้นหาคำสำคัญ</label>
                        <input placeholder="เช่น ม.รังสิต, UTCC, ค่าเทอม" />
                    </div>
                    <div className="filter-item">
                        <label>คณะ</label>
                        <select>
                            <option>ทั้งหมด</option>
                            <option>คณะบริหารธุรกิจ</option>
                            <option>คณะนิเทศศาสตร์</option>
                            <option>คณะบัญชี</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Sentiment</label>
                        <select>
                            <option>ทั้งหมด</option>
                            <option>บวก</option>
                            <option>กลาง</option>
                            <option>ลบ</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>ช่วงเวลา</label>
                        <div className="filter-dates">
                            <input type="date" />
                            <span style={{ padding: "0 4px" }}>–</span>
                            <input type="date" />
                        </div>
                    </div>
                    <button className="primary-btn">Apply</button>
                </div>
            </section>

            {/* summary row */}
            <section className="card">
                <h3 className="card-title">สรุป Mentions ล่าสุด (mock data)</h3>
                <div className="summary-row">
                    <div className="summary-box positive">
                        <div className="summary-label">บวก</div>
                        <div className="summary-value">120</div>
                    </div>
                    <div className="summary-box neutral">
                        <div className="summary-label">กลาง</div>
                        <div className="summary-value">80</div>
                    </div>
                    <div className="summary-box negative">
                        <div className="summary-label">ลบ</div>
                        <div className="summary-value">45</div>
                    </div>
                </div>
            </section>

            {/* table */}
            <section className="card">
                <h3 className="card-title">รายการ Mentions</h3>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>เวลา</th>
                            <th>แหล่ง</th>
                            <th>ข้อความ</th>
                            <th>คณะ</th>
                            <th>Sentiment</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>2025-11-16 12:30</td>
                            <td>Twitter</td>
                            <td>ชอบกิจกรรมของคณะนิเทศฯ มาก ๆ เลย 🎉</td>
                            <td>นิเทศศาสตร์</td>
                            <td className="pill pill-pos">Positive</td>
                        </tr>
                        <tr>
                            <td>2025-11-16 11:02</td>
                            <td>Pantip</td>
                            <td>ค่าเทอมแพงขึ้นไหมปีนี้ มีทุนอะไรบ้าง</td>
                            <td>ทั้งหมด</td>
                            <td className="pill pill-neu">Neutral</td>
                        </tr>
                        <tr>
                            <td>2025-11-15 21:17</td>
                            <td>Facebook</td>
                            <td>ระบบลงทะเบียนมีปัญหาบ่อยมาก อยากให้ปรับปรุง</td>
                            <td>บริหารธุรกิจ</td>
                            <td className="pill pill-neg">Negative</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* pager mock */}
                <div className="pager">
                    <button disabled>&laquo;</button>
                    <button className="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>&raquo;</button>
                </div>
            </section>
        </div>
    );
}
