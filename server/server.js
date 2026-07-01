const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── ROUTE ANALYSE IA ────────────────────────────────────────────────────────
app.post("/api/analyze", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 4000,
        messages: req.body.messages,
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ROUTE PDF ───────────────────────────────────────────────────────────────
app.post("/api/pdf", (req, res) => {
  try {
    const { aiData, scores, sectorLabel } = req.body;
    if (!aiData || !scores) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const filename = `RiskGuard-${(sectorLabel || "diagnostic").replace(/[^a-zA-Z0-9]/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    const W = doc.page.width - 80;
    const NAVY = "#0f2557";
    const GOLD = "#d4af37";
    const RED = "#dc2626";
    const GREEN = "#16a34a";
    const AMBER = "#d97706";
    const WHITE = "#ffffff";
    const GRAY = "#64748b";

    const clean = (s) => (s || "").toString()
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[^\x00-\xFF]/g, "")
      .trim();

    const getRiskColor = (s) => s >= 70 ? RED : s >= 45 ? AMBER : GREEN;
    const getRiskLabel = (s) => s >= 70 ? "CRITIQUE" : s >= 55 ? "ELEVE" : s >= 35 ? "MODERE" : "FAIBLE";

    // ── PAGE 1 : COUVERTURE ──────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
    doc.rect(0, 0, doc.page.width, 5).fill(GOLD);
    doc.rect(0, doc.page.height - 5, doc.page.width, 5).fill(GOLD);

    doc.fillColor(GOLD).fontSize(36).font("Helvetica-Bold")
      .text("RiskGuard AI", 40, 120, { align: "center" });

    doc.fillColor(WHITE).fontSize(14).font("Helvetica")
      .text("Rapport de Diagnostic Risk Management", 40, 170, { align: "center" });

    doc.moveTo(80, 195).lineTo(doc.page.width - 80, 195).strokeColor(GOLD).lineWidth(1).stroke();

    doc.fillColor("#94a3b8").fontSize(11)
      .text(`Secteur : ${clean(sectorLabel)}`, 40, 215, { align: "center" })
      .text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 40, 232, { align: "center" });

    // Score badge
    const lvlColor = scores.global >= 70 ? RED : scores.global >= 55 ? AMBER : scores.global >= 35 ? "#6366f1" : GREEN;
    const lvlLabel = getRiskLabel(scores.global);
    doc.roundedRect(doc.page.width / 2 - 70, 265, 140, 32, 8).fill(lvlColor);
    doc.fillColor(WHITE).fontSize(13).font("Helvetica-Bold")
      .text(`${lvlLabel}  -  ${scores.global}/100`, doc.page.width / 2 - 70, 277, { width: 140, align: "center" });

    doc.fillColor("#475569").fontSize(9).font("Helvetica")
      .text("RIMRAE - RARM Challenge 2026 - riskguard-gray.vercel.app", 40, doc.page.height - 50, { align: "center" });

    // ── PAGE 2 : SCORES ──────────────────────────────────────────────────────
    doc.addPage();

    // Header
    doc.rect(0, 0, doc.page.width, 45).fill(NAVY);
    doc.rect(0, 0, 5, 45).fill(GOLD);
    doc.fillColor(WHITE).fontSize(14).font("Helvetica-Bold")
      .text("Scores par dimension", 20, 16);

    let y = 65;

    // Dimensions
    const dims = [
      ["OHADA & Gouvernance", scores.ohada],
      ["RH & Management", scores.rh],
      ["Finance & Fraude", scores.finance],
      ["HSE & Operations", scores.hse],
      ["Risques Sectoriels", scores.sectoriel],
    ];

    dims.forEach(([label, score]) => {
      const color = getRiskColor(score);
      doc.fillColor("#1e293b").fontSize(11).font("Helvetica")
        .text(clean(label), 40, y + 3);
      doc.roundedRect(220, y, 240, 14, 3).fill("#e2e8f0");
      doc.roundedRect(220, y, Math.max(5, score * 2.4), 14, 3).fill(color);
      doc.fillColor(color).fontSize(11).font("Helvetica-Bold")
        .text(`${score}/100`, 475, y + 2);
      y += 28;
    });

    y += 8;

    // Score global box
    doc.roundedRect(40, y, W, 28, 6).fill(NAVY);
    doc.rect(40, y, 5, 28).fill(GOLD);
    doc.fillColor(GOLD).fontSize(13).font("Helvetica-Bold")
      .text(`Score global : ${scores.global}/100  -  ${lvlLabel}`, 55, y + 9);
    y += 44;

    // Résumé exécutif
    if (aiData.resume_executif) {
      doc.roundedRect(40, y, W, 2).fill(GOLD);
      y += 8;
      doc.fillColor("#334155").fontSize(11).font("Helvetica-Oblique")
        .text(clean(aiData.resume_executif), 40, y, { width: W, lineGap: 3 });
      y = doc.y + 16;
    }

    // Alerte OHADA
    if (aiData.alerte_ohada) {
      doc.roundedRect(40, y, W, 44, 6).fill("#dbeafe");
      doc.rect(40, y, 5, 44).fill("#1d4ed8");
      doc.fillColor("#1d4ed8").fontSize(9).font("Helvetica-Bold")
        .text("ALERTE CONFORMITE OHADA", 52, y + 7);
      doc.fillColor("#1e3a8a").fontSize(10).font("Helvetica")
        .text(clean(aiData.alerte_ohada), 52, y + 20, { width: W - 20 });
      y += 52;
    }

    // Projection
    if (aiData.score_projection) {
      const sp = aiData.score_projection;
      y += 4;
      doc.fillColor(NAVY).fontSize(12).font("Helvetica-Bold")
        .text("Projection sur 6 mois", 40, y);
      y += 18;
      const projBars = [["Aujourd'hui", sp.score_actuel, RED], ["Dans 3 mois", sp.score_3mois, AMBER], ["Dans 6 mois", sp.score_6mois, GREEN]];
      projBars.forEach(([label, val, color]) => {
        doc.fillColor(GRAY).fontSize(9).font("Helvetica").text(clean(label), 40, y + 2);
        doc.roundedRect(130, y, 280, 10, 2).fill("#e2e8f0");
        doc.roundedRect(130, y, Math.max(4, (val || 0) * 2.8), 10, 2).fill(color);
        doc.fillColor(color).fontSize(9).font("Helvetica-Bold").text(`${val}/100`, 420, y + 1);
        y += 20;
      });
      if (sp.economies_estimees) {
        doc.roundedRect(40, y, W, 22, 4).fill("#dcfce7");
        doc.fillColor("#15803d").fontSize(10).font("Helvetica-Bold")
          .text(`Pertes evitees estimees : ${clean(sp.economies_estimees)}`, 52, y + 7);
        y += 30;
      }
    }

    // ── PAGE 3 : POINTS CRITIQUES ────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, doc.page.width, 45).fill("#991b1b");
    doc.rect(0, 0, 5, 45).fill(GOLD);
    doc.fillColor(WHITE).fontSize(14).font("Helvetica-Bold")
      .text("Points critiques identifies", 20, 16);
    y = 65;

    (aiData.points_critiques || []).forEach((p, i) => {
      if (y > 700) { doc.addPage(); y = 40; }
      const h = 58;
      doc.roundedRect(40, y, W, h, 6).fill("#fef2f2");
      doc.rect(40, y, 5, h).fill(RED);
      doc.fillColor(RED).fontSize(11).font("Helvetica-Bold")
        .text(`${i + 1}. ${clean(p.titre)}  [${clean(p.urgence)}]`, 52, y + 8, { width: W - 20 });
      doc.fillColor("#475569").fontSize(9).font("Helvetica")
        .text(clean(p.description), 52, y + 24, { width: W - 20 });
      doc.fillColor(RED).fontSize(9).font("Helvetica-Bold")
        .text(`Impact : ${clean(p.impact_financier)}`, 52, y + 46);
      y += h + 10;
    });

    // Points positifs
    if (y > 650) { doc.addPage(); y = 40; }
    y += 8;
    doc.rect(0, y, doc.page.width, 32).fill("#14532d");
    doc.fillColor(WHITE).fontSize(13).font("Helvetica-Bold")
      .text("Points positifs", 20, y + 10);
    y += 40;

    (aiData.points_positifs || []).forEach((p) => {
      if (y > 700) { doc.addPage(); y = 40; }
      doc.roundedRect(40, y, W, 36, 4).fill("#f0fdf4");
      doc.rect(40, y, 4, 36).fill(GREEN);
      doc.fillColor("#15803d").fontSize(11).font("Helvetica-Bold")
        .text(`+ ${clean(p.titre)}`, 52, y + 5);
      doc.fillColor("#374151").fontSize(9).font("Helvetica")
        .text(clean(p.description), 52, y + 20, { width: W - 20 });
      y += 44;
    });

    // ── PAGE 4 : PLAN D'ACTION ───────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, doc.page.width, 45).fill(NAVY);
    doc.rect(0, 0, 5, 45).fill(GOLD);
    doc.fillColor(WHITE).fontSize(14).font("Helvetica-Bold")
      .text("Plan d'action personnalise", 20, 16);
    y = 65;

    (aiData.plan_action || []).forEach((a, i) => {
      if (y > 680) { doc.addPage(); y = 40; }
      const bgColor = a.priorite === "URGENT" ? "#fef2f2" : a.priorite === "IMPORTANT" ? "#fffbeb" : "#eef2ff";
      const acColor = a.priorite === "URGENT" ? RED : a.priorite === "IMPORTANT" ? AMBER : "#6366f1";
      doc.roundedRect(40, y, W, 56, 6).fill(bgColor);
      doc.rect(40, y, 5, 56).fill(acColor);
      doc.fillColor(acColor).fontSize(9).font("Helvetica-Bold")
        .text(`${clean(a.priorite)}  -  ${clean(a.delai)}`, 52, y + 6);
      doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold")
        .text(`${i + 1}. ${clean(a.titre)}`, 52, y + 18, { width: W - 20 });
      doc.fillColor("#475569").fontSize(9).font("Helvetica")
        .text(clean(a.description), 52, y + 32, { width: W - 20 });
      doc.fillColor(acColor).fontSize(8).font("Helvetica-Bold")
        .text(`Cout : ${clean(a.cout_estime)}   |   Responsable : ${clean(a.responsable)}`, 52, y + 48);
      y += 64;
    });

    // Message dirigeant
    if (aiData.message_dirigeant) {
      if (y > 650) { doc.addPage(); y = 40; }
      y += 8;
      doc.roundedRect(40, y, W, 52, 6).fill(NAVY);
      doc.rect(40, y, 5, 52).fill(GOLD);
      doc.fillColor(GOLD).fontSize(9).font("Helvetica-Bold")
        .text("MESSAGE AU DIRIGEANT", 52, y + 8);
      doc.fillColor("#cbd5e1").fontSize(10).font("Helvetica-Oblique")
        .text(clean(aiData.message_dirigeant), 52, y + 22, { width: W - 20 });
    }

    // Footer sur toutes les pages
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < doc._pageBuffer.length; i++) {
      doc.switchToPage(i);
      doc.rect(0, doc.page.height - 18, doc.page.width, 18).fill(NAVY);
      doc.moveTo(0, doc.page.height - 18).lineTo(doc.page.width, doc.page.height - 18)
        .strokeColor(GOLD).lineWidth(0.8).stroke();
      doc.fillColor("#94a3b8").fontSize(7).font("Helvetica")
        .text("RiskGuard AI - Diagnostic confidentiel - RIMRAE RARM 2026",
          40, doc.page.height - 12);
      doc.text(`${i + 1} / ${doc._pageBuffer.length}`,
        doc.page.width - 80, doc.page.height - 12, { width: 40, align: "right" });
    }

    doc.end();
  } catch (err) {
    console.error("PDF error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Serveur RiskGuard AI demarre sur http://localhost:3001"));
