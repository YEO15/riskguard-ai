import { useState } from "react";

// ─── DONNÉES SECTORIELLES OHADA ──────────────────────────────────────────────
const SECTEURS = ["Commerce / Distribution","Services / Conseil","Industrie / BTP","Agriculture / Agro-industrie","Santé / Éducation","Transport / Logistique"];

const QUESTIONS_BASE = [
  {
    section: "Profil Entreprise", icon: "🏢", dim: "profil",
    items: [
      { id:"p1", text:"Taille de votre entreprise ?", options:["1-10 employés","11-50 employés","51-200 employés","200+ employés"] },
      { id:"p2", text:"Secteur d'activité ?", options: SECTEURS },
      { id:"p3", text:"Ancienneté de l'entreprise ?", options:["Moins de 2 ans","2 à 5 ans","5 à 10 ans","Plus de 10 ans"] },
      { id:"p4", text:"Chiffre d'affaires annuel estimé ?", options:["Moins de 10M FCFA","10M à 100M FCFA","100M à 500M FCFA","Plus de 500M FCFA"] },
    ]
  },
  {
    section: "Gouvernance & OHADA", icon: "⚖️", dim: "ohada",
    items: [
      { id:"o1", text:"Votre entreprise est-elle régulièrement immatriculée au RCCM ?", options:["Non, pas encore","En cours de régularisation","Oui mais pas à jour","Oui, parfaitement à jour"] },
      { id:"o2", text:"Tenez-vous une comptabilité conforme au Système Comptable OHADA (SYSCOHADA) ?", options:["Aucune comptabilité formelle","Comptabilité informelle","SYSCOHADA partiellement","SYSCOHADA complet + bilan annuel"] },
      { id:"o3", text:"Avez-vous des statuts d'entreprise déposés et à jour ?", options:["Aucun statut","Statuts non déposés","Déposés mais non mis à jour","Déposés et à jour"] },
      { id:"o4", text:"En cas de litige commercial, connaissez-vous les procédures OHADA applicables ?", options:["Aucune connaissance","Connaissance très limitée","Connaissance partielle","Bonne maîtrise des procédures"] },
    ]
  },
  {
    section: "Risques RH & Management", icon: "👥", dim: "rh",
    items: [
      { id:"r1", text:"Comment qualifieriez-vous le climat social ces 6 derniers mois ?", options:["Très dégradé — conflits fréquents","Tendu — frictions régulières","Stable — irritants mineurs","Excellent — cohésion forte"] },
      { id:"r2", text:"Quel est votre taux de turnover annuel ?", options:["Plus de 30%","15 à 30%","5 à 15%","Moins de 5%"] },
      { id:"r3", text:"Des comportements managériaux toxiques ont-ils été signalés ?", options:["Oui, cas graves non résolus","Oui, quelques incidents","Rarement","Non, jamais"] },
      { id:"r4", text:"Avez-vous des contrats de travail écrits pour tous vos employés ?", options:["Non, aucun contrat écrit","Quelques contrats seulement","La plupart ont des contrats","Tous ont des contrats conformes OHADA"] },
    ]
  },
  {
    section: "Risques Financiers & Fraude", icon: "💰", dim: "finance",
    items: [
      { id:"f1", text:"Disposez-vous de procédures de contrôle interne formalisées ?", options:["Aucune procédure","Règles informelles","Procédures partielles","Procédures complètes et auditées"] },
      { id:"f2", text:"Des anomalies financières ou fraudes ont-elles été détectées ?", options:["Oui, cas graves non résolus","Oui, cas mineurs","Suspicions sans preuves","Aucun incident"] },
      { id:"f3", text:"Comment gérez-vous l'accès à la caisse et aux comptes bancaires ?", options:["Accès libre pour tous","Une seule personne sans contrôle","Accès partagé sans traçabilité","Double signature + traçabilité"] },
      { id:"f4", text:"Faites-vous appel à un expert-comptable ou commissaire aux comptes ?", options:["Jamais","Occasionnellement","Annuellement","Trimestriellement ou plus"] },
    ]
  },
  {
    section: "Risques HSE & Opérationnels", icon: "⚠️", dim: "hse",
    items: [
      { id:"h1", text:"Combien d'accidents de travail l'an dernier ?", options:["5 ou plus","2 à 4","1","Aucun"] },
      { id:"h2", text:"Vos employés ont-ils des équipements de protection (EPI) ?", options:["Non, aucun EPI","EPI disponibles non portés","EPI parfois utilisés","EPI systématiques et vérifiés"] },
      { id:"h3", text:"Avez-vous souscrit une assurance responsabilité civile professionnelle ?", options:["Non, aucune assurance","Assurance partielle","Assurance de base","Couverture complète"] },
      { id:"h4", text:"Avez-vous un plan de continuité en cas de crise (incendie, inondation, panne) ?", options:["Aucun plan","Plan informel non testé","Plan partiel","Plan complet testé annuellement"] },
    ]
  },
];

