// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";

// pages
import Dashboard from "./Dashboard";
import Trends from "./Trends";
import Settings from "./Settings";
import Pageone from "./Pageone";

// ใหม่ที่เราจะสร้างเพิ่ม
import Mentions from "./Mentions";
import HistoryPage from "./HistoryPage";
import AlertsPage from "./AlertsPage";
import ExportCenter from "./ExportCenter";

// ตัวเช็คล็อกอินง่าย ๆ
function RequireAuth({ isLoggedIn, children }) {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// layout หลัก (sidebar + top bar)
function ShellLayout({ children, onLogout }) {
    const location = useLocation();

    const menu = [
        { path: "/dashboard", label: "ภาพรวม (Dashboard)" },
        { path: "/mentions", label: "จัดการ Mentions" },
        { path: "/trends", label: "เทรนด์ & กราฟ" },
        { path: "/history", label: "ประวัติ & Snapshot" },
        { path: "/alerts", label: "Alert System" },
        { path: "/export", label: "Export / Report" },
        { path: "/settings", label: "ตั้งค่า & Data Management" },
    ];

    return (
        <div className="app-shell">
            <aside className="app-sidebar">
                <div className="app-logo">UTCC Social</div>
                <nav className="app-nav">
                    {menu.map((m) => {
                        const active = location.pathname === m.path;
                        return (
                            <Link
                                key={m.path}
                                to={m.path}
                                className={`app-nav-item ${active ? "active" : ""}`}
                            >
                                {m.label}
                            </Link>
                        );
                    })}
                </nav>
                <button className="app-logout" onClick={onLogout}>
                    ออกจากระบบ
                </button>
            </aside>

            <main className="app-main">
                <header className="app-header">
                    <h1 className="app-header-title">UTCC Marketing Dashboard</h1>
                    <div className="app-header-sub">
                        ดูภาพรวม Mentions, เทรนด์ และแจ้งเตือนจากโซเชียล
                    </div>
                </header>
                <section className="app-content">{children}</section>
            </main>
        </div>
    );
}

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                {/* login */}
                <Route path="/login" element={<Pageone onLogin={handleLoginSuccess} />} />

                {/* redirect root -> dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Analytics Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth isLoggedIn={isLoggedIn}>
                            <ShellLayout onLogout={handleLogout}>
                                <Dashboard />
                            </ShellLayout>
                        </RequireAuth>
                    }
                />

                {/* Mentions Management */}
                <Route
                    path="/mentions"
                    element={
                        <RequireAuth isLoggedIn={isLoggedIn}>
                            <ShellLayout onLogout={handleLogout}>
                                <Mentions />
                            </ShellLayout>
                        </RequireAuth>
                    }
                />

                {/* Trends */}
                <Route
                    path="/trends"
                    element={
                        <RequireAuth isLoggedIn={isLoggedIn}>
                            <ShellLayout onLogout={handleLogout}>
                                <Trends />
                            </ShellLayout>
                        </RequireAuth>
                    }
                />

                {/* History & Snapshot */}
                <Route
                    path="/history"
                    element={
                        <RequireAuth isLoggedIn={isLoggedIn}>
                            <ShellLayout onLogout={handleLogout}>
                                <HistoryPage />
                            </ShellLayout>
                        </RequireAuth>
                    }
                />

                {/* Alert System */}
                <Route
                    path="/alerts"
                    element={
                        <RequireAuth isLoggedIn={isLoggedIn}>
                            <ShellLayout onLogout={handleLogout}>
                                <AlertsPage />
                            </ShellLayout>
                        </RequireAuth>
                    }
                />

                {/* Export / Report */}
                <Route
                    path="/export"
                    element={
                        <RequireAuth isLoggedIn={isLoggedIn}>
                            <ShellLayout onLogout={handleLogout}>
                                <ExportCenter />
                            </ShellLayout>
                        </RequireAuth>
                    }
                />

                {/* Settings + Data Management */}
                <Route
                    path="/settings"
                    element={
                        <RequireAuth isLoggedIn={isLoggedIn}>
                            <ShellLayout onLogout={handleLogout}>
                                <Settings />
                            </ShellLayout>
                        </RequireAuth>
                    }
                />

                {/* กัน path แปลก ๆ */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}
