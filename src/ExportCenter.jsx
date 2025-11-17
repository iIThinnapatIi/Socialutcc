// src/ExportCenter.jsx
import React from "react";

export default function ExportCenter() {
    return (
        <div className="page">
            <div className="page-header">
                <h2>Export & Report Center</h2>
                <p>ศูนย์รวมการดาวน์โหลด CSV / PDF และตั้งค่า Report อัตโนมัติ</p>
            </div>

            <section className="card-grid">
                <div className="card">
                    <h3 className="card-title">Export CSV (ทั้งหมด)</h3>
                    <p>ดึงข้อมูล Mentions ทั้งหมดตามฟิลเตอร์ที่ตั้งไว้ในหน้าอื่น</p>
                    <button className="primary-btn">Download CSV</button>
                </div>

                <div className="card">
                    <h3 className="card-title">Export PDF Dashboard</h3>
                    <p>สรุปกราฟ, ค่า sentiment และเทรนด์ในรูปแบบไฟล์ PDF</p>
                    <button className="primary-btn">Download PDF</button>
                </div>

                <div className="card">
                    <h3 className="card-title">Schedule Report</h3>
                    <p>ตั้งค่ารายงานอัตโนมัติรายสัปดาห์ / รายเดือน ส่งเข้าอีเมล</p>
                    <div className="filters-row">
                        <select>
                            <option>รายสัปดาห์</option>
                            <option>รายเดือน</option>
                        </select>
                        <select>
                            <option>วันจันทร์</option>
                            <option>วันศุกร์</option>
                        </select>
                    </div>
                    <button className="secondary-btn">บันทึกการตั้งค่า</button>
                </div>
            </section>
        </div>
    );
}
