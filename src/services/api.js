// src/services/api.js
// ==================== CONFIG ====================

// ตั้งค่าได้ผ่าน .env แต่มีค่าเริ่มต้นให้รันได้ทันที
export const API_BASE   = import.meta.env.VITE_API_BASE   || "http://localhost:8082";
export const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/analysis";
const CREDENTIALS =
    (import.meta.env.VITE_API_CRED || "").toLowerCase() === "include"
        ? "include"
        : "same-origin";

// ==================== HELPERS ====================
function joinPath(...parts) {
    return (
        "/" +
        parts
            .filter(Boolean)
            .map((p) => String(p).replace(/^\/+|\/+$/g, ""))
            .join("/")
    );
}

function toQuery(params = {}) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v).trim() !== "") q.set(k, v);
    });
    return q.toString();
}

async function http(method, path, { params, body, timeoutMs = 15000 } = {}) {
    const qs = toQuery(params);
    const url = `${API_BASE}${path}${qs ? `?${qs}` : ""}`;

    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);

    try {
        const res = await fetch(url, {
            method,
            signal: ac.signal,
            headers: body != null ? { "Content-Type": "application/json" } : undefined,
            credentials: CREDENTIALS,
            body: body != null ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            let msg = `${res.status} ${res.statusText}`;
            try {
                const t = await res.text();
                if (t) msg += ` — ${t}`;
            } catch { /* noop */ }
            throw new Error(msg);
        }

        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? await res.json() : null;
    } finally {
        clearTimeout(timer);
    }
}

const get  = (path, params, opts) => http("GET",  path, { params, ...(opts || {}) });
const post = (path, body,   opts) => http("POST", path, { body,   ...(opts || {}) });
const put  = (path, body,   opts) => http("PUT",  path, { body,   ...(opts || {}) });

// prefix helper: รองรับมี/ไม่มี /api
const p = (subPath) => joinPath(API_PREFIX, subPath);

// ==================== PUBLIC APIs ====================

// 1) Mentions (ตารางหลัก) + ฟิลเตอร์/เพจจิ้ง
export function getMentions(params = {}) {
    return get(p("/mentions"), params);
}

// 2) latest (alias ของ mentions ล่าสุด แบบ page/size)
export function getLatest(params = {}) {
    return get(p("/latest"), params);
}

// 3) alias เดิมในโปรเจ็กต์ — ให้ของเก่ายังเรียกได้
export function getTweetAnalysis(params = {}) {
    return getMentions(params);
}

// 4) sentiment donut / summary
export function getSentimentSummary(params = {}) {
    // รองรับกรอง: from, to, faculty, q, sent
    return get(p("/summary"), params);
}

// 5) trend ต่อวัน — map ให้พร้อมใช้กับ Recharts
//    รีเทิร์น [{ date:'YYYY-MM-DD', count: number, pos, neu, neg }]
export async function getTrendDaily(params = {}) {
    const rows = await get(p("/trend/daily"), params);
    return (rows || []).map((r) => ({
        date: r.date ?? r.ymd,
        count: r.count ?? r.total ?? 0,
        pos: r.pos ?? 0,
        neu: r.neu ?? 0,
        neg: r.neg ?? 0,
    }));
}

// (alias เก่า ใช้ชื่อเดิม MentionsTrend.jsx ก็ยังทำงาน)
export const getMentionsTrend = getTrendDaily;

// 6) faculties breakdown / bar
export function getTopFaculties(params = {}) {
    return get(p("/top-faculties"), params);
}

// 7) faculties summary (ถ้าหน้าไหนเรียกชื่อนี้)
export function getFacultySummary(params = {}) {
    return get(p("/faculties/summary"), params);
}

// 7.1) Top 5 topics (by count + แยก pos/neu/neg)
export function getTop5Topics(params = {}) {
    return get(p("/topics/top5"), params);
}

// 8) topics summary (ถ้าต้องใช้)
export function getTopicsSummary(params = {}) {
    return get(p("/topics/summary"), params);
}

// 9) summary by app/source
export function getSummaryByApp(params = {}) {
    return get(p("/summary/by-app"), params);
}

// 10) compare apps (เรียก endpoint ตรงของมัน)
export function getCompareApps(params = {}) {
    return get(p("/compare/apps"), params);
}

// 11) trend รายเดือน
export async function getTrendMonthly(params = {}) {
    const rows = await get(p("/trend/monthly"), params);
    return (rows || []).map((r) => ({
        month: r.month,
        count: r.count ?? r.total ?? 0,
        pos: r.pos ?? 0,
        neu: r.neu ?? 0,
        neg: r.neg ?? 0,
    }));
}

// ==================== Settings/Alerts ====================

export function getSettings() {
    return get(p("/settings"));
}

export function updateSettings(payload = {}) {
    const body = {
        ...payload,
        theme:
            payload?.theme && String(payload.theme).toUpperCase() === "DARK"
                ? "DARK"
                : "LIGHT",
        notificationsEnabled: !!payload?.notificationsEnabled,
        negativeThreshold:
            payload?.negativeThreshold != null
                ? Number(payload.negativeThreshold)
                : 20,
        sources: Array.isArray(payload?.sources) ? payload.sources : [],
    };
    return put(p("/settings"), body);
}

// (optionals — ถ้ายังไม่มี endpoint ฝั่งหลังบ้าน จะไม่ถูกเรียก)
export function postScanAlerts() {
    return post(p("/alerts/scan"));
}
export function postTestMail() {
    return post(p("/alerts/test"));
}
