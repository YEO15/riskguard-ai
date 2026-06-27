import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#0f2557",
  navyLight: "#1a3a6e",
  navyMid: "#2a4a8a",
  accent: "#00c9b1",
  accentDark: "#00a896",
  danger: "#ef4444",
  warning: "#f59e0b",
  success: "#10b981",
  bg: "#f0f4ff",
  white: "#ffffff",
};

const QUESTIONS = [
  {
    section: "Informations entreprise",
    icon: "🏢",
    items: [
      { id: "q1", text: "Quelle est la taille de votre entreprise ?", options: ["1 à 10 employés", "11 à 50 employés", "51 à 200 employés", "Plus de 200 employés"] },
      { id: "q2", text: "Votre secteur d'activité principal ?", options: ["Commerce / Distribution", "Services / Conseil", "Industrie / Production", "BTP / Travaux"] },
      { id: "q3", text: "Depuis combien d'années votre entreprise est-elle active ?", options: ["Moins de 2 ans", "2 à 5 ans", "5 à 10 ans", "Plus de 10 ans"] },
      { id: "q4", text: "Votre entreprise dispose-t-elle d'un département RH dédié ?", options: ["Oui, avec une équipe", "Oui, une seule personne", "Non, géré par la direction", "Non, aucune gestion formelle"] },
    ]
  },
  {
    section: "Risques RH & Management",
    icon: "👥",
    items: [
      { id: "q5", text: "Comment qualifieriez-vous le climat social dans votre entreprise ces 6 derniers mois ?", options: ["Très dégradé — conflits fréquents", "Tendu — quelques frictions", "Stable — quelques irritants", "Excellent — cohésion forte"] },
      { id: "q6", text: "Quel est le taux de turnover annuel de votre effectif ?", options: ["Plus de 30%", "15 à 30%", "5 à 15%", "Moins de 5%"] },
      { id: "q7", text: "Des cas de harcèlement ou comportements managériaux toxiques ont-ils été signalés ?", options: ["Oui, plusieurs cas graves", "Oui, quelques incidents", "Rarement, cas isolés", "Non, jamais signalé"] },
      { id: "q8", text: "Les managers reçoivent-ils des formations régulières en leadership ?", options: ["Jamais", "Rarement (tous les 3 ans+)", "Parfois (annuellement)", "Régulièrement (plusieurs/an)"] },
    ]
  },
  {
    section: "Risques Financiers",
    icon: "💰",
    items: [
      { id: "q9", text: "Votre entreprise dispose-t-elle de procédures de contrôle interne formalisées ?", options: ["Aucune procédure écrite", "Quelques règles informelles", "Procédures partielles", "Procédures complètes et auditées"] },
      { id: "q10", text: "Des anomalies financières ou actes de fraude ont-ils été détectés récemment ?", options: ["Oui, cas graves non résolus", "Oui, cas mineurs détectés", "Suspicions sans preuves", "Aucun incident connu"] },
      { id: "q11", text: "Comment gérez-vous les accès aux systèmes financiers ?", options: ["Accès libre pour tous", "Accès limité sans trace", "Accès contrôlé partiellement", "Accès strict avec journalisation"] },
      { id: "q12", text: "Réalisez-vous des audits financiers indépendants ?", options: ["Jamais", "En cas de problème uniquement", "Tous les 2-3 ans", "Annuellement ou plus"] },
    ]
  },
  {
    section: "Risques HSE & Sécurité",
    icon: "⚠️",
    items: [
      { id: "q13", text: "Combien d'accidents de travail ont eu lieu l'an dernier ?", options: ["5 ou plus", "2 à 4", "1", "Aucun"] },
      { id: "q14", text: "Vos employés ont-ils accès à des équipements de protection individuelle (EPI) ?", options: ["Non, aucun EPI disponible", "EPI disponibles mais non portés", "EPI parfois utilisés", "EPI systématiquement fournis et portés"] },
      { id: "q15", text: "Un plan d'évacuation et de gestion des urgences est-il en place ?", options: ["Aucun plan", "Plan existant mais non testé", "Plan testé partiellement", "Plan complet testé annuellement"] },
      { id: "q16", text: "La sécurité des données numériques est-elle gérée activement ?", options: ["Aucune mesure de cybersécurité", "Mots de passe basiques uniquement", "Antivirus + quelques mesures", "Politique de sécurité complète"] },
    ]
  },
  {
    section: "Gouvernance & RSE",
    icon: "🏛️",
    items: [
      { id: "q17", text: "Votre entreprise dispose-t-elle d'une charte éthique ou d'un code de conduite ?", options: ["Non, aucun document", "En cours de rédaction", "Existe mais peu appliqué", "Existe et appliqué formellement"] },
      { id: "q18", text: "Les décisions stratégiques sont-elles prises de manière collégiale ?", options: ["Décision unilatérale du dirigeant", "Consultation informelle", "Comité de direction partiel", "Gouvernance structurée et transparente"] },
      { id: "q19", text: "Votre entreprise a-t-elle une politique RSE (responsabilité sociale) ?", options: ["Non, aucune démarche RSE", "Quelques actions ponctuelles", "Politique partielle en cours", "Politique RSE formalisée et suivie"] },
      { id: "q20", text: "Réalisez-vous un reporting régulier sur vos risques à la direction ?", options: ["Jamais", "En cas de crise uniquement", "Annuellement", "Trimestriellement ou plus"] },
    ]
  }
];

