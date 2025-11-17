// src/HistoryPage.jsx
import React from "react";

export default function HistoryPage() {
    return (
        <div className="page">
            <div className="page-header">
                <h2>History & Snapshot</h2>
                <p>เก็บผลวิเคราะห์ในแต่ละช่วงเวลาไว้เทียบย้อนหลัง</p>
            </div>

            <section className="card">
                <h3 className="card-title">เลือกช่วงเวลา / Snapshot ที่ต้องการดู</h3>
                <div className="filters-row">
                    <div className="filter-item">
                        <label>ช่วงวันที่</label>
                        <div className="filter-dates">
                            <input type="date" />
                            <span style={{ padding: "0 4px" }}>–</span>
                            <input type="date" />
                        </div>
                    </div>
                    <div className="filter-item">
                        <label>ประเภท Snapshot</label>
                        <select>
                            <option>รายวัน</option>
                            <option>รายสัปดาห์</option>
                            <option>รายเดือน</option>
                            <option>แคมเปญพิเศษ</option>
                        </select>
                    </div>
                    <button className="primary-btn">โหลดข้อมูล</button>
                </div>
            </section>

            <section className="card">
                <h3 className="card-title">รายการ Snapshot (mock)</h3>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ชื่อ Snapshot</th>
                            <th>ช่วงเวลา</th>
                            <th>รวม Mentions</th>
                            <th>บวก</th>
                            <th>กลาง</th>
                            <th>ลบ</th>
                            <th>ดาวน์โหลด</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>รายสัปดาห์ 10–16 พ.ย. 2025</td>
                            <td>10–16/11/2025</td>
                            <td>520</td>
                            <td>310</td>
                            <td>140</td>
                            <td>70</td>
                            <td>
                                <button className="secondary-btn">ดูรายละเอียด</button>
                            </td>
                        </tr>
                        <tr>
                            <td>รายเดือน ต.ค. 2025</td>
                            <td>01–31/10/2025</td>
                            <td>1,820</td>
                            <td>1,020</td>
                            <td>530</td>
                            <td>270</td>
                            <td>
                                <button className="secondary-btn">ดูรายละเอียด</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