// Questions supplémentaires par secteur
const QUESTIONS_SECTEUR = {
  0: { // Commerce
    section: "Risques Spécifiques — Commerce", icon: "🛒", dim: "sectoriel",
    items: [
      { id:"s1", text:"Gérez-vous vos stocks avec un système d'inventaire formel ?", options:["Aucun inventaire","Inventaire annuel","Inventaire trimestriel","Inventaire permanent informatisé"] },
      { id:"s2", text:"Avez-vous des impayés clients supérieurs à 30 jours représentant plus de 20% de votre CA ?", options:["Oui, plus de 40%","Oui, 20 à 40%","Moins de 20%","Moins de 5% — bonne gestion crédit"] },
      { id:"s3", text:"Votre chaîne d'approvisionnement dépend-elle d'un seul fournisseur clé ?", options:["Oui, un seul fournisseur","2 à 3 fournisseurs","4 à 6 fournisseurs","7+ fournisseurs diversifiés"] },
      { id:"s4", text:"Avez-vous une politique de retours et de garantie produits formalisée ?", options:["Aucune politique","Politique informelle","Politique écrite non appliquée","Politique formelle appliquée"] },
    ]
  },
  1: { // Services
    section: "Risques Spécifiques — Services", icon: "💼", dim: "sectoriel",
    items: [
      { id:"s1", text:"Vos contrats clients sont-ils écrits et incluent-ils des clauses de responsabilité ?", options:["Aucun contrat écrit","Contrats sans clauses protection","Contrats partiellement protecteurs","Contrats complets validés juridiquement"] },
      { id:"s2", text:"Avez-vous une politique de protection des données clients ?", options:["Aucune politique","Mesures basiques","Politique partielle","Politique RGPD/données conforme"] },
      { id:"s3", text:"La perte d'un client représenterait-elle plus de 30% de votre CA ?", options:["Oui, plus de 50%","30 à 50%","15 à 30%","Moins de 15% — portefeuille diversifié"] },
      { id:"s4", text:"Avez-vous une assurance responsabilité professionnelle (erreurs & omissions) ?", options:["Non","En cours de souscription","Couverture minimale","Couverture complète"] },
    ]
  },
  2: { // Industrie/BTP
    section: "Risques Spécifiques — Industrie/BTP", icon: "🏗️", dim: "sectoriel",
    items: [
      { id:"s1", text:"Vos machines et équipements font-ils l'objet d'une maintenance préventive planifiée ?", options:["Aucune maintenance planifiée","Maintenance corrective uniquement","Maintenance annuelle","Maintenance préventive régulière"] },
      { id:"s2", text:"Avez-vous les autorisations et permis de construire/exploiter requis ?", options:["Aucun permis","Permis partiels","La plupart des permis","Tous permis et licences à jour"] },
      { id:"s3", text:"Vos sous-traitants sont-ils couverts par une assurance chantier ?", options:["Non vérifié","Rarement vérifiés","Parfois vérifiés","Systématiquement vérifiés"] },
      { id:"s4", text:"Avez-vous subi des arrêts de production imprévus de plus de 3 jours l'an dernier ?", options:["3 arrêts ou plus","2 arrêts","1 arrêt","Aucun arrêt imprévu"] },
    ]
  },
  3: { // Agriculture
    section: "Risques Spécifiques — Agriculture", icon: "🌾", dim: "sectoriel",
    items: [
      { id:"s1", text:"Avez-vous une assurance récolte ou assurance agricole ?", options:["Non","En cours","Couverture partielle","Couverture complète"] },
      { id:"s2", text:"Votre production dépend-elle d'une seule culture ou d'un seul produit ?", options:["Oui, une seule culture","2 produits","3 à 4 produits","Diversification complète"] },
      { id:"s3", text:"Avez-vous accès à un système d'irrigation indépendant des pluies ?", options:["Non, dépendance totale pluies","Irrigation partielle","Irrigation majoritaire","Irrigation complète autonome"] },
      { id:"s4", text:"Vos accords de vente sont-ils contractualisés avant la récolte ?", options:["Jamais","Rarement","Souvent","Toujours — contrats fermes"] },
    ]
  },
  4: { // Santé/Éducation
    section: "Risques Spécifiques — Santé/Éducation", icon: "🏥", dim: "sectoriel",
    items: [
      { id:"s1", text:"Vos locaux sont-ils aux normes sanitaires/sécurité requises ?", options:["Non conformes","Partiellement conformes","Majorité conforme","Totalement conformes et certifiés"] },
      { id:"s2", text:"Votre personnel a-t-il les diplômes et agréments requis ?", options:["Non vérifiés","Partiellement vérifiés","Majorité vérifiés","Tous agréés et à jour"] },
      { id:"s3", text:"Avez-vous une politique de confidentialité des données patients/élèves ?", options:["Aucune","Politique informelle","Politique écrite","Politique formelle appliquée"] },
      { id:"s4", text:"Êtes-vous à jour dans le paiement des taxes et cotisations sociales ?", options:["Non, retards importants","Retards mineurs","Généralement à jour","Toujours à jour"] },
    ]
  },
  5: { // Transport
    section: "Risques Spécifiques — Transport", icon: "🚛", dim: "sectoriel",
    items: [
      { id:"s1", text:"Vos véhicules/engins sont-ils assurés et en règle (visite technique) ?", options:["Non, aucune assurance","Partiellement assurés","Majorité assurés","Tous assurés et en règle"] },
      { id:"s2", text:"Vos chauffeurs ont-ils des permis valides et ont-ils reçu une formation sécurité ?", options:["Non vérifiés","Permis vérifiés sans formation","Formation basique","Formation complète et régulière"] },
      { id:"s3", text:"Avez-vous eu des accidents de transport entraînant des pertes l'an dernier ?", options:["3 ou plus","2","1","Aucun accident"] },
      { id:"s4", text:"Avez-vous une assurance marchandises transportées ?", options:["Non","En cours","Couverture partielle","Couverture totale"] },
    ]
  },
};

// ─── SCORING ─────────────────────────────────────────────────────────────────
const WEIGHTS = {
  ohada:  { o1:[25,18,10,2], o2:[28,20,12,2], o3:[20,14,8,1], o4:[15,10,5,1] },
  rh:     { r1:[25,15,8,2],  r2:[25,18,10,3], r3:[30,18,8,0], r4:[20,14,8,2] },
  finance:{ f1:[25,18,10,3], f2:[30,18,10,0], f3:[28,20,10,2], f4:[20,15,8,2] },
  hse:    { h1:[30,20,10,0], h2:[25,18,10,2], h3:[20,14,8,2], h4:[20,15,8,2] },
  sectoriel:{ s1:[20,15,8,2], s2:[25,18,10,2], s3:[22,15,8,2], s4:[18,12,6,1] },
};

