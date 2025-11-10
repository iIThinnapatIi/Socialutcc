export async function exportSectionToPDF(elementId, filename = "report.pdf") {
    let html2pdf = window.html2pdf;
    if (!html2pdf) { // fallback เมื่อติดตั้งผ่าน npm
        const m = await import("html2pdf.js");
        html2pdf = m.default;
    }
    const el = document.getElementById(elementId);
    if (!el) throw new Error(`Element #${elementId} not found`);

    return html2pdf()
        .from(el)
        .set({
            margin: 10,
            filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .save();
}