const RISK_SCORES = {
  q1: [5, 10, 15, 8], q2: [12, 8, 15, 18], q3: [20, 15, 10, 5], q4: [20, 15, 12, 18],
  q5: [25, 15, 8, 2], q6: [25, 18, 10, 3], q7: [30, 18, 8, 0], q8: [20, 15, 8, 2],
  q9: [25, 18, 10, 3], q10: [30, 18, 10, 0], q11: [25, 18, 10, 2], q12: [20, 15, 8, 2],
  q13: [30, 20, 10, 0], q14: [25, 18, 10, 2], q15: [20, 15, 8, 2], q16: [25, 18, 10, 2],
  q17: [18, 14, 8, 2], q18: [20, 14, 8, 2], q19: [10, 8, 5, 2], q20: [20, 15, 8, 2],
};

function computeScores(answers) {
  const rhQ = ["q5","q6","q7","q8"], finQ = ["q9","q10","q11","q12"];
  const hseQ = ["q13","q14","q15","q16"], govQ = ["q17","q18","q19","q20"];
  const sum = (qs) => qs.reduce((acc, q) => acc + (answers[q] !== undefined ? (RISK_SCORES[q]?.[answers[q]] || 0) : 0), 0);
  const rh = Math.min(100, Math.round(sum(rhQ)));
  const fin = Math.min(100, Math.round(sum(finQ)));
  const hse = Math.min(100, Math.round(sum(hseQ)));
  const gov = Math.min(100, Math.round(sum(govQ)));
  return { rh, fin, hse, gov, global: Math.round((rh + fin + hse + gov) / 4) };
}