function computeScores(answers) {
  const sum = (dim) => Object.entries(WEIGHTS[dim] || {}).reduce((acc,[k,w]) =>
    acc + (answers[k] !== undefined ? (w[answers[k]] || 0) : 0), 0);
  const ohada   = Math.min(100, sum("ohada"));
  const rh      = Math.min(100, sum("rh"));
  const finance = Math.min(100, sum("finance"));
  const hse     = Math.min(100, sum("hse"));
  const sect    = Math.min(100, sum("sectoriel"));
  const global  = Math.round((ohada*0.25 + rh*0.20 + finance*0.25 + hse*0.15 + sect*0.15));
  return { ohada, rh, finance, hse, sectoriel: sect, global };
}

// ─── PROMPT IA ───────────────────────────────────────────────────────────────
function buildPrompt(answers, scores, sectorLabel) {
  const size   = ["1-10","11-50","51-200","200+"][answers.p1] || "?";
  const age    = ["<2ans","2-5ans","5-10ans","10ans+"][answers.p3] || "?";
  const ca     = ["<10M FCFA","10-100M FCFA","100-500M FCFA","500M+ FCFA"][answers.p4] || "?";

  const allQ = [...QUESTIONS_BASE];
  if (answers.p2 !== undefined && QUESTIONS_SECTEUR[answers.p2]) allQ.push(QUESTIONS_SECTEUR[answers.p2]);
  const qtext = allQ.flatMap(s => s.items).map(q => {
    const i = answers[q.id];
    return `• ${q.text}\n  → ${i !== undefined ? q.options[i] : "Non répondu"}`;
  }).join("\n");

  return `Tu es un expert senior en risk management, droit OHADA et gouvernance d'entreprise en Afrique subsaharienne, spécialisé dans les PME ivoiriennes et west-africaines.

PROFIL ENTREPRISE :
Secteur: ${sectorLabel} | Taille: ${size} employés | Ancienneté: ${age} | CA: ${ca}

SCORES DE RISQUE (0=aucun risque, 100=risque maximal) :
• Conformité OHADA & Gouvernance : ${scores.ohada}/100
• Risques RH & Management : ${scores.rh}/100  
• Risques Financiers & Fraude : ${scores.finance}/100
• Risques HSE & Opérationnels : ${scores.hse}/100
• Risques Sectoriels : ${scores.sectoriel}/100
• SCORE GLOBAL : ${scores.global}/100

RÉPONSES DÉTAILLÉES :
${qtext}

Génère un rapport de risk management professionnel en JSON (UNIQUEMENT le JSON, rien d'autre) :
{
  "resume_executif": "3 phrases percutantes et précises sur la situation réelle de cette entreprise, avec des chiffres",
  "niveau_risque": "CRITIQUE|ÉLEVÉ|MODÉRÉ|FAIBLE",
  "alerte_ohada": "1 phrase sur le risque juridique OHADA spécifique à cette entreprise",
  "points_critiques": [
    {"titre":"...","description":"...","impact_financier":"Estimation en FCFA ou %","urgence":"IMMÉDIAT|COURT TERME|MOYEN TERME"},
    {"titre":"...","description":"...","impact_financier":"...","urgence":"..."},
    {"titre":"...","description":"...","impact_financier":"...","urgence":"..."}
  ],
  "points_positifs": [
    {"titre":"...","description":"..."}
  ],
  "plan_action": [
    {"priorite":"URGENT","delai":"0-30 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."},
    {"priorite":"URGENT","delai":"0-30 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."},
    {"priorite":"IMPORTANT","delai":"30-90 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."},
    {"priorite":"IMPORTANT","delai":"30-90 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."},
    {"priorite":"STRATÉGIQUE","delai":"90-180 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."}
  ],
  "conformite_ohada": {
    "statut": "CONFORME|PARTIELLEMENT CONFORME|NON CONFORME",
    "points_attention": ["...","...","..."],
    "actions_juridiques": ["...","..."]
  },
  "score_projection": {
    "score_actuel": ${scores.global},
    "score_3mois": <score estimé après actions urgentes>,
    "score_6mois": <score estimé après plan complet>,
    "economies_estimees": "Estimation des pertes évitées en FCFA"
  },
  "message_dirigeant": "Message direct, franc et motivant de 2 phrases au dirigeant"
}

IMPÉRATIF: Adapte TOUT au contexte ivoirien/OHADA. Cite des organismes réels: CEPICI, CGECI, Tribunal de Commerce d'Abidjan, CNPS, DGI, BIC/BIS. Sois très concret avec des chiffres en FCFA.`;
}

// ─── HELPERS VISUELS ─────────────────────────────────────────────────────────
function getRiskColor(s) { return s>=70?"#ef4444":s>=45?"#f59e0b":"#10b981"; }
function getRiskLevel(s) {
  if(s>=70) return {label:"CRITIQUE",bg:"#fee2e2",color:"#dc2626"};
  if(s>=55) return {label:"ÉLEVÉ",bg:"#fef3c7",color:"#d97706"};
  if(s>=35) return {label:"MODÉRÉ",bg:"#e0e7ff",color:"#4338ca"};
  return {label:"FAIBLE",bg:"#dcfce7",color:"#16a34a"};
}

