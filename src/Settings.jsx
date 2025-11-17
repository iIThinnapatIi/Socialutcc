// src/Settings.jsx
import React from "react";
import "./Settings.css";
import SentimentLexicon from "./SentimentLexicon";

export default function Settings() {
    return (
        <div className="page">
            <div className="page-header">
                <h2>Settings & Data Management</h2>
                <p>จัดการชุดคีย์เวิร์ด แหล่งข้อมูล และค่าพื้นฐานของผู้ใช้</p>
            </div>

            {/* Data Management / Keyword Set Manager */}
            <section className="card">
                <h3 className="card-title">Keyword Set Manager</h3>
                <p className="card-sub">
                    จัดการชุดคำที่ใช้จับ Mentions เช่น แบรนด์, แคมเปญ, แฮชแท็ก
                </p>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ชื่อชุดคีย์เวิร์ด</th>
                            <th>คำย่อยทั้งหมด</th>
                            <th>ใช้กับ</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>UTCC Brand</td>
                            <td>10 คำ</td>
                            <td>ภาพรวมทั้งมหาวิทยาลัย</td>
                            <td>
                                <button className="secondary-btn">จัดการ</button>
                            </td>
                        </tr>
                        <tr>
                            <td>ค่าเทอม & การเงิน</td>
                            <td>7 คำ</td>
                            <td>ประเด็นด้านค่าใช้จ่าย</td>
                            <td>
                                <button className="secondary-btn">จัดการ</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <button className="primary-btn" style={{ marginTop: 12 }}>
                    + สร้างชุดคีย์เวิร์ดใหม่
                </button>
            </section>

            {/* Data Management / Keyword Set Manager */}
            <section className="card">
                <h3 className="card-title">Keyword Set Manager</h3>
                <p className="card-sub">
                    จัดการชุดคำที่ใช้จับ Mentions เช่น แบรนด์, แคมเปญ, แฮชแท็ก
                </p>
                {/* ... ตารางชุดคีย์เวิร์ดเดิมของคุณ ... */}
            </section>

            {/* Custom Sentiment Dictionary - ฟีเจอร์เพิ่มคำใหม่ ดี/กลาง/แย่ */}
            <section className="card">
                <SentimentLexicon />
            </section>


            {/* แหล่งข้อมูล (Sources) */}
            <section className="card">
                <h3 className="card-title">Data Sources</h3>
                <p className="card-sub">เลือกว่าจะดึงข้อมูลจากแพลตฟอร์มใดบ้าง</p>
                <div className="source-grid">
                    <label>
                        <input type="checkbox" defaultChecked /> Twitter / X
                    </label>
                    <label>
                        <input type="checkbox" defaultChecked /> Pantip
                    </label>
                    <label>
                        <input type="checkbox" defaultChecked /> Facebook Page
                    </label>
                    <label>
                        <input type="checkbox" /> TikTok
                    </label>
                </div>
            </section>

            {/* User & Config */}
            <section className="card">
                <h3 className="card-title">User & Config</h3>
                <div className="settings-grid">
                    <div className="settings-item">
                        <label>คณะเริ่มต้นที่แสดงใน Dashboard</label>
                        <select>
                            <option>ทั้งหมด</option>
                            <option>บริหารธุรกิจ</option>
                            <option>นิเทศศาสตร์</option>
                            <option>บัญชี</option>
                        </select>
                    </div>
                    <div className="settings-item">
                        <label>ธีม</label>
                        <select>
                            <option>Light</option>
                            <option>Dark</option>
                            <option>ระบบ (Auto)</option>
                        </select>
                    </div>
                    <div className="settings-item">
                        <label>ภาษา</label>
                        <select>
                            <option>ไทย</option>
                            <option>อังกฤษ</option>
                        </select>
                    </div>
                </div>

                <button className="primary-btn" style={{ marginTop: 12 }}>
                    บันทึกการตั้งค่า
                </button>
            </section>
        </div>
    );
}