function buildAIPrompt(answers, scores) {
  const companySize = ["1 à 10 employés","11 à 50 employés","51 à 200 employés","Plus de 200 employés"][answers.q1] || "PME";
  const sector = ["Commerce / Distribution","Services / Conseil","Industrie / Production","BTP / Travaux"][answers.q2] || "secteur non précisé";
  const answersText = QUESTIONS.flatMap(s => s.items).map(q => {
    const idx = answers[q.id];
    return `- ${q.text}\n  Réponse : ${idx !== undefined ? q.options[idx] : "Non répondu"}`;
  }).join("\n");
  return `Tu es un expert senior en risk management en Afrique subsaharienne, spécialisé dans les PME ivoiriennes.

PROFIL ENTREPRISE : Taille: ${companySize} | Secteur: ${sector}
SCORES : RH=${scores.rh}/100 | Finance=${scores.fin}/100 | HSE=${scores.hse}/100 | Gouvernance=${scores.gov}/100 | Global=${scores.global}/100

RÉPONSES :
${answersText}

Génère un rapport JSON avec exactement ce format (UNIQUEMENT le JSON, rien d'autre) :
{
  "resume_executif": "2-3 phrases percutantes sur la situation de risque",
  "niveau_risque": "CRITIQUE|ÉLEVÉ|MODÉRÉ|FAIBLE",
  "points_critiques": [
    {"titre": "...", "description": "...", "impact": "..."},
    {"titre": "...", "description": "...", "impact": "..."},
    {"titre": "...", "description": "...", "impact": "..."}
  ],
  "points_positifs": [
    {"titre": "...", "description": "..."}
  ],
  "plan_action": [
    {"priorite": "URGENT", "delai": "0-30 jours", "titre": "...", "description": "...", "ressources": "...", "indicateur": "..."},
    {"priorite": "URGENT", "delai": "0-30 jours", "titre": "...", "description": "...", "ressources": "...", "indicateur": "..."},
    {"priorite": "IMPORTANT", "delai": "30-90 jours", "titre": "...", "description": "...", "ressources": "...", "indicateur": "..."},
    {"priorite": "IMPORTANT", "delai": "30-90 jours", "titre": "...", "description": "...", "ressources": "...", "indicateur": "..."},
    {"priorite": "MOYEN TERME", "delai": "90-180 jours", "titre": "...", "description": "...", "ressources": "...", "indicateur": "..."}
  ],
  "projection": "Ce que l'entreprise peut atteindre en suivant ce plan"
}

Adapte tout au contexte africain/ivoirien. Sois très concret avec des chiffres.`;
}

function getRiskColor(s) { return s >= 70 ? "#ef4444" : s >= 40 ? "#f59e0b" : "#10b981"; }
function getRiskLevel(s) {
  if (s >= 70) return { label: "CRITIQUE", bg: "#fee2e2", color: "#dc2626" };
  if (s >= 55) return { label: "ÉLEVÉ", bg: "#fef3c7", color: "#d97706" };
  if (s >= 35) return { label: "MODÉRÉ", bg: "#e0e7ff", color: "#4338ca" };
  return { label: "FAIBLE", bg: "#d1fae5", color: "#059669" };
}

function GaugeChart({ score }) {
  const color = getRiskColor(score);
  const r = 68, cx = 90, cy = 85;
  const angle = (score / 100) * 180;
  const rad = (angle - 180) * Math.PI / 180;
  const endX = cx + r * Math.cos(rad);
  const endY = cy + r * Math.sin(rad);
  return (
    <svg width="180" height="95" viewBox="0 0 180 95">
      <path d={`M ${cx-r},${cy} A ${r},${r} 0 0,1 ${cx+r},${cy}`} fill="none" stroke="rgba(15,37,87,0.1)" strokeWidth="13" strokeLinecap="round"/>
      <path d={`M ${cx-r},${cy} A ${r},${r} 0 ${angle>180?1:0},1 ${endX},${endY}`} fill="none" stroke={color} strokeWidth="13" strokeLinecap="round"/>
      <text x={cx} y={cy-2} textAnchor="middle" fontFamily="'Syne',sans-serif" fontSize="30" fontWeight="800" fill={color}>{score}</text>
      <text x={cx} y={cy+16} textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="11" fill="#94a3b8">/ 100</text>
    </svg>
  );
}

const appCSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#eef2ff;color:#1e293b}
h1,h2,h3,h4{font-family:'Syne',sans-serif}
.app{min-height:100vh;display:flex;flex-direction:column}
.nav{background:#0f2557;padding:0 28px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(15,37,87,0.5)}
.nav-logo{display:flex;align-items:center;gap:10px;font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:white}
.logo-box{width:32px;height:32px;background:#00c9b1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px}
.nav-tag{font-size:11px;color:rgba(255,255,255,0.35);font-weight:400;margin-left:4px;letter-spacing:.03em}
.nav-tabs{display:flex;gap:2px}
.ntab{padding:6px 13px;border-radius:18px;font-size:12px;color:rgba(255,255,255,0.45);border:none;background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
.ntab.active{background:rgba(0,201,177,0.18);color:#00c9b1;font-weight:500}
.hero{background:linear-gradient(135deg,#0f2557 0%,#1a3a8e 60%,#0f2557 100%);padding:72px 36px;text-align:center;position:relative;overflow:hidden}
.hero-glow{position:absolute;border-radius:50%;background:rgba(0,201,177,0.07);pointer-events:none}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(0,201,177,0.12);color:#00c9b1;border:1px solid rgba(0,201,177,0.28);padding:5px 15px;border-radius:20px;font-size:12px;font-weight:500;margin-bottom:22px;letter-spacing:.05em}
.hero h1{font-size:48px;font-weight:800;color:white;line-height:1.1;margin-bottom:18px}
.hero h1 .hl{color:#00c9b1}
.hero-sub{font-size:16px;color:rgba(255,255,255,0.65);max-width:520px;margin:0 auto 32px;line-height:1.65;font-weight:300}
.hero-stats{display:flex;justify-content:center;gap:44px;margin-bottom:36px}
.hstat .num{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#00c9b1}
.hstat .lbl{font-size:12px;color:rgba(255,255,255,0.45);margin-top:2px}
.btn-start{background:#00c9b1;color:#0f2557;border:none;padding:15px 34px;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.btn-start:hover{background:#00a896;transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,201,177,0.3)}
.content{flex:1;padding:28px 32px;max-width:860px;margin:0 auto;width:100%}
.prog-wrap{margin-bottom:24px}
.prog-sections{display:flex;gap:8px;margin-bottom:6px}
.prog-sec{flex:1;text-align:center}
.prog-outer{height:4px;background:rgba(15,37,87,0.1);border-radius:2px;overflow:hidden;margin-bottom:5px}
.prog-inner{height:100%;background:#00c9b1;border-radius:2px;transition:width .4s}
.prog-lbl{font-size:10px;color:#94a3b8;font-weight:500}
.prog-lbl.active{color:#0f2557;font-weight:600}
.sec-head{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.sec-icon{width:42px;height:42px;background:#0f2557;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:19px}
.sec-title{font-family:'Syne',sans-serif;font-size:19px;font-weight:700;color:#0f2557}
.sec-sub{font-size:13px;color:#64748b;margin-top:2px}
.qcard{background:white;border-radius:14px;padding:22px;margin-bottom:12px;border:1.5px solid rgba(15,37,87,0.07);transition:border-color .2s}
.qcard.answered{border-color:rgba(0,201,177,0.38)}
.qnum{font-size:11px;font-weight:600;color:#00a896;letter-spacing:.07em;margin-bottom:7px;text-transform:uppercase}
.qtext{font-size:15px;font-weight:500;color:#0f2557;margin-bottom:14px;line-height:1.5}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.opt{padding:10px 13px;border:1.5px solid rgba(15,37,87,0.1);border-radius:9px;background:white;font-family:'DM Sans',sans-serif;font-size:13px;color:#475569;cursor:pointer;transition:all .15s;text-align:left;line-height:1.4}
.opt:hover{border-color:#00c9b1;color:#0f2557;background:rgba(0,201,177,0.04)}
.opt.sel{border-color:#00c9b1;background:rgba(0,201,177,0.09);color:#0f2557;font-weight:500}
.navrow{display:flex;justify-content:space-between;align-items:center;margin-top:22px}
.btn-prev{padding:11px 22px;border:1.5px solid rgba(15,37,87,0.18);border-radius:9px;background:white;font-family:'DM Sans',sans-serif;font-size:13px;color:#0f2557;cursor:pointer;font-weight:500;transition:all .15s}
.btn-prev:hover{background:#eef2ff}
.btn-prev:disabled{opacity:0.35;cursor:not-allowed}
.btn-next{padding:11px 26px;background:#0f2557;border:none;border-radius:9px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:white;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px}
.btn-next:hover{background:#1a3a6e;transform:translateY(-1px)}
.btn-next:disabled{opacity:0.35;cursor:not-allowed;transform:none}
.btn-accent{padding:11px 24px;background:#00c9b1;border:none;border-radius:9px;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#0f2557;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
.btn-accent:hover{background:#00a896}
.btn-outline{padding:11px 22px;border:1.5px solid rgba(15,37,87,0.18);border-radius:9px;background:white;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#0f2557;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
.btn-outline:hover{border-color:#0f2557;background:#eef2ff}
.prog-txt{font-size:12px;color:#94a3b8;font-weight:500}
.loading-wrap{text-align:center;padding:72px 20px}
.loading-ring{width:68px;height:68px;border:4px solid rgba(0,201,177,0.18);border-top-color:#00c9b1;border-radius:50%;animation:spin .9s linear infinite;margin:0 auto 22px}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-title{font-family:'Syne',sans-serif;font-size:21px;font-weight:700;color:#0f2557;margin-bottom:8px}
.loading-sub{font-size:14px;color:#64748b}
.lsteps{margin-top:28px;display:flex;flex-direction:column;gap:8px;max-width:320px;margin-left:auto;margin-right:auto}
.lstep{display:flex;align-items:center;gap:10px;padding:10px 14px;background:white;border-radius:9px;font-size:13px;color:#94a3b8;border:1px solid rgba(15,37,87,0.06);transition:all .3s}
.lstep.active{color:#0f2557;border-color:rgba(0,201,177,0.28);background:rgba(0,201,177,0.04)}
.lstep.done{color:#10b981;border-color:rgba(16,185,129,0.25)}
.sdot{width:7px;height:7px;border-radius:50%;background:currentColor;flex-shrink:0}
.score-hero{background:white;border-radius:18px;padding:28px;margin-bottom:18px;border:1.5px solid rgba(15,37,87,0.07);display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center}
.rlevel-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:18px;font-size:13px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:10px}
.score-info h2{font-size:20px;font-weight:700;color:#0f2557;margin-bottom:7px}
.score-info p{font-size:14px;color:#475569;line-height:1.6}
.dim-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
.dcard{background:white;border-radius:13px;padding:16px;border:1.5px solid rgba(15,37,87,0.07)}
.dhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
.dname{font-size:13px;font-weight:600;color:#0f2557;font-family:'Syne',sans-serif}
.dscore{font-family:'Syne',sans-serif;font-size:19px;font-weight:800}
.dbar-bg{height:5px;background:rgba(15,37,87,0.08);border-radius:3px;overflow:hidden}
.dbar{height:100%;border-radius:3px;transition:width 1s ease}
.ai-report{background:white;border-radius:18px;padding:26px;margin-bottom:18px;border:1.5px solid rgba(15,37,87,0.07)}
.ai-rhead{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(15,37,87,0.07)}
.ai-badge{display:flex;align-items:center;gap:5px;background:rgba(0,201,177,0.1);color:#00a896;padding:4px 11px;border-radius:18px;font-size:12px;font-weight:600;letter-spacing:.04em}
.ai-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:#0f2557}
.resume-box{background:rgba(15,37,87,0.03);border-radius:10px;padding:15px;margin-bottom:18px;border-left:4px solid #0f2557;font-size:14px;line-height:1.7;color:#334155;font-style:italic}
.sec-lbl{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:#0f2557;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.crit-item{background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.18);border-radius:11px;padding:13px;margin-bottom:9px}
.crit-title{font-size:14px;font-weight:600;color:#dc2626;margin-bottom:5px}
.crit-desc{font-size:13px;color:#475569;line-height:1.5;margin-bottom:5px}
.crit-impact{font-size:12px;color:#dc2626;font-weight:500}
.pos-item{background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.18);border-radius:11px;padding:13px;margin-bottom:9px;display:flex;gap:10px;align-items:flex-start}
.pos-title{font-size:13px;font-weight:600;color:#059669;margin-bottom:4px}
.pos-desc{font-size:13px;color:#475569;line-height:1.5}
.err-box{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.22);border-radius:11px;padding:14px;color:#dc2626;font-size:14px;margin-bottom:14px;display:flex;gap:9px;align-items:flex-start}
.action-card{background:white;border-radius:15px;padding:20px;margin-bottom:12px;border:1.5px solid rgba(15,37,87,0.07);display:grid;grid-template-columns:40px 1fr;gap:14px;align-items:flex-start}
.action-num{width:40px;height:40px;border-radius:10px;background:#0f2557;color:white;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;flex-shrink:0}
.aprio{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:18px;font-size:11px;font-weight:700;margin-bottom:5px;font-family:'Syne',sans-serif;letter-spacing:.04em}
.pu{background:rgba(239,68,68,0.1);color:#dc2626}
.pi{background:rgba(245,158,11,0.1);color:#d97706}
.pm{background:rgba(99,102,241,0.1);color:#4338ca}
.action-title{font-size:14px;font-weight:600;color:#0f2557;margin-bottom:7px;font-family:'Syne',sans-serif}
.action-desc{font-size:13px;color:#475569;line-height:1.55;margin-bottom:9px}
.action-meta{display:flex;gap:14px;flex-wrap:wrap}
.ameta{font-size:12px;color:#94a3b8;display:flex;align-items:center;gap:3px}
.ameta strong{color:#64748b;font-weight:500}
.proj-box{background:linear-gradient(135deg,#0f2557,#1a3a6e);border-radius:14px;padding:22px;margin-top:18px;display:flex;gap:14px;align-items:center}
.proj-icon{font-size:30px;flex-shrink:0}
.proj-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#00c9b1;margin-bottom:5px}
.proj-text{color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6}
.btn-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
.ai-hint{background:rgba(0,201,177,0.07);border:1px solid rgba(0,201,177,0.22);border-radius:12px;padding:13px 16px;margin-bottom:22px;display:flex;gap:11px;align-items:flex-start;font-size:13px;color:#0f2557;line-height:1.6}
`;

export default function App() {
  const [screen, setScreen] = useState("home");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);

  const sec = QUESTIONS[sectionIdx];
  const canNext = sec?.items.every(q => answers[q.id] !== undefined);

  function answer(id, idx) { setAnswers(p => ({...p, [id]: idx})); }

  function next() {
    if (sectionIdx < QUESTIONS.length - 1) setSectionIdx(s => s + 1);
    else runAnalysis();
  }

  async function runAnalysis() {
    setScreen("loading"); setLoadingStep(0); setError(null);
    const s = computeScores(answers); setScores(s);
    const iv = setInterval(() => setLoadingStep(p => Math.min(p+1, 4)), 900);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{role:"user", content: buildAIPrompt(answers, s)}]
        })
      });
      clearInterval(iv); setLoadingStep(5);
      const d = await res.json();
      const txt = d.content?.map(b => b.text||"").join("") || "";
      setAiData(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch(e) { clearInterval(iv); setLoadingStep(5); setError(e.message); }
    setTimeout(() => setScreen("results"), 600);
  }

  function restart() { setScreen("home"); setSectionIdx(0); setAnswers({}); setScores(null); setAiData(null); setError(null); setLoadingStep(0); }

  const screenOrder = ["home","questionnaire","results","actions"];
  const tabLabels = ["Accueil","Diagnostic","Résultats","Plan d'action"];

  return (
    <>
      <style>{appCSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">
            <div className="logo-box">🛡</div>
            Risk<span style={{color:"#00c9b1"}}>Guard</span> AI
            <span className="nav-tag">RIMRAE · RARM 2026</span>
          </div>
          <div className="nav-tabs">
            {tabLabels.map((t,i) => (
              <button key={i} className={`ntab ${screen===screenOrder[i]?"active":""}`}>{t}</button>
            ))}
          </div>
        </nav>

        {screen === "home" && (
          <div className="hero">
            <div className="hero-glow" style={{top:-80,right:-80,width:280,height:280}} />
            <div className="hero-glow" style={{bottom:-100,left:-60,width:220,height:220}} />
            <div className="hero-badge">🌍 Outil officiel RARM Challenge 2026</div>
            <h1>Risk<span className="hl">Guard</span> AI</h1>
            <p className="hero-sub">La première plateforme intelligente de gestion des risques conçue spécifiquement pour les PME africaines.</p>
            <div className="hero-stats">
              <div className="hstat"><div className="num">20</div><div className="lbl">Questions IA</div></div>
              <div className="hstat"><div className="num">5</div><div className="lbl">Dimensions</div></div>
              <div className="hstat"><div className="num">15 min</div><div className="lbl">Diagnostic complet</div></div>
              <div className="hstat"><div className="num">100%</div><div className="lbl">Contexte africain</div></div>
            </div>
            <button className="btn-start" onClick={() => setScreen("questionnaire")}>
              ⚡ Lancer mon diagnostic gratuit
            </button>
          </div>
        )}

        {screen === "questionnaire" && (
          <div className="content">
            <div className="prog-wrap">
              <div className="prog-sections">
                {QUESTIONS.map((s,i) => {
                  const answered = s.items.filter(q => answers[q.id] !== undefined).length;
                  return (
                    <div className="prog-sec" key={i}>
                      <div className="prog-outer"><div className="prog-inner" style={{width:`${Math.round((answered/s.items.length)*100)}%`}}/></div>
                      <div className={`prog-lbl ${i===sectionIdx?"active":""}`}>{s.icon} {s.section}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="sec-head">
              <div className="sec-icon">{sec.icon}</div>
              <div>
                <div className="sec-title">{sec.section}</div>
                <div className="sec-sub">Section {sectionIdx+1}/5 — {sec.items.filter(q=>answers[q.id]!==undefined).length}/{sec.items.length} répondues</div>
              </div>
            </div>
            {sec.items.map((q,qi) => (
              <div key={q.id} className={`qcard ${answers[q.id]!==undefined?"answered":""}`}>
                <div className="qnum">Question {sectionIdx*4+qi+1} / 20</div>
                <div className="qtext">{q.text}</div>
                <div className="opts">
                  {q.options.map((o,oi) => (
                    <button key={oi} className={`opt ${answers[q.id]===oi?"sel":""}`} onClick={() => answer(q.id, oi)}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className="navrow">
              <button className="btn-prev" onClick={() => setSectionIdx(s=>s-1)} disabled={sectionIdx===0}>← Précédent</button>
              <span className="prog-txt">{Math.round((sec.items.filter(q=>answers[q.id]!==undefined).length/sec.items.length)*100)}% complété</span>
              <button className="btn-next" onClick={next} disabled={!canNext}>
                {sectionIdx===QUESTIONS.length-1 ? "✨ Analyser mes risques" : "Suivant →"}
              </button>
            </div>
          </div>
        )}

        {screen === "loading" && (
          <div className="content">
            <div className="loading-wrap">
              <div className="loading-ring"/>
              <div className="loading-title">Analyse IA en cours...</div>
              <div className="loading-sub">Votre profil de risque est en cours d'analyse</div>
              <div className="lsteps">
                {["Calcul des scores par dimension...","Analyse des réponses par l'IA...","Identification des risques critiques...","Génération du plan d'action personnalisé...","Finalisation du rapport..."].map((s,i) => (
                  <div key={i} className={`lstep ${i===loadingStep?"active":i<loadingStep?"done":""}`}>
                    <div className="sdot"/>
                    {i < loadingStep ? "✓ " : ""}{s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {screen === "results" && scores && (
          <div className="content">
            <div className="score-hero">
              <GaugeChart score={scores.global}/>
              <div className="score-info">
                <div className="rlevel-badge" style={{background:getRiskLevel(scores.global).bg, color:getRiskLevel(scores.global).color}}>
                  ● {getRiskLevel(scores.global).label}
                </div>
                <h2>Score de risque global : {scores.global}/100</h2>
                <p>{aiData ? aiData.resume_executif : "Votre diagnostic est prêt. Consultez les zones de vulnérabilité ci-dessous."}</p>
              </div>
            </div>
            <div className="dim-grid">
              {[["👥 RH & Management", scores.rh],["💰 Financier / Fraude", scores.fin],["⚠️ HSE & Sécurité", scores.hse],["🏛️ Gouvernance & RSE", scores.gov]].map(([label,score],i) => (
                <div className="dcard" key={i}>
                  <div className="dhead"><div className="dname">{label}</div><div className="dscore" style={{color:getRiskColor(score)}}>{score}</div></div>
                  <div className="dbar-bg"><div className="dbar" style={{width:`${score}%`,background:getRiskColor(score)}}/></div>
                </div>
              ))}
            </div>
            {error && <div className="err-box">⚠️ Analyse IA non disponible ({error}). Les scores calculés restent valides.</div>}
            {aiData && (
              <div className="ai-report">
                <div className="ai-rhead">
                  <div className="ai-badge">✨ Analyse IA</div>
                  <div className="ai-title">Rapport de risk management — Contexte africain</div>
                </div>
                <div className="resume-box">{aiData.resume_executif}</div>
                <div className="sec-lbl">⚡ Points critiques identifiés</div>
                {aiData.points_critiques?.map((p,i) => (
                  <div className="crit-item" key={i}>
                    <div className="crit-title">⚠ {p.titre}</div>
                    <div className="crit-desc">{p.description}</div>
                    <div className="crit-impact">Impact : {p.impact}</div>
                  </div>
                ))}
                <div className="sec-lbl" style={{marginTop:18}}>✅ Points positifs</div>
                {aiData.points_positifs?.map((p,i) => (
                  <div className="pos-item" key={i}>
                    <span style={{fontSize:17,flexShrink:0}}>✓</span>
                    <div><div className="pos-title">{p.titre}</div><div className="pos-desc">{p.description}</div></div>
                  </div>
                ))}
              </div>
            )}
            <div className="btn-row">
              <button className="btn-accent" onClick={() => setScreen("actions")}>📋 Voir le plan d'action →</button>
              <button className="btn-outline" onClick={restart}>🔄 Nouveau diagnostic</button>
            </div>
          </div>
        )}

        {screen === "actions" && (
          <div className="content">
            <div style={{marginBottom:22}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#0f2557",marginBottom:5}}>Plan d'action personnalisé</h2>
              <p style={{fontSize:14,color:"#64748b"}}>Généré par IA · Adapté au contexte africain{scores ? ` · Score actuel : ` : ""}{scores && <strong style={{color:getRiskColor(scores.global)}}>{scores.global}/100</strong>}</p>
            </div>
            {aiData?.plan_action ? (
              <>
                <div className="ai-hint">
                  <span style={{fontSize:19,flexShrink:0}}>✨</span>
                  <div>L'IA a identifié <strong>{aiData.plan_action.length} actions prioritaires</strong> classées par urgence et impact. {aiData.projection}</div>
                </div>
                {aiData.plan_action.map((a,i) => (
                  <div className="action-card" key={i}>
                    <div className="action-num">{i+1}</div>
                    <div>
                      <div className={`aprio ${a.priorite==="URGENT"?"pu":a.priorite==="IMPORTANT"?"pi":"pm"}`}>
                        {a.priorite==="URGENT"?"🔴":a.priorite==="IMPORTANT"?"🟡":"🔵"} {a.priorite}
                      </div>
                      <div className="action-title">{a.titre}</div>
                      <div className="action-desc">{a.description}</div>
                      <div className="action-meta">
                        <div className="ameta">⏱ <strong>{a.delai}</strong></div>
                        <div className="ameta">💼 {a.ressources}</div>
                        <div className="ameta">📊 {a.indicateur}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {aiData.projection && (
                  <div className="proj-box">
                    <div className="proj-icon">🎯</div>
                    <div><div className="proj-title">Objectif projeté</div><div className="proj-text">{aiData.projection}</div></div>
                  </div>
                )}
              </>
            ) : (
              <div style={{textAlign:"center",padding:48,color:"#94a3b8",fontSize:14}}>
                Aucun plan disponible. Veuillez relancer le diagnostic.
              </div>
            )}
            <div className="btn-row">
              <button className="btn-outline" onClick={() => setScreen("results")}>← Retour aux résultats</button>
              <button className="btn-accent" onClick={restart}>🔄 Nouveau diagnostic</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