function Gauge({score}) {
  const c=getRiskColor(score), r=66, cx=88, cy=82;
  const a=(score/100)*180, rad=(a-180)*Math.PI/180;
  const ex=cx+r*Math.cos(rad), ey=cy+r*Math.sin(rad);
  return (
    <svg width="176" height="92" viewBox="0 0 176 92">
      <path d={`M ${cx-r},${cy} A ${r},${r} 0 0,1 ${cx+r},${cy}`} fill="none" stroke="rgba(15,37,87,0.1)" strokeWidth="12" strokeLinecap="round"/>
      <path d={`M ${cx-r},${cy} A ${r},${r} 0 ${a>180?1:0},1 ${ex},${ey}`} fill="none" stroke={c} strokeWidth="12" strokeLinecap="round"/>
      <text x={cx} y={cy-2} textAnchor="middle" fontFamily="'Syne',sans-serif" fontSize="28" fontWeight="800" fill={c}>{score}</text>
      <text x={cx} y={cy+15} textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="10" fill="#94a3b8">/ 100</text>
    </svg>
  );
}

function ScoreProjection({data}) {
  if(!data) return null;
  const bars = [
    {label:"Aujourd'hui", score:data.score_actuel, color:"#ef4444"},
    {label:"Dans 3 mois", score:data.score_3mois, color:"#f59e0b"},
    {label:"Dans 6 mois", score:data.score_6mois, color:"#10b981"},
  ];
  return (
    <div style={{background:"white",borderRadius:14,padding:20,border:"1.5px solid rgba(15,37,87,0.08)",marginBottom:16}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#0f2557",textTransform:"uppercase",letterSpacing:".05em",marginBottom:14}}>📈 Projection de votre score</div>
      {bars.map((b,i)=>(
        <div key={i} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:12,color:"#64748b"}}>{b.label}</span>
            <span style={{fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif",color:b.color}}>{b.score}/100</span>
          </div>
          <div style={{height:7,background:"rgba(15,37,87,0.08)",borderRadius:4,overflow:"hidden"}}>
            <div style={{width:`${b.score}%`,height:"100%",background:b.color,borderRadius:4,transition:"width 1s ease"}}/>
          </div>
        </div>
      ))}
      {data.economies_estimees && (
        <div style={{marginTop:12,padding:"10px 14px",background:"rgba(16,185,129,0.08)",borderRadius:10,border:"1px solid rgba(16,185,129,0.2)"}}>
          <div style={{fontSize:12,color:"#059669",fontWeight:600}}>💰 Pertes potentielles évitées en suivant le plan</div>
          <div style={{fontSize:14,fontWeight:700,color:"#047857",marginTop:3}}>{data.economies_estimees}</div>
        </div>
      )}
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#eef2ff;color:#1e293b;min-height:100vh}
h1,h2,h3,h4,.syne{font-family:'Syne',sans-serif}
.nav{background:#0f2557;padding:0 28px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(15,37,87,0.5)}
.nav-logo{display:flex;align-items:center;gap:10px;font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:white}
.logo-box{width:32px;height:32px;background:#00c9b1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px}
.nav-tag{font-size:10px;color:rgba(255,255,255,0.3);font-weight:400;margin-left:4px;letter-spacing:.04em;border-left:1px solid rgba(255,255,255,0.15);padding-left:10px}
.nav-tabs{display:flex;gap:2px}
.ntab{padding:6px 13px;border-radius:18px;font-size:12px;color:rgba(255,255,255,0.4);border:none;background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
.ntab.active{background:rgba(0,201,177,0.18);color:#00c9b1;font-weight:500}
.ntab.done{color:rgba(255,255,255,0.65)}
.hero{background:linear-gradient(135deg,#0a1f4e 0%,#1a3a8e 55%,#0f2557 100%);padding:68px 32px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-80px;right:-60px;width:300px;height:300px;border-radius:50%;background:rgba(0,201,177,0.07);pointer-events:none}
.hero::after{content:'';position:absolute;bottom:-100px;left:-50px;width:250px;height:250px;border-radius:50%;background:rgba(0,201,177,0.05);pointer-events:none}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(0,201,177,0.12);color:#00c9b1;border:1px solid rgba(0,201,177,0.28);padding:5px 15px;border-radius:20px;font-size:12px;font-weight:500;margin-bottom:22px;letter-spacing:.05em}
.hero h1{font-size:46px;font-weight:800;color:white;line-height:1.1;margin-bottom:16px}
.hero h1 .hl{color:#00c9b1}
.hero-sub{font-size:16px;color:rgba(255,255,255,0.62);max-width:520px;margin:0 auto 28px;line-height:1.65;font-weight:300}
.features{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;margin-bottom:34px}
.feat{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px 16px;font-size:13px;color:rgba(255,255,255,0.8);display:flex;align-items:center;gap:7px}
.hero-stats{display:flex;justify-content:center;gap:40px;margin-bottom:34px}
.hstat .num{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#00c9b1}
.hstat .lbl{font-size:11px;color:rgba(255,255,255,0.42);margin-top:2px}
.btn-start{background:#00c9b1;color:#0f2557;border:none;padding:15px 34px;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.btn-start:hover{background:#00a896;transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,201,177,0.3)}
.content{flex:1;padding:26px 28px;max-width:880px;margin:0 auto;width:100%}
.prog-sections{display:flex;gap:6px;margin-bottom:20px}
.prog-sec{flex:1;text-align:center}
.prog-outer{height:4px;background:rgba(15,37,87,0.1);border-radius:2px;overflow:hidden;margin-bottom:5px}
.prog-inner{height:100%;background:#00c9b1;border-radius:2px;transition:width .4s}
.prog-lbl{font-size:10px;color:#94a3b8;font-weight:500}
.prog-lbl.active{color:#0f2557;font-weight:700}
.sec-head{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.sec-icon{width:42px;height:42px;background:#0f2557;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0}
.sec-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#0f2557}
.sec-sub{font-size:13px;color:#64748b;margin-top:2px}
.ohada-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(59,130,246,0.1);color:#1d4ed8;border:1px solid rgba(59,130,246,0.2);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;margin-top:4px}
.qcard{background:white;border-radius:14px;padding:20px;margin-bottom:11px;border:1.5px solid rgba(15,37,87,0.07);transition:border-color .2s}
.qcard.answered{border-color:rgba(0,201,177,0.35);background:rgba(0,201,177,0.015)}
.qnum{font-size:11px;font-weight:600;color:#00a896;letter-spacing:.07em;margin-bottom:6px;text-transform:uppercase}
.qtext{font-size:14px;font-weight:500;color:#0f2557;margin-bottom:12px;line-height:1.5}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.opt{padding:10px 12px;border:1.5px solid rgba(15,37,87,0.1);border-radius:9px;background:white;font-family:'DM Sans',sans-serif;font-size:12.5px;color:#475569;cursor:pointer;transition:all .15s;text-align:left;line-height:1.4}
.opt:hover{border-color:#00c9b1;color:#0f2557;background:rgba(0,201,177,0.04)}
.opt.sel{border-color:#00c9b1;background:rgba(0,201,177,0.09);color:#0f2557;font-weight:500}
.navrow{display:flex;justify-content:space-between;align-items:center;margin-top:20px}
.btn-prev{padding:10px 20px;border:1.5px solid rgba(15,37,87,0.15);border-radius:9px;background:white;font-family:'DM Sans',sans-serif;font-size:13px;color:#0f2557;cursor:pointer;font-weight:500;transition:all .15s}
.btn-prev:disabled{opacity:0.3;cursor:not-allowed}
.btn-next{padding:11px 24px;background:#0f2557;border:none;border-radius:9px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:white;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px}
.btn-next:hover{background:#1a3a6e;transform:translateY(-1px)}
.btn-next:disabled{opacity:0.35;cursor:not-allowed;transform:none}
.btn-accent{padding:11px 22px;background:#00c9b1;border:none;border-radius:9px;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#0f2557;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
.btn-accent:hover{background:#00a896}
.btn-outline{padding:10px 20px;border:1.5px solid rgba(15,37,87,0.15);border-radius:9px;background:white;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#0f2557;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
.btn-outline:hover{border-color:#0f2557;background:#eef2ff}
.prog-txt{font-size:12px;color:#94a3b8;font-weight:500}
.loading-wrap{text-align:center;padding:64px 20px}
.ring{width:64px;height:64px;border:4px solid rgba(0,201,177,0.15);border-top-color:#00c9b1;border-radius:50%;animation:spin .85s linear infinite;margin:0 auto 20px}
@keyframes spin{to{transform:rotate(360deg)}}
.lstep{display:flex;align-items:center;gap:9px;padding:9px 13px;background:white;border-radius:9px;font-size:13px;color:#94a3b8;border:1px solid rgba(15,37,87,0.06);transition:all .3s;margin-bottom:7px;max-width:320px;margin-left:auto;margin-right:auto}
.lstep.active{color:#0f2557;border-color:rgba(0,201,177,0.25);background:rgba(0,201,177,0.04)}
.lstep.done{color:#10b981;border-color:rgba(16,185,129,0.22)}
.sdot{width:7px;height:7px;border-radius:50%;background:currentColor;flex-shrink:0}
.score-hero{background:white;border-radius:16px;padding:24px;margin-bottom:16px;border:1.5px solid rgba(15,37,87,0.07);display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center}
.rl-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:16px;font-size:12px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:8px}
.score-info h2{font-size:19px;font-weight:700;color:#0f2557;margin-bottom:6px}
.score-info p{font-size:13px;color:#475569;line-height:1.6}
.dim-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.dcard{background:white;border-radius:12px;padding:14px;border:1.5px solid rgba(15,37,87,0.07)}
.dhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.dname{font-size:12px;font-weight:600;color:#0f2557;font-family:'Syne',sans-serif}
.dscore{font-family:'Syne',sans-serif;font-size:18px;font-weight:800}
.dbar-bg{height:5px;background:rgba(15,37,87,0.08);border-radius:3px;overflow:hidden}
.dbar{height:100%;border-radius:3px;transition:width 1s ease}
.ai-card{background:white;border-radius:16px;padding:24px;margin-bottom:14px;border:1.5px solid rgba(15,37,87,0.07)}
.ai-head{display:flex;align-items:center;gap:9px;margin-bottom:16px;padding-bottom:13px;border-bottom:1px solid rgba(15,37,87,0.07)}
.ai-badge{display:flex;align-items:center;gap:5px;background:rgba(0,201,177,0.1);color:#00a896;padding:4px 10px;border-radius:16px;font-size:11px;font-weight:600;letter-spacing:.04em}
.resume{background:rgba(15,37,87,0.03);border-radius:10px;padding:14px;margin-bottom:16px;border-left:4px solid #0f2557;font-size:14px;line-height:1.7;color:#334155;font-style:italic}
.ohada-alert{background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.2);border-radius:10px;padding:12px 14px;margin-bottom:16px;display:flex;gap:9px;align-items:flex-start}
.ohada-block{background:white;border-radius:12px;padding:18px;border:1.5px solid rgba(59,130,246,0.2);margin-bottom:14px}
.ohada-status{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:14px;font-size:12px;font-weight:700;margin-bottom:12px}
.slbl{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:#0f2557;text-transform:uppercase;letter-spacing:.06em;margin-bottom:9px;margin-top:16px}
.crit{background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.16);border-radius:10px;padding:13px;margin-bottom:8px}
.crit-title{font-size:13px;font-weight:600;color:#dc2626;margin-bottom:5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.urgence-tag{font-size:10px;padding:2px 7px;border-radius:8px;font-weight:700;font-family:'Syne',sans-serif}
.u-immediat{background:#fee2e2;color:#dc2626}
.u-court{background:#fef3c7;color:#d97706}
.u-moyen{background:#e0e7ff;color:#4338ca}
.crit-desc{font-size:13px;color:#475569;line-height:1.5;margin-bottom:5px}
.crit-impact{font-size:12px;color:#dc2626;font-weight:500}
.pos{background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.16);border-radius:10px;padding:12px;margin-bottom:8px;display:flex;gap:9px}
.pos-title{font-size:13px;font-weight:600;color:#059669;margin-bottom:3px}
.pos-desc{font-size:13px;color:#475569;line-height:1.5}
.err-box{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:12px;color:#dc2626;font-size:13px;margin-bottom:13px;display:flex;gap:8px}
.acard{background:white;border-radius:14px;padding:18px;margin-bottom:11px;border:1.5px solid rgba(15,37,87,0.07);display:grid;grid-template-columns:38px 1fr;gap:13px;align-items:flex-start}
.anum{width:38px;height:38px;border-radius:10px;background:#0f2557;color:white;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;flex-shrink:0}
.aprio{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:16px;font-size:11px;font-weight:700;margin-bottom:5px;font-family:'Syne',sans-serif;letter-spacing:.04em}
.pu{background:rgba(239,68,68,0.1);color:#dc2626}
.pi{background:rgba(245,158,11,0.1);color:#d97706}
.ps{background:rgba(99,102,241,0.1);color:#4338ca}
.atitle{font-size:14px;font-weight:600;color:#0f2557;margin-bottom:6px;font-family:'Syne',sans-serif}
.adesc{font-size:13px;color:#475569;line-height:1.55;margin-bottom:8px}
.ameta{display:flex;gap:12px;flex-wrap:wrap}
.am{font-size:11px;color:#94a3b8;display:flex;align-items:center;gap:3px}
.am strong{color:#64748b;font-weight:500}
.proj-box{background:linear-gradient(135deg,#0f2557,#1a3a6e);border-radius:14px;padding:20px;margin-top:16px;display:flex;gap:13px;align-items:center}
.proj-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#00c9b1;margin-bottom:5px}
.proj-text{color:rgba(255,255,255,0.85);font-size:13px;line-height:1.6}
.ai-hint{background:rgba(0,201,177,0.07);border:1px solid rgba(0,201,177,0.2);border-radius:11px;padding:12px 15px;margin-bottom:20px;display:flex;gap:10px;font-size:13px;color:#0f2557;line-height:1.6}
.btn-row{display:flex;gap:9px;flex-wrap:wrap;margin-top:20px}
.msg-dir{background:linear-gradient(135deg,#0f2557,#1e4080);border-radius:14px;padding:20px;margin-top:16px;display:flex;gap:13px;align-items:flex-start}
.msg-dir-text{color:rgba(255,255,255,0.9);font-size:14px;line-height:1.7;font-style:italic}
`;

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]         = useState("home");
  const [secIdx, setSecIdx]         = useState(0);
  const [answers, setAnswers]       = useState({});
  const [scores, setScores]         = useState(null);
  const [aiData, setAiData]         = useState(null);
  const [loadStep, setLoadStep]     = useState(0);
  const [error, setError]           = useState(null);

  const sectorIdx = answers.p2;
  const allSections = [
    ...QUESTIONS_BASE,
    ...(sectorIdx !== undefined && QUESTIONS_SECTEUR[sectorIdx] ? [QUESTIONS_SECTEUR[sectorIdx]] : [])
  ];
  const sec     = allSections[secIdx];
  const total   = allSections.length;
  const canNext = sec?.items.every(q => answers[q.id] !== undefined);
  const sectorLabel = sectorIdx !== undefined ? SECTEURS[sectorIdx] : "Non défini";

  function answer(id, idx) { setAnswers(p => ({...p, [id]: idx})); }

  function next() {
    if (secIdx < total - 1) setSecIdx(s => s + 1);
    else runAnalysis();
  }

  async function runAnalysis() {
    setScreen("loading"); setLoadStep(0); setError(null);
    const s = computeScores(answers); setScores(s);
    const iv = setInterval(() => setLoadStep(p => Math.min(p+1, 5)), 1000);
    try {
      const res = await fetch("https://riskguard-ai-production.up.railway.app/api/analyze", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ messages: [{role:"user", content: buildPrompt(answers, s, sectorLabel)}] })
      });
      clearInterval(iv); setLoadStep(6);
      const d = await res.json();
      const txt = d.content?.map(b => b.text||"").join("") || "";
      setAiData(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch(e) { clearInterval(iv); setLoadStep(6); setError(e.message); }
    setTimeout(() => setScreen("results"), 500);
  }

  function restart() {
    setScreen("home"); setSecIdx(0); setAnswers({});
    setScores(null); setAiData(null); setError(null); setLoadStep(0);
  }

  const tabs = ["Accueil","Diagnostic","Résultats","Plan d'action"];
  const screenOrder = ["home","questionnaire","results","actions"];

  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-box">🛡</div>
          Risk<span style={{color:"#00c9b1"}}>Guard</span> AI
          <span className="nav-tag">RIMRAE · RARM Challenge 2026</span>
        </div>
        <div className="nav-tabs">
          {tabs.map((t,i) => (
            <button key={i} className={`ntab ${screen===screenOrder[i]?"active":screenOrder.indexOf(screen)>i?"done":""}`}>{t}</button>
          ))}
        </div>
      </nav>

      {/* HOME */}
      {screen==="home" && (
        <div className="hero">
          <div className="hero-badge">🌍 Solution officielle RARM Challenge 2026 — Abidjan</div>
          <h1>Risk<span className="hl">Guard</span> AI</h1>
          <p className="hero-sub">La première plateforme intelligente de gestion des risques construite pour les PME africaines. Diagnostic sectoriel, conformité OHADA, plan d'action personnalisé.</p>
          <div className="features">
            <div className="feat">⚖️ Conformité OHADA intégrée</div>
            <div className="feat">🎯 Questions sectorielles adaptées</div>
            <div className="feat">🤖 Analyse IA temps réel</div>
            <div className="feat">📊 Plan d'action chiffré en FCFA</div>
          </div>
          <div className="hero-stats">
            <div className="hstat"><div className="num">24</div><div className="lbl">Questions IA</div></div>
            <div className="hstat"><div className="num">6</div><div className="lbl">Secteurs couverts</div></div>
            <div className="hstat"><div className="num">OHADA</div><div className="lbl">Conformité intégrée</div></div>
            <div className="hstat"><div className="num">15 min</div><div className="lbl">Diagnostic complet</div></div>
          </div>
          <button className="btn-start" onClick={() => setScreen("questionnaire")}>
            ⚡ Lancer mon diagnostic gratuit
          </button>
        </div>
      )}

      {/* QUESTIONNAIRE */}
      {screen==="questionnaire" && (
        <div className="content">
          <div className="prog-sections">
            {allSections.map((s,i) => {
              const done = s.items.filter(q => answers[q.id]!==undefined).length;
              return (
                <div className="prog-sec" key={i}>
                  <div className="prog-outer"><div className="prog-inner" style={{width:`${Math.round((done/s.items.length)*100)}%`}}/></div>
                  <div className={`prog-lbl ${i===secIdx?"active":""}`}>{s.icon} {s.section.split("—")[0].trim()}</div>
                </div>
              );
            })}
          </div>

          <div className="sec-head">
            <div className="sec-icon">{sec.icon}</div>
            <div>
              <div className="sec-title">{sec.section}</div>
              <div className="sec-sub">Section {secIdx+1}/{total} — {sec.items.filter(q=>answers[q.id]!==undefined).length}/{sec.items.length} répondues</div>
              {sec.dim==="ohada" && <div className="ohada-badge">⚖️ Module Conformité OHADA</div>}
              {sec.dim==="sectoriel" && <div className="ohada-badge" style={{background:"rgba(245,158,11,0.1)",color:"#b45309",borderColor:"rgba(245,158,11,0.2)"}}>🎯 Questions spécifiques à votre secteur</div>}
            </div>
          </div>

          {sec.items.map((q,qi) => (
            <div key={q.id} className={`qcard ${answers[q.id]!==undefined?"answered":""}`}>
              <div className="qnum">Question {secIdx*4+qi+1} / {total*4}</div>
              <div className="qtext">{q.text}</div>
              <div className="opts">
                {q.options.map((o,oi) => (
                  <button key={oi} className={`opt ${answers[q.id]===oi?"sel":""}`} onClick={() => answer(q.id,oi)}>{o}</button>
                ))}
              </div>
            </div>
          ))}

          <div className="navrow">
            <button className="btn-prev" onClick={() => setSecIdx(s=>s-1)} disabled={secIdx===0}>← Précédent</button>
            <span className="prog-txt">{Math.round((sec.items.filter(q=>answers[q.id]!==undefined).length/sec.items.length)*100)}% complété</span>
            <button className="btn-next" onClick={next} disabled={!canNext}>
              {secIdx===total-1 ? "✨ Analyser mes risques" : "Suivant →"}
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {screen==="loading" && (
        <div className="content">
          <div className="loading-wrap">
            <div className="ring"/>
            <h2 style={{marginBottom:8,color:"#0f2557"}}>Analyse IA en cours...</h2>
            <p style={{fontSize:14,color:"#64748b",marginBottom:28}}>Notre IA analyse votre profil de risque selon les standards OHADA</p>
            {["Calcul des scores sectoriels...","Vérification conformité OHADA...","Analyse des risques critiques...","Benchmarking avec PME similaires...","Génération du plan d'action FCFA...","Finalisation du rapport..."].map((s,i) => (
              <div key={i} className={`lstep ${i===loadStep?"active":i<loadStep?"done":""}`}>
                <div className="sdot"/>{i<loadStep?"✓ ":""}{s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {screen==="results" && scores && (
        <div className="content">
          <div className="score-hero">
            <Gauge score={scores.global}/>
            <div className="score-info">
              <div className="rl-badge" style={{background:getRiskLevel(scores.global).bg,color:getRiskLevel(scores.global).color}}>
                ● {getRiskLevel(scores.global).label}
              </div>
              <h2>Score de risque global : {scores.global}/100</h2>
              <p>{aiData ? aiData.resume_executif : "Votre diagnostic est prêt. Consultez les détails ci-dessous."}</p>
            </div>
          </div>

          <div className="dim-grid">
            {[["⚖️ OHADA & Gouvernance",scores.ohada],["👥 RH & Management",scores.rh],["💰 Finance & Fraude",scores.finance],["⚠️ HSE & Opérations",scores.hse],["🎯 Risques Sectoriels",scores.sectoriel]].map(([l,s],i) => (
              <div className="dcard" key={i}>
                <div className="dhead"><div className="dname">{l}</div><div className="dscore" style={{color:getRiskColor(s)}}>{s}</div></div>
                <div className="dbar-bg"><div className="dbar" style={{width:`${s}%`,background:getRiskColor(s)}}/></div>
              </div>
            ))}
          </div>

          {error && <div className="err-box">⚠️ Analyse IA non disponible ({error}). Les scores restent valides.</div>}

          {scores && <ScoreProjection data={aiData?.score_projection || {score_actuel:scores.global, score_3mois:Math.max(scores.global-15,10), score_6mois:Math.max(scores.global-28,8), economies_estimees:null}}/>}

          {aiData && (
            <div className="ai-card">
              <div className="ai-head">
                <div className="ai-badge">✨ Analyse IA — Contexte africain</div>
                <div className="syne" style={{fontSize:16,fontWeight:700,color:"#0f2557"}}>Rapport de Risk Management</div>
              </div>

              {aiData.alerte_ohada && (
                <div className="ohada-alert">
                  <span style={{fontSize:18,flexShrink:0}}>⚖️</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:3}}>ALERTE CONFORMITÉ OHADA</div>
                    <div style={{fontSize:13,color:"#1e40af",lineHeight:1.5}}>{aiData.alerte_ohada}</div>
                  </div>
                </div>
              )}

              <div className="resume">{aiData.resume_executif}</div>

              {aiData.conformite_ohada && (
                <div className="ohada-block">
                  <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>⚖️ Conformité OHADA</div>
                  <div className="ohada-status" style={{background:aiData.conformite_ohada.statut==="CONFORME"?"#dcfce7":aiData.conformite_ohada.statut==="PARTIELLEMENT CONFORME"?"#fef3c7":"#fee2e2",color:aiData.conformite_ohada.statut==="CONFORME"?"#166534":aiData.conformite_ohada.statut==="PARTIELLEMENT CONFORME"?"#92400e":"#991b1b"}}>
                    {aiData.conformite_ohada.statut==="CONFORME"?"✅":"⚠️"} {aiData.conformite_ohada.statut}
                  </div>
                  {aiData.conformite_ohada.points_attention?.map((p,i) => (
                    <div key={i} style={{fontSize:13,color:"#475569",padding:"5px 0",borderBottom:"1px solid rgba(15,37,87,0.06)",display:"flex",gap:7,alignItems:"flex-start"}}>
                      <span style={{color:"#d97706",flexShrink:0}}>→</span>{p}
                    </div>
                  ))}
                </div>
              )}

              <div className="slbl">⚡ Points critiques identifiés</div>
              {aiData.points_critiques?.map((p,i) => (
                <div className="crit" key={i}>
                  <div className="crit-title">
                    ⚠ {p.titre}
                    <span className={`urgence-tag ${p.urgence==="IMMÉDIAT"?"u-immediat":p.urgence==="COURT TERME"?"u-court":"u-moyen"}`}>{p.urgence}</span>
                  </div>
                  <div className="crit-desc">{p.description}</div>
                  <div className="crit-impact">💸 Impact estimé : {p.impact_financier}</div>
                </div>
              ))}

              <div className="slbl" style={{marginTop:16}}>✅ Points positifs</div>
              {aiData.points_positifs?.map((p,i) => (
                <div className="pos" key={i}>
                  <span style={{fontSize:16,flexShrink:0}}>✓</span>
                  <div><div className="pos-title">{p.titre}</div><div className="pos-desc">{p.description}</div></div>
                </div>
              ))}

              {aiData.message_dirigeant && (
                <div className="msg-dir" style={{marginTop:16}}>
                  <span style={{fontSize:24,flexShrink:0}}>💬</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#00c9b1",marginBottom:6,letterSpacing:".04em"}}>MESSAGE AU DIRIGEANT</div>
                    <div className="msg-dir-text">{aiData.message_dirigeant}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="btn-row">
            <button className="btn-accent" onClick={() => setScreen("actions")}>📋 Voir le plan d'action complet →</button>
            <button className="btn-outline" onClick={restart}>🔄 Nouveau diagnostic</button>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      {screen==="actions" && (
        <div className="content">
          <div style={{marginBottom:20}}>
            <h2 style={{fontSize:21,fontWeight:800,color:"#0f2557",marginBottom:5}}>Plan d'action personnalisé</h2>
            <p style={{fontSize:14,color:"#64748b"}}>Généré par IA · Adapté au contexte ivoirien et OHADA{scores && <> · Score actuel : <strong style={{color:getRiskColor(scores.global)}}>{scores.global}/100</strong></>}</p>
          </div>

          {aiData?.plan_action ? (
            <>
              <div className="ai-hint">
                <span style={{fontSize:18,flexShrink:0}}>✨</span>
                <div>L'IA a identifié <strong>{aiData.plan_action.length} actions prioritaires</strong> avec coûts estimés en FCFA. {aiData.score_projection && `En suivant ce plan, votre score peut passer de ${aiData.score_projection.score_actuel} à ${aiData.score_projection.score_6mois}/100 en 6 mois.`}</div>
              </div>
              {aiData.plan_action.map((a,i) => (
                <div className="acard" key={i}>
                  <div className="anum">{i+1}</div>
                  <div>
                    <div className={`aprio ${a.priorite==="URGENT"?"pu":a.priorite==="IMPORTANT"?"pi":"ps"}`}>
                      {a.priorite==="URGENT"?"🔴":a.priorite==="IMPORTANT"?"🟡":"🔵"} {a.priorite}
                    </div>
                    <div className="atitle">{a.titre}</div>
                    <div className="adesc">{a.description}</div>
                    <div className="ameta">
                      <div className="am">⏱ <strong>{a.delai}</strong></div>
                      <div className="am">💰 <strong>{a.cout_estime}</strong></div>
                      <div className="am">👤 {a.responsable}</div>
                      <div className="am">📊 {a.indicateur}</div>
                    </div>
                  </div>
                </div>
              ))}

              {aiData.score_projection && (
                <div className="proj-box">
                  <span style={{fontSize:28,flexShrink:0}}>🎯</span>
                  <div>
                    <div className="proj-title">Projection sur 6 mois</div>
                    <div className="proj-text">
                      Score actuel <strong style={{color:"#ef4444"}}>{aiData.score_projection.score_actuel}/100</strong> →
                      Dans 3 mois <strong style={{color:"#f59e0b"}}>{aiData.score_projection.score_3mois}/100</strong> →
                      Dans 6 mois <strong style={{color:"#00c9b1"}}>{aiData.score_projection.score_6mois}/100</strong>
                      {aiData.score_projection.economies_estimees && <><br/>💰 Pertes évitées estimées : <strong style={{color:"#00c9b1"}}>{aiData.score_projection.economies_estimees}</strong></>}
                    </div>
                  </div>
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
    </>
  );
}
