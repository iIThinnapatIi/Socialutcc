// src/AlertsPage.jsx
import React from "react";

export default function AlertsPage() {
    return (
        <div className="page">
            <div className="page-header">
                <h2>Alert System</h2>
                <p>ตั้งค่าแจ้งเตือนเมื่อมี Mentions ผิดปกติหรือ Sentiment ลบพุ่งสูง</p>
            </div>

            <section className="card">
                <h3 className="card-title">กติกาการแจ้งเตือน (mock config)</h3>

                <div className="alert-row">
                    <div>
                        <div className="alert-title">Spike ของโพสต์ลบ</div>
                        <div className="alert-sub">
                            แจ้งเตือนเมื่อมีโพสต์ / คอมเมนต์แง่ลบเกินเกณฑ์ใน 1 ชั่วโมง
                        </div>
                    </div>
                    <div className="alert-controls">
                        <label>
                            เกณฑ์ (% ลบ / ทั้งหมด)
                            <input type="number" defaultValue={40} style={{ width: 80 }} />
                        </label>
                        <label className="toggle">
                            <input type="checkbox" defaultChecked /> เปิดใช้งาน
                        </label>
                    </div>
                </div>

                <div className="alert-row">
                    <div>
                        <div className="alert-title">Mentions เกี่ยวกับคำว่า “ค่าเทอม”</div>
                        <div className="alert-sub">
                            แจ้งเตือนทีมการตลาดทันทีเมื่อมีการพูดถึงคำสำคัญนี้เกิน X ครั้ง
                        </div>
                    </div>
                    <div className="alert-controls">
                        <label>
                            จำนวนครั้งขั้นต่ำ
                            <input type="number" defaultValue={20} style={{ width: 80 }} />
                        </label>
                        <label className="toggle">
                            <input type="checkbox" /> เปิดใช้งาน
                        </label>
                    </div>
                </div>
            </section>

            <section className="card">
                <h3 className="card-title">ช่องทางการแจ้งเตือน</h3>
                <div className="alert-channels">
                    <label>
                        <input type="checkbox" defaultChecked /> Email ทีมการตลาด
                    </label>
                    <label>
                        <input type="checkbox" /> Line กลุ่ม Crisis
                    </label>
                    <label>
                        <input type="checkbox" /> Web notification ใน Dashboard
                    </label>
                </div>
            </section>
        </div>
    );
}
