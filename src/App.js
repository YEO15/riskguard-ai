import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const SECTEURS = ["Commerce / Distribution","Services / Conseil","Industrie / BTP","Agriculture / Agro-industrie","Santé / Éducation","Transport / Logistique"];

const QUESTIONS_BASE = [
  { section:"Profil Entreprise", icon:"🏢", dim:"profil", items:[
    {id:"p1",text:"Taille de votre entreprise ?",options:["1-10 employés","11-50 employés","51-200 employés","200+ employés"]},
    {id:"p2",text:"Secteur d'activité ?",options:SECTEURS},
    {id:"p3",text:"Ancienneté de l'entreprise ?",options:["Moins de 2 ans","2 à 5 ans","5 à 10 ans","Plus de 10 ans"]},
    {id:"p4",text:"Chiffre d'affaires annuel estimé ?",options:["Moins de 10M FCFA","10M à 100M FCFA","100M à 500M FCFA","Plus de 500M FCFA"]},
  ]},
  { section:"Gouvernance & OHADA", icon:"⚖️", dim:"ohada", items:[
    {id:"o1",text:"Votre entreprise est-elle régulièrement immatriculée au RCCM ?",options:["Non, pas encore","En cours de régularisation","Oui mais pas à jour","Oui, parfaitement à jour"]},
    {id:"o2",text:"Tenez-vous une comptabilité conforme au Système Comptable OHADA (SYSCOHADA) ?",options:["Aucune comptabilité formelle","Comptabilité informelle","SYSCOHADA partiellement","SYSCOHADA complet + bilan annuel"]},
    {id:"o3",text:"Avez-vous des statuts d'entreprise déposés et à jour ?",options:["Aucun statut","Statuts non déposés","Déposés mais non mis à jour","Déposés et à jour"]},
    {id:"o4",text:"En cas de litige commercial, connaissez-vous les procédures OHADA applicables ?",options:["Aucune connaissance","Connaissance très limitée","Connaissance partielle","Bonne maîtrise des procédures"]},
  ]},
  { section:"Risques RH & Management", icon:"👥", dim:"rh", items:[
    {id:"r1",text:"Comment qualifieriez-vous le climat social ces 6 derniers mois ?",options:["Très dégradé — conflits fréquents","Tendu — frictions régulières","Stable — irritants mineurs","Excellent — cohésion forte"]},
    {id:"r2",text:"Quel est votre taux de turnover annuel ?",options:["Plus de 30%","15 à 30%","5 à 15%","Moins de 5%"]},
    {id:"r3",text:"Des comportements managériaux toxiques ont-ils été signalés ?",options:["Oui, cas graves non résolus","Oui, quelques incidents","Rarement","Non, jamais"]},
    {id:"r4",text:"Avez-vous des contrats de travail écrits pour tous vos employés ?",options:["Non, aucun contrat écrit","Quelques contrats seulement","La plupart ont des contrats","Tous ont des contrats conformes OHADA"]},
  ]},
  { section:"Risques Financiers & Fraude", icon:"💰", dim:"finance", items:[
    {id:"f1",text:"Disposez-vous de procédures de contrôle interne formalisées ?",options:["Aucune procédure","Règles informelles","Procédures partielles","Procédures complètes et auditées"]},
    {id:"f2",text:"Des anomalies financières ou fraudes ont-elles été détectées ?",options:["Oui, cas graves non résolus","Oui, cas mineurs","Suspicions sans preuves","Aucun incident"]},
    {id:"f3",text:"Comment gérez-vous l'accès à la caisse et aux comptes bancaires ?",options:["Accès libre pour tous","Une seule personne sans contrôle","Accès partagé sans traçabilité","Double signature + traçabilité"]},
    {id:"f4",text:"Faites-vous appel à un expert-comptable ou commissaire aux comptes ?",options:["Jamais","Occasionnellement","Annuellement","Trimestriellement ou plus"]},
  ]},
  { section:"Risques HSE & Opérationnels", icon:"⚠️", dim:"hse", items:[
    {id:"h1",text:"Combien d'accidents de travail l'an dernier ?",options:["5 ou plus","2 à 4","1","Aucun"]},
    {id:"h2",text:"Vos employés ont-ils des équipements de protection (EPI) ?",options:["Non, aucun EPI","EPI disponibles non portés","EPI parfois utilisés","EPI systématiques et vérifiés"]},
    {id:"h3",text:"Avez-vous souscrit une assurance responsabilité civile professionnelle ?",options:["Non, aucune assurance","Assurance partielle","Assurance de base","Couverture complète"]},
    {id:"h4",text:"Avez-vous un plan de continuité en cas de crise ?",options:["Aucun plan","Plan informel non testé","Plan partiel","Plan complet testé annuellement"]},
  ]},
];

const QUESTIONS_SECTEUR = {
  0:{section:"Risques Spécifiques — Commerce",icon:"🛒",dim:"sectoriel",items:[
    {id:"s1",text:"Gérez-vous vos stocks avec un système d'inventaire formel ?",options:["Aucun inventaire","Inventaire annuel","Inventaire trimestriel","Inventaire permanent informatisé"]},
    {id:"s2",text:"Avez-vous des impayés clients supérieurs à 30 jours > 20% de votre CA ?",options:["Oui, plus de 40%","20 à 40%","Moins de 20%","Moins de 5% — excellente gestion"]},
    {id:"s3",text:"Votre chaîne d'approvisionnement dépend-elle d'un seul fournisseur ?",options:["Oui, un seul","2 à 3 fournisseurs","4 à 6 fournisseurs","7+ fournisseurs diversifiés"]},
    {id:"s4",text:"Avez-vous une politique de retours et garantie formalisée ?",options:["Aucune","Informelle","Écrite non appliquée","Formelle et appliquée"]},
  ]},
  1:{section:"Risques Spécifiques — Services",icon:"💼",dim:"sectoriel",items:[
    {id:"s1",text:"Vos contrats clients sont-ils écrits avec clauses de responsabilité ?",options:["Aucun contrat écrit","Sans clauses protection","Partiellement protecteurs","Complets et validés juridiquement"]},
    {id:"s2",text:"Avez-vous une politique de protection des données clients ?",options:["Aucune","Mesures basiques","Politique partielle","Politique conforme RGPD/données"]},
    {id:"s3",text:"La perte d'un client représenterait-elle > 30% de votre CA ?",options:["Oui, plus de 50%","30 à 50%","15 à 30%","Moins de 15% — diversifié"]},
    {id:"s4",text:"Avez-vous une assurance responsabilité professionnelle ?",options:["Non","En cours","Couverture minimale","Couverture complète"]},
  ]},
  2:{section:"Risques Spécifiques — Industrie/BTP",icon:"🏗️",dim:"sectoriel",items:[
    {id:"s1",text:"Vos équipements font-ils l'objet d'une maintenance préventive ?",options:["Aucune maintenance","Corrective uniquement","Annuelle","Préventive régulière"]},
    {id:"s2",text:"Avez-vous les autorisations et permis requis ?",options:["Aucun permis","Permis partiels","La plupart","Tous à jour"]},
    {id:"s3",text:"Vos sous-traitants sont-ils couverts par une assurance chantier ?",options:["Non vérifié","Rarement","Parfois","Systématiquement"]},
    {id:"s4",text:"Avez-vous subi des arrêts imprévus > 3 jours l'an dernier ?",options:["3 arrêts ou plus","2 arrêts","1 arrêt","Aucun"]},
  ]},
  3:{section:"Risques Spécifiques — Agriculture",icon:"🌾",dim:"sectoriel",items:[
    {id:"s1",text:"Avez-vous une assurance récolte ?",options:["Non","En cours","Partielle","Complète"]},
    {id:"s2",text:"Votre production dépend-elle d'une seule culture ?",options:["Oui","2 produits","3 à 4 produits","Diversification complète"]},
    {id:"s3",text:"Avez-vous accès à un système d'irrigation indépendant ?",options:["Non","Partiel","Majoritaire","Complet et autonome"]},
    {id:"s4",text:"Vos accords de vente sont-ils contractualisés avant la récolte ?",options:["Jamais","Rarement","Souvent","Toujours — contrats fermes"]},
  ]},
  4:{section:"Risques Spécifiques — Santé/Éducation",icon:"🏥",dim:"sectoriel",items:[
    {id:"s1",text:"Vos locaux sont-ils aux normes sanitaires requises ?",options:["Non conformes","Partiellement","Majorité conforme","Totalement certifiés"]},
    {id:"s2",text:"Votre personnel a-t-il les diplômes et agréments requis ?",options:["Non vérifiés","Partiellement","Majorité vérifiés","Tous agréés et à jour"]},
    {id:"s3",text:"Avez-vous une politique de confidentialité des données ?",options:["Aucune","Informelle","Écrite","Formelle et appliquée"]},
    {id:"s4",text:"Êtes-vous à jour dans le paiement des cotisations sociales ?",options:["Non, retards importants","Retards mineurs","Généralement à jour","Toujours à jour"]},
  ]},
  5:{section:"Risques Spécifiques — Transport",icon:"🚛",dim:"sectoriel",items:[
    {id:"s1",text:"Vos véhicules sont-ils assurés et en règle ?",options:["Non","Partiellement","Majorité","Tous assurés et en règle"]},
    {id:"s2",text:"Vos chauffeurs ont-ils des permis valides et une formation sécurité ?",options:["Non vérifiés","Permis vérifiés sans formation","Formation basique","Formation complète et régulière"]},
    {id:"s3",text:"Avez-vous eu des accidents l'an dernier ?",options:["3 ou plus","2","1","Aucun"]},
    {id:"s4",text:"Avez-vous une assurance marchandises transportées ?",options:["Non","En cours","Partielle","Totale"]},
  ]},
};

const W = {
  ohada:{o1:[25,18,10,2],o2:[28,20,12,2],o3:[20,14,8,1],o4:[15,10,5,1]},
  rh:{r1:[25,15,8,2],r2:[25,18,10,3],r3:[30,18,8,0],r4:[20,14,8,2]},
  finance:{f1:[25,18,10,3],f2:[30,18,10,0],f3:[28,20,10,2],f4:[20,15,8,2]},
  hse:{h1:[30,20,10,0],h2:[25,18,10,2],h3:[20,14,8,2],h4:[20,15,8,2]},
  sectoriel:{s1:[20,15,8,2],s2:[25,18,10,2],s3:[22,15,8,2],s4:[18,12,6,1]},
};

function computeScores(answers){
  const sum=(dim)=>Object.entries(W[dim]||{}).reduce((a,[k,w])=>a+(answers[k]!==undefined?(w[answers[k]]||0):0),0);
  const ohada=Math.min(100,Math.round(sum("ohada")));
  const rh=Math.min(100,Math.round(sum("rh")));
  const finance=Math.min(100,Math.round(sum("finance")));
  const hse=Math.min(100,Math.round(sum("hse")));
  const sectoriel=Math.min(100,Math.round(sum("sectoriel")));
  return{ohada,rh,finance,hse,sectoriel,global:Math.round(ohada*.25+rh*.20+finance*.25+hse*.15+sectoriel*.15)};
}

function buildPrompt(answers,scores,sectorLabel){
  const size=["1-10","11-50","51-200","200+"][answers.p1]||"?";
  const age=["<2ans","2-5ans","5-10ans","10ans+"][answers.p3]||"?";
  const ca=["<10M FCFA","10-100M FCFA","100-500M FCFA","500M+ FCFA"][answers.p4]||"?";
  const allQ=[...QUESTIONS_BASE];
  if(answers.p2!==undefined&&QUESTIONS_SECTEUR[answers.p2])allQ.push(QUESTIONS_SECTEUR[answers.p2]);
  const qt=allQ.flatMap(s=>s.items).map(q=>`• ${q.text}\n  → ${q.options[answers[q.id]]||"Non répondu"}`).join("\n");
  return`Tu es expert senior en risk management, droit OHADA et gouvernance d'entreprise en Afrique subsaharienne.

PROFIL : Secteur=${sectorLabel} | Taille=${size} | Ancienneté=${age} | CA=${ca}
SCORES : OHADA=${scores.ohada} | RH=${scores.rh} | Finance=${scores.finance} | HSE=${scores.hse} | Sectoriel=${scores.sectoriel} | Global=${scores.global}

RÉPONSES :
${qt}

Génère UNIQUEMENT ce JSON :
{
  "resume_executif":"3 phrases percutantes avec chiffres",
  "niveau_risque":"CRITIQUE|ÉLEVÉ|MODÉRÉ|FAIBLE",
  "alerte_ohada":"1 phrase risque juridique OHADA spécifique",
  "points_critiques":[
    {"titre":"...","description":"...","impact_financier":"... FCFA","urgence":"IMMÉDIAT|COURT TERME|MOYEN TERME"},
    {"titre":"...","description":"...","impact_financier":"...","urgence":"..."},
    {"titre":"...","description":"...","impact_financier":"...","urgence":"..."}
  ],
  "points_positifs":[{"titre":"...","description":"..."},{"titre":"...","description":"..."}],
  "plan_action":[
    {"priorite":"URGENT","delai":"0-30 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."},
    {"priorite":"URGENT","delai":"0-30 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."},
    {"priorite":"IMPORTANT","delai":"30-90 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."},
    {"priorite":"IMPORTANT","delai":"30-90 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."},
    {"priorite":"STRATÉGIQUE","delai":"90-180 jours","titre":"...","description":"...","cout_estime":"... FCFA","indicateur":"...","responsable":"..."}
  ],
  "conformite_ohada":{"statut":"CONFORME|PARTIELLEMENT CONFORME|NON CONFORME","points_attention":["...","...","..."]},
  "score_projection":{"score_actuel":${scores.global},"score_3mois":X,"score_6mois":Y,"economies_estimees":"... FCFA/an"},
  "message_dirigeant":"2 phrases directes et motivantes"
}
Adapte tout au contexte ivoirien : cite CEPICI, CGECI, DGI, CNPS, Tribunal Commerce Abidjan. Chiffres en FCFA.`;
}

// ─── PDF ─────────────────────────────────────────────────────────────────────
async function generatePDF(aiData,scores,sectorLabel){
  if(!aiData){return;}
  // Charger jsPDF depuis CDN si pas encore chargé
  if(!window.jspdf){
    await new Promise((resolve,reject)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload=resolve;s.onerror=reject;
      document.head.appendChild(s);
    });
  }
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  const W2=doc.internal.pageSize.getWidth();
  let y=0;
  const addPage=()=>{doc.addPage();y=20;};
  const checkY=(h=40)=>{if(y+h>272)addPage();};

  // COVER
  doc.setFillColor(5,10,30);doc.rect(0,0,W2,297,"F");
  doc.setFillColor(212,175,55);doc.rect(0,0,W2,3,"F");
  doc.setFillColor(212,175,55);doc.rect(0,294,W2,3,"F");
  doc.setTextColor(212,175,55);doc.setFontSize(28);doc.setFont("helvetica","bold");
  doc.text("RiskGuard AI",W2/2,80,{align:"center"});
  doc.setTextColor(255,255,255);doc.setFontSize(13);doc.setFont("helvetica","normal");
  doc.text("Rapport de Diagnostic Risk Management",W2/2,95,{align:"center"});
  doc.setDrawColor(212,175,55);doc.setLineWidth(0.5);doc.line(30,105,W2-30,105);
  doc.setFontSize(11);doc.setTextColor(180,180,180);
  doc.text(`Secteur : ${sectorLabel}`,W2/2,118,{align:"center"});
  doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`,W2/2,128,{align:"center"});
  const lvl=getRiskLevel(scores.global);
  doc.setFillColor(lvl.color==="CRITIQUE"?[220,38,38]:lvl.color==="ÉLEVÉ"?[245,158,11]:lvl.color==="MODÉRÉ"?[99,102,241]:[16,185,129]);
  const lc=scores.global>=70?[220,38,38]:scores.global>=55?[245,158,11]:scores.global>=35?[99,102,241]:[16,185,129];
  doc.setFillColor(...lc);doc.roundedRect(W2/2-30,148,60,22,4,4,"F");
  doc.setTextColor(255,255,255);doc.setFontSize(10);doc.setFont("helvetica","bold");
  doc.text(`${lvl.label} - ${scores.global}/100`,W2/2,162,{align:"center"});
  doc.setTextColor(100,100,100);doc.setFontSize(9);doc.setFont("helvetica","normal");
  doc.text("RIMRAE - RARM Challenge 2026 - riskguard-gray.vercel.app",W2/2,280,{align:"center"});

  // PAGE 2 — SCORES
  doc.addPage();y=20;
  doc.setFillColor(5,10,30);doc.rect(0,0,W2,18,"F");
  doc.setFillColor(212,175,55);doc.rect(0,0,4,18,"F");
  doc.setTextColor(255,255,255);doc.setFontSize(12);doc.setFont("helvetica","bold");
  doc.text("Scores par dimension",10,12);
  y=30;
  const dims=[["OHADA & Gouvernance",scores.ohada],["RH & Management",scores.rh],["Finance & Fraude",scores.finance],["HSE & Operations",scores.hse],["Risques Sectoriels",scores.sectoriel]];
  dims.forEach(([label,score])=>{
    const c=score>=70?[220,38,38]:score>=40?[245,158,11]:[16,185,129];
    doc.setFontSize(10);doc.setFont("helvetica","normal");doc.setTextColor(30,30,30);
    doc.text(label,14,y+5);
    doc.setFillColor(230,230,230);doc.roundedRect(105,y,75,8,2,2,"F");
    doc.setFillColor(...c);doc.roundedRect(105,y,Math.max(3,score*0.75),8,2,2,"F");
    doc.setTextColor(...c);doc.setFont("helvetica","bold");doc.setFontSize(10);
    doc.text(`${score}/100`,186,y+6);y+=18;
  });

  // Score global box
  y+=4;
  doc.setFillColor(5,10,30);doc.roundedRect(14,y,W2-28,22,4,4,"F");
  doc.setFillColor(212,175,55);doc.rect(14,y,4,22,"F");
  doc.setTextColor(212,175,55);doc.setFontSize(13);doc.setFont("helvetica","bold");
  doc.text(`Score global : ${scores.global}/100 - ${lvl.label}`,24,y+14);y+=32;

  // Résumé
  if(aiData.resume_executif){
    doc.setFillColor(245,245,255);doc.roundedRect(14,y,W2-28,28,3,3,"F");
    doc.setFillColor(5,10,30);doc.rect(14,y,4,28,"F");
    doc.setTextColor(30,30,30);doc.setFontSize(10);doc.setFont("helvetica","italic");
    const ls=doc.splitTextToSize(aiData.resume_executif,W2-42);
    doc.text(ls.slice(0,4),22,y+8);y+=36;
  }

  // OHADA Alert
  if(aiData.alerte_ohada){
    doc.setFillColor(219,234,254);doc.roundedRect(14,y,W2-28,20,3,3,"F");
    doc.setFillColor(29,78,216);doc.rect(14,y,4,20,"F");
    doc.setTextColor(29,78,216);doc.setFontSize(9);doc.setFont("helvetica","bold");
    doc.text("ALERTE CONFORMITE OHADA",20,y+7);
    doc.setFont("helvetica","normal");
    const al=doc.splitTextToSize(aiData.alerte_ohada,W2-44);
    doc.text(al.slice(0,1),20,y+15);y+=28;
  }

  // Projection
  if(aiData.score_projection){
    const sp=aiData.score_projection;
    checkY(45);
    doc.setFontSize(11);doc.setFont("helvetica","bold");doc.setTextColor(5,10,30);
    doc.text("Projection sur 6 mois",14,y);y+=8;
    const bars=[["Aujourd'hui",sp.score_actuel,[220,38,38]],["Dans 3 mois",sp.score_3mois,[245,158,11]],["Dans 6 mois",sp.score_6mois,[16,185,129]]];
    bars.forEach(([label,val,c])=>{
      doc.setFontSize(9);doc.setFont("helvetica","normal");doc.setTextColor(80,80,80);
      doc.text(label,14,y+5);
      doc.setFillColor(220,220,220);doc.roundedRect(60,y,100,7,2,2,"F");
      doc.setFillColor(...c);doc.roundedRect(60,y,Math.max(3,val),7,2,2,"F");
      doc.setTextColor(...c);doc.setFont("helvetica","bold");doc.setFontSize(9);
      doc.text(`${val}/100`,166,y+6);y+=14;
    });
    if(sp.economies_estimees){
      doc.setFillColor(220,252,231);doc.roundedRect(14,y,W2-28,14,3,3,"F");
      doc.setTextColor(21,128,61);doc.setFontSize(9);doc.setFont("helvetica","bold");
      doc.text(`Pertes evitees estimees : ${sp.economies_estimees}`,20,y+9);y+=22;
    }
  }

  // PAGE 3 — CRITIQUES
  doc.addPage();y=20;
  doc.setFillColor(5,10,30);doc.rect(0,0,W2,18,"F");
  doc.setFillColor(220,38,38);doc.rect(0,0,4,18,"F");
  doc.setTextColor(255,255,255);doc.setFontSize(12);doc.setFont("helvetica","bold");
  doc.text("Points critiques identifies",10,12);y=28;

  aiData.points_critiques?.forEach((p,i)=>{
    checkY(42);
    doc.setFillColor(254,242,242);doc.roundedRect(14,y,W2-28,38,3,3,"F");
    doc.setFillColor(220,38,38);doc.rect(14,y,5,38,"F");
    doc.setFontSize(10);doc.setFont("helvetica","bold");doc.setTextColor(185,28,28);
    const urg="["+p.urgence+"]";
    doc.text(`${i+1}. ${p.titre} [${p.urgence}]`,22,y+9);
    doc.setFont("helvetica","normal");doc.setTextColor(60,60,60);doc.setFontSize(9);
    const dl=doc.splitTextToSize(p.description,W2-48);
    doc.text(dl.slice(0,2),22,y+17);
    doc.setFont("helvetica","bold");doc.setTextColor(185,28,28);doc.setFontSize(9);
    doc.text(`Impact : ${p.impact_financier}`,22,y+33);y+=46;
  });

  // Points positifs
  checkY(30);y+=4;
  doc.setFillColor(5,10,30);doc.rect(0,y-6,W2,16,"F");
  doc.setFillColor(16,185,129);doc.rect(0,y-6,4,16,"F");
  doc.setTextColor(255,255,255);doc.setFontSize(11);doc.setFont("helvetica","bold");
  doc.text("Points positifs",10,y+4);y+=18;
  aiData.points_positifs?.forEach((p)=>{
    checkY(22);
    doc.setFillColor(240,253,244);doc.roundedRect(14,y,W2-28,18,3,3,"F");
    doc.setFillColor(16,185,129);doc.rect(14,y,4,18,"F");
    doc.setTextColor(21,128,61);doc.setFontSize(10);doc.setFont("helvetica","bold");
    doc.text(`+ ${p.titre}`,22,y+7);
    doc.setFont("helvetica","normal");doc.setTextColor(60,60,60);doc.setFontSize(9);
    doc.text(doc.splitTextToSize(p.description,W2-46).slice(0,1)[0],22,y+14);y+=26;
  });

  // PAGE 4 — PLAN D'ACTION
  doc.addPage();y=20;
  doc.setFillColor(5,10,30);doc.rect(0,0,W2,18,"F");
  doc.setFillColor(212,175,55);doc.rect(0,0,4,18,"F");
  doc.setTextColor(255,255,255);doc.setFontSize(12);doc.setFont("helvetica","bold");
  doc.text("Plan d'action personnalise",10,12);y=28;

  aiData.plan_action?.forEach((a,i)=>{
    checkY(48);
    const bg=a.priorite==="URGENT"?[254,226,226]:a.priorite==="IMPORTANT"?[254,243,199]:[224,231,255];
    const tc=a.priorite==="URGENT"?[185,28,28]:a.priorite==="IMPORTANT"?[180,83,9]:[67,56,202];
    const ac=a.priorite==="URGENT"?[220,38,38]:a.priorite==="IMPORTANT"?[245,158,11]:[99,102,241];
    doc.setFillColor(...bg);doc.roundedRect(14,y,W2-28,42,3,3,"F");
    doc.setFillColor(...ac);doc.rect(14,y,5,42,"F");
    doc.setFontSize(9);doc.setFont("helvetica","bold");doc.setTextColor(...tc);
    doc.text(`${a.priorite} - ${a.delai}`,22,y+8);
    doc.setFontSize(10);doc.setTextColor(10,10,40);
    doc.text(`${i+1}. ${a.titre}`,22,y+16);
    doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(60,60,60);
    const dl=doc.splitTextToSize(a.description,W2-48);
    doc.text(dl.slice(0,2),22,y+24);
    doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(...tc);
    doc.text(`Cout : ${a.cout_estime} | Responsable : ${a.responsable}`,22,y+38);y+=50;
  });

  // Message dirigeant
  if(aiData.message_dirigeant){
    checkY(30);
    doc.setFillColor(5,10,30);doc.roundedRect(14,y,W2-28,24,4,4,"F");
    doc.setFillColor(212,175,55);doc.rect(14,y,4,24,"F");
    doc.setTextColor(212,175,55);doc.setFontSize(9);doc.setFont("helvetica","bold");
    doc.text("MESSAGE AU DIRIGEANT",22,y+8);
    doc.setFont("helvetica","italic");doc.setTextColor(200,200,200);
    const ml=doc.splitTextToSize(aiData.message_dirigeant,W2-46);
    doc.text(ml.slice(0,2),22,y+16);
  }

  // Footer toutes pages
  const total=doc.internal.getNumberOfPages();
  for(let i=1;i<=total;i++){
    doc.setPage(i);
    const ph=doc.internal.pageSize.getHeight();
    doc.setFillColor(5,10,30);doc.rect(0,ph-10,W2,10,"F");
    doc.setFillColor(212,175,55);doc.rect(0,ph-10,W2,1,"F");
    doc.setTextColor(150,150,150);doc.setFontSize(7);doc.setFont("helvetica","normal");
    doc.text("RiskGuard AI - Diagnostic confidentiel - RIMRAE RARM 2026",14,ph-3);
    doc.text(`${i}/${total}`,W2-14,ph-3,{align:"right"});
  }
  doc.save(`RiskGuard-${sectorLabel.replace(/\//g,"-")}-${new Date().toISOString().split("T")[0]}.pdf`);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getRiskColor(s){return s>=70?"#ef4444":s>=45?"#f59e0b":"#10b981";}
function getRiskLevel(s){
  if(s>=70)return{label:"CRITIQUE",bg:"#fef2f2",color:"#dc2626",dot:"#ef4444"};
  if(s>=55)return{label:"ÉLEVÉ",bg:"#fffbeb",color:"#d97706",dot:"#f59e0b"};
  if(s>=35)return{label:"MODÉRÉ",bg:"#eef2ff",color:"#4338ca",dot:"#6366f1"};
  return{label:"FAIBLE",bg:"#f0fdf4",color:"#16a34a",dot:"#22c55e"};
}

function Gauge({score}){
  const c=getRiskColor(score),r=62,cx=85,cy=78;
  const a=(score/100)*180,rad=(a-180)*Math.PI/180;
  const ex=cx+r*Math.cos(rad),ey=cy+r*Math.sin(rad);
  return(
    <svg width="170" height="88" viewBox="0 0 170 88">
      <defs>
        <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3"/>
        </linearGradient>
      </defs>
      <path d={`M ${cx-r},${cy} A ${r},${r} 0 0,1 ${cx+r},${cy}`} fill="none" stroke="url(#gaugeTrack)" strokeWidth="11" strokeLinecap="round"/>
      <path d={`M ${cx-r},${cy} A ${r},${r} 0 ${a>180?1:0},1 ${ex},${ey}`} fill="none" stroke={c} strokeWidth="11" strokeLinecap="round" filter="url(#glow)"/>
      <defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <circle cx={ex} cy={ey} r="5" fill={c}/>
      <text x={cx} y={cy-2} textAnchor="middle" fontFamily="'Syne',sans-serif" fontSize="30" fontWeight="800" fill={c}>{score}</text>
      <text x={cx} y={cy+15} textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="10" fill="rgba(255,255,255,0.4)">/ 100</text>
    </svg>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#05060f;color:#e2e8f0;min-height:100vh}
h1,h2,h3,h4,.syne{font-family:'Syne',sans-serif}

/* NAV */
.nav{background:rgba(5,6,15,0.95);backdrop-filter:blur(20px);padding:0 32px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(212,175,55,0.15)}
.nav-logo{display:flex;align-items:center;gap:10px;font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:white;text-decoration:none}
.logo-box{width:34px;height:34px;background:linear-gradient(135deg,#d4af37,#f0d060);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 15px rgba(212,175,55,0.3)}
.logo-ai{color:#d4af37}
.nav-tag{font-size:10px;color:rgba(255,255,255,0.25);font-weight:400;margin-left:6px;border-left:1px solid rgba(255,255,255,0.1);padding-left:10px;letter-spacing:.04em}
.nav-tabs{display:flex;gap:2px}
.ntab{padding:6px 14px;border-radius:20px;font-size:12px;color:rgba(255,255,255,0.4);border:none;background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;letter-spacing:.02em}
.ntab:hover{color:rgba(255,255,255,0.7)}
.ntab.active{background:rgba(212,175,55,0.15);color:#d4af37;font-weight:600;border:1px solid rgba(212,175,55,0.25)}
.ntab.done{color:rgba(255,255,255,0.55)}

/* HERO */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 0%,rgba(212,175,55,0.08) 0%,transparent 70%)}
.hero-orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(80px)}
.hero-orb-1{width:500px;height:500px;background:rgba(212,175,55,0.06);top:-150px;left:50%;transform:translateX(-50%)}
.hero-orb-2{width:300px;height:300px;background:rgba(99,102,241,0.05);bottom:100px;right:-100px}
.hero-orb-3{width:200px;height:200px;background:rgba(16,185,129,0.05);bottom:150px;left:-50px}
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(212,175,55,0.08);color:#d4af37;border:1px solid rgba(212,175,55,0.2);padding:7px 18px;border-radius:30px;font-size:12px;font-weight:600;margin-bottom:32px;letter-spacing:.06em;text-transform:uppercase;animation:fadeDown .6s ease}
@keyframes fadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.hero h1{font-size:clamp(42px,7vw,72px);font-weight:800;line-height:1.0;margin-bottom:24px;animation:fadeUp .7s ease .1s both}
.hero h1 .w1{color:rgba(255,255,255,0.9)}
.hero h1 .w2{background:linear-gradient(135deg,#d4af37,#f0d060);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero h1 .w3{color:rgba(255,255,255,0.9)}
.hero-sub{font-size:17px;color:rgba(255,255,255,0.5);max-width:560px;line-height:1.7;margin:0 auto 40px;font-weight:300;animation:fadeUp .7s ease .2s both}
.features-row{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:40px;animation:fadeUp .7s ease .3s both}
.feat-tag{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 14px;font-size:12px;color:rgba(255,255,255,0.6);display:flex;align-items:center;gap:6px;transition:all .2s}
.feat-tag:hover{border-color:rgba(212,175,55,0.3);color:rgba(255,255,255,0.9);background:rgba(212,175,55,0.06)}
.hero-stats{display:flex;justify-content:center;gap:0;margin-bottom:44px;animation:fadeUp .7s ease .4s both;border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;max-width:480px}
.hstat{flex:1;padding:18px 16px;text-align:center;border-right:1px solid rgba(255,255,255,0.07)}
.hstat:last-child{border-right:none}
.hstat .num{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;background:linear-gradient(135deg,#d4af37,#f0d060);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hstat .lbl{font-size:11px;color:rgba(255,255,255,0.35);margin-top:3px;font-weight:300}
.btn-start{background:linear-gradient(135deg,#d4af37,#c9a227);color:#05060f;border:none;padding:16px 38px;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:10px;animation:fadeUp .7s ease .5s both;letter-spacing:.02em}
.btn-start:hover{transform:translateY(-3px);box-shadow:0 12px 35px rgba(212,175,55,0.35)}
.btn-start:active{transform:translateY(0)}

/* CONTENT */
.content{flex:1;padding:28px 28px;max-width:900px;margin:0 auto;width:100%}

/* PROGRESS */
.prog-sections{display:flex;gap:8px;margin-bottom:24px}
.prog-sec{flex:1;text-align:center}
.prog-outer{height:3px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden;margin-bottom:6px}
.prog-inner{height:100%;background:linear-gradient(90deg,#d4af37,#f0d060);border-radius:2px;transition:width .4s ease}
.prog-lbl{font-size:10px;color:rgba(255,255,255,0.3);font-weight:500}
.prog-lbl.active{color:#d4af37;font-weight:700}

/* SECTION HEADER */
.sec-head{display:flex;align-items:center;gap:13px;margin-bottom:18px}
.sec-icon{width:44px;height:44px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.sec-title{font-family:'Syne',sans-serif;font-size:19px;font-weight:700;color:white}
.sec-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-top:2px}
.dim-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;margin-top:4px}
.ohada-dim-badge{background:rgba(59,130,246,0.1);color:#60a5fa;border:1px solid rgba(59,130,246,0.2)}
.sect-dim-badge{background:rgba(245,158,11,0.1);color:#fbbf24;border:1px solid rgba(245,158,11,0.2)}

/* QUESTION CARDS */
.qcard{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:22px;margin-bottom:12px;transition:all .2s}
.qcard:hover{border-color:rgba(212,175,55,0.2);background:rgba(255,255,255,0.04)}
.qcard.answered{border-color:rgba(212,175,55,0.3);background:rgba(212,175,55,0.03)}
.qnum{font-size:11px;font-weight:600;color:#d4af37;letter-spacing:.08em;margin-bottom:8px;text-transform:uppercase}
.qtext{font-size:15px;font-weight:500;color:rgba(255,255,255,0.9);margin-bottom:14px;line-height:1.5}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.opt{padding:11px 14px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;background:rgba(255,255,255,0.03);font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.55);cursor:pointer;transition:all .15s;text-align:left;line-height:1.4}
.opt:hover{border-color:rgba(212,175,55,0.3);color:rgba(255,255,255,0.9);background:rgba(212,175,55,0.05)}
.opt.sel{border-color:#d4af37;background:rgba(212,175,55,0.1);color:#f0d060;font-weight:500}

/* NAV BUTTONS */
.navrow{display:flex;justify-content:space-between;align-items:center;margin-top:22px}
.btn-prev{padding:11px 22px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);cursor:pointer;font-weight:500;transition:all .15s}
.btn-prev:hover{border-color:rgba(255,255,255,0.2);color:rgba(255,255,255,0.8)}
.btn-prev:disabled{opacity:0.2;cursor:not-allowed}
.btn-next{padding:12px 26px;background:linear-gradient(135deg,#d4af37,#c9a227);border:none;border-radius:10px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#05060f;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:7px}
.btn-next:hover{transform:translateY(-1px);box-shadow:0 8px 25px rgba(212,175,55,0.3)}
.btn-next:disabled{opacity:0.3;cursor:not-allowed;transform:none}
.btn-accent{padding:11px 22px;background:linear-gradient(135deg,#d4af37,#c9a227);border:none;border-radius:10px;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#05060f;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
.btn-accent:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,175,55,0.3)}
.btn-outline{padding:11px 20px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:rgba(255,255,255,0.6);cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
.btn-outline:hover{border-color:rgba(255,255,255,0.25);color:white}
.btn-pdf{padding:11px 22px;border:none;border-radius:10px;background:linear-gradient(135deg,#dc2626,#b91c1c);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:white;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
.btn-pdf:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(220,38,38,0.35)}
.prog-txt{font-size:12px;color:rgba(255,255,255,0.3);font-weight:500}
.btn-row{display:flex;gap:9px;flex-wrap:wrap;margin-top:22px}

/* LOADING */
.loading-wrap{text-align:center;padding:70px 20px}
.ring{width:60px;height:60px;border:3px solid rgba(212,175,55,0.15);border-top-color:#d4af37;border-radius:50%;animation:spin .85s linear infinite;margin:0 auto 20px}
@keyframes spin{to{transform:rotate(360deg)}}
.lstep{display:flex;align-items:center;gap:9px;padding:9px 13px;background:rgba(255,255,255,0.03);border-radius:9px;font-size:13px;color:rgba(255,255,255,0.3);border:1px solid rgba(255,255,255,0.05);transition:all .3s;margin-bottom:7px;max-width:320px;margin-left:auto;margin-right:auto}
.lstep.active{color:white;border-color:rgba(212,175,55,0.25);background:rgba(212,175,55,0.05)}
.lstep.done{color:#10b981;border-color:rgba(16,185,129,0.2)}
.sdot{width:7px;height:7px;border-radius:50%;background:currentColor;flex-shrink:0}

/* RESULTS */
.score-hero{background:linear-gradient(135deg,rgba(212,175,55,0.06),rgba(212,175,55,0.02));border:1px solid rgba(212,175,55,0.15);border-radius:20px;padding:28px;margin-bottom:18px;display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center}
.rl-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:10px;border:1px solid}
.score-info h2{font-size:20px;font-weight:700;color:white;margin-bottom:7px;font-family:'Syne',sans-serif}
.score-info p{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.65}
.dim-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.dcard{background:rgba(255,255,255,0.03);border-radius:14px;padding:16px;border:1px solid rgba(255,255,255,0.07);transition:all .2s}
.dcard:hover{border-color:rgba(212,175,55,0.2);background:rgba(255,255,255,0.04)}
.dhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
.dname{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);font-family:'Syne',sans-serif}
.dscore{font-family:'Syne',sans-serif;font-size:19px;font-weight:800}
.dbar-bg{height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden}
.dbar{height:100%;border-radius:2px;transition:width 1s ease}

/* AI REPORT */
.ai-card{background:rgba(255,255,255,0.02);border-radius:18px;padding:24px;margin-bottom:14px;border:1px solid rgba(255,255,255,0.07)}
.ai-head{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.06)}
.ai-badge{display:flex;align-items:center;gap:5px;background:rgba(212,175,55,0.1);color:#d4af37;padding:4px 11px;border-radius:16px;font-size:11px;font-weight:600;letter-spacing:.04em;border:1px solid rgba(212,175,55,0.2)}
.ai-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:white}
.resume{background:rgba(212,175,55,0.04);border-radius:12px;padding:16px;margin-bottom:16px;border-left:3px solid #d4af37;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.7);font-style:italic}
.ohada-alert{background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.2);border-radius:11px;padding:13px 15px;margin-bottom:14px;display:flex;gap:10px;align-items:flex-start}
.ohada-block{background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.15);border-radius:13px;padding:18px;margin-bottom:14px}
.ohada-status{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:14px;font-size:12px;font-weight:700;margin-bottom:12px;border:1px solid}
.slbl{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:9px;margin-top:16px;color:rgba(255,255,255,0.5)}
.crit{background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15);border-radius:11px;padding:14px;margin-bottom:9px}
.crit-title{font-size:13px;font-weight:600;color:#f87171;margin-bottom:6px;display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.utag{font-size:10px;padding:2px 8px;border-radius:8px;font-weight:700;font-family:'Syne',sans-serif}
.u-i{background:rgba(239,68,68,0.15);color:#f87171}
.u-c{background:rgba(245,158,11,0.15);color:#fbbf24}
.u-m{background:rgba(99,102,241,0.15);color:#a5b4fc}
.crit-desc{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;margin-bottom:6px}
.crit-impact{font-size:12px;color:#f87171;font-weight:500}
.pos{background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);border-radius:11px;padding:13px;margin-bottom:9px;display:flex;gap:10px}
.pos-title{font-size:13px;font-weight:600;color:#34d399;margin-bottom:4px}
.pos-desc{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5}
.err-box{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:11px;padding:13px;color:#f87171;font-size:13px;margin-bottom:14px;display:flex;gap:9px}
.proj-card{background:rgba(255,255,255,0.02);border-radius:14px;padding:20px;margin-bottom:16px;border:1px solid rgba(255,255,255,0.07)}
.proj-bar-lbl{display:flex;justify-content:space-between;margin-bottom:5px;font-size:12px;color:rgba(255,255,255,0.5)}
.proj-bg{height:6px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden;margin-bottom:10px}
.proj-fill{height:100%;border-radius:3px;transition:width 1s ease}
.eco-box{background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:12px 15px;margin-top:8px;font-size:13px;font-weight:600;color:#34d399}

/* ACTIONS */
.acard{background:rgba(255,255,255,0.02);border-radius:15px;padding:20px;margin-bottom:11px;border:1px solid rgba(255,255,255,0.07);display:grid;grid-template-columns:40px 1fr;gap:14px;align-items:flex-start;transition:all .2s}
.acard:hover{border-color:rgba(255,255,255,0.12);background:rgba(255,255,255,0.03)}
.anum{width:40px;height:40px;border-radius:11px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);color:#d4af37;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;flex-shrink:0}
.aprio{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:16px;font-size:11px;font-weight:700;margin-bottom:6px;font-family:'Syne',sans-serif;letter-spacing:.04em;border:1px solid}
.pu{background:rgba(239,68,68,0.1);color:#f87171;border-color:rgba(239,68,68,0.2)}
.pi{background:rgba(245,158,11,0.1);color:#fbbf24;border-color:rgba(245,158,11,0.2)}
.ps{background:rgba(99,102,241,0.1);color:#a5b4fc;border-color:rgba(99,102,241,0.2)}
.atitle{font-size:14px;font-weight:600;color:white;margin-bottom:7px;font-family:'Syne',sans-serif}
.adesc{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.55;margin-bottom:9px}
.ameta{display:flex;gap:12px;flex-wrap:wrap}
.am{font-size:11px;color:rgba(255,255,255,0.35);display:flex;align-items:center;gap:4px}
.am strong{color:rgba(255,255,255,0.55);font-weight:500}
.proj-box{background:linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.03));border:1px solid rgba(212,175,55,0.2);border-radius:14px;padding:22px;margin-top:16px;display:flex;gap:14px;align-items:center}
.proj-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#d4af37;margin-bottom:6px}
.proj-text{color:rgba(255,255,255,0.6);font-size:13px;line-height:1.7}
.ai-hint{background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.15);border-radius:12px;padding:14px 16px;margin-bottom:20px;display:flex;gap:11px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6}
.msg-dir{background:linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.03));border:1px solid rgba(212,175,55,0.2);border-radius:14px;padding:20px;margin-top:16px;display:flex;gap:13px;align-items:flex-start}
.msg-text{color:rgba(255,255,255,0.7);font-size:14px;line-height:1.7;font-style:italic}
`;

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("home");
  const [secIdx,setSecIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [scores,setScores]=useState(null);
  const [aiData,setAiData]=useState(null);
  const [loadStep,setLoadStep]=useState(0);
  const [error,setError]=useState(null);

  const sIdx=answers.p2;
  const allSecs=[...QUESTIONS_BASE,...(sIdx!==undefined&&QUESTIONS_SECTEUR[sIdx]?[QUESTIONS_SECTEUR[sIdx]]:[])];
  const sec=allSecs[secIdx];
  const total=allSecs.length;
  const canNext=sec?.items.every(q=>answers[q.id]!==undefined);
  const sectorLabel=sIdx!==undefined?SECTEURS[sIdx]:"Non défini";

  function answer(id,idx){setAnswers(p=>({...p,[id]:idx}));}

  function next(){
    if(secIdx<total-1)setSecIdx(s=>s+1);
    else runAnalysis();
  }

  async function runAnalysis(){
    setScreen("loading");setLoadStep(0);setError(null);
    const s=computeScores(answers);setScores(s);
    const iv=setInterval(()=>setLoadStep(p=>Math.min(p+1,5)),1000);
    try{
      const res=await fetch("https://riskguard-ai-production.up.railway.app/api/analyze",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[{role:"user",content:buildPrompt(answers,s,sectorLabel)}]})
      });
      clearInterval(iv);setLoadStep(6);
      const d=await res.json();
      const txt=d.content?.map(b=>b.text||"").join("")||"";
      setAiData(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch(e){clearInterval(iv);setLoadStep(6);setError(e.message);}
    setTimeout(()=>setScreen("results"),500);
  }

  function restart(){setScreen("home");setSecIdx(0);setAnswers({});setScores(null);setAiData(null);setError(null);setLoadStep(0);}

  const tabs=["Accueil","Diagnostic","Résultats","Plan d'action"];
  const screens=["home","questionnaire","results","actions"];

  return(
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-box">🛡</div>
          Risk<span className="logo-ai">Guard</span> AI
          <span className="nav-tag">RIMRAE · RARM 2026</span>
        </div>
        <div className="nav-tabs">
          {tabs.map((t,i)=>(
            <button key={i} className={`ntab ${screen===screens[i]?"active":screens.indexOf(screen)>i?"done":""}`}
              onClick={()=>{
                if(screens[i]==="home"){restart();}
                else if(screens[i]==="questionnaire"){if(screen!=="home")setScreen("questionnaire");}
                else if(screens[i]==="results"){if(scores)setScreen("results");}
                else if(screens[i]==="actions"){if(aiData)setScreen("actions");}
              }}>{t}</button>
          ))}
        </div>
      </nav>

      {/* HOME */}
      {screen==="home"&&(
        <div className="hero">
          <div className="hero-orb hero-orb-1"/>
          <div className="hero-orb hero-orb-2"/>
          <div className="hero-orb hero-orb-3"/>
          <div className="hero-badge">🌍 Solution RARM Challenge 2026 — Abidjan, Côte d'Ivoire</div>
          <h1><span className="w1">Risk</span><span className="w2">Guard</span><span className="w3"> AI</span></h1>
          <p className="hero-sub">La première plateforme intelligente de gestion des risques construite pour les PME africaines. Diagnostic sectoriel, conformité OHADA, plan d'action personnalisé.</p>
          <div className="features-row">
            {["⚖️ Conformité OHADA intégrée","🎯 Questions sectorielles adaptées","🤖 Analyse IA temps réel","📊 Plan d'action chiffré en FCFA","📄 Rapport PDF professionnel"].map((f,i)=>(
              <div className="feat-tag" key={i}>{f}</div>
            ))}
          </div>
          <div className="hero-stats">
            <div className="hstat"><div className="num">24</div><div className="lbl">Questions IA</div></div>
            <div className="hstat"><div className="num">6</div><div className="lbl">Secteurs</div></div>
            <div className="hstat"><div className="num">OHADA</div><div className="lbl">Conformité</div></div>
            <div className="hstat"><div className="num">15 min</div><div className="lbl">Diagnostic</div></div>
          </div>
          <button className="btn-start" onClick={()=>setScreen("questionnaire")}>⚡ Lancer mon diagnostic gratuit</button>
        </div>
      )}

      {/* QUESTIONNAIRE */}
      {screen==="questionnaire"&&(
        <div className="content">
          <div className="prog-sections">
            {allSecs.map((s,i)=>{
              const done=s.items.filter(q=>answers[q.id]!==undefined).length;
              return(
                <div className="prog-sec" key={i}>
                  <div className="prog-outer"><div className="prog-inner" style={{width:`${Math.round((done/s.items.length)*100)}%`}}/></div>
                  <div className={`prog-lbl ${i===secIdx?"active":""}`}>{s.icon} {s.section.split("—")[0].trim().split(" ").slice(0,2).join(" ")}</div>
                </div>
              );
            })}
          </div>
          <div className="sec-head">
            <div className="sec-icon">{sec.icon}</div>
            <div>
              <div className="sec-title">{sec.section}</div>
              <div className="sec-sub">Section {secIdx+1}/{total} — {sec.items.filter(q=>answers[q.id]!==undefined).length}/{sec.items.length} répondues</div>
              {sec.dim==="ohada"&&<div className="dim-badge ohada-dim-badge">⚖️ Module Conformité OHADA</div>}
              {sec.dim==="sectoriel"&&<div className="dim-badge sect-dim-badge">🎯 Questions spécifiques à votre secteur</div>}
            </div>
          </div>
          {sec.items.map((q,qi)=>(
            <div key={q.id} className={`qcard ${answers[q.id]!==undefined?"answered":""}`}>
              <div className="qnum">Question {secIdx*4+qi+1} / {total*4}</div>
              <div className="qtext">{q.text}</div>
              <div className="opts">
                {q.options.map((o,oi)=>(
                  <button key={oi} className={`opt ${answers[q.id]===oi?"sel":""}`} onClick={()=>answer(q.id,oi)}>{o}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="navrow">
            <button className="btn-prev" onClick={()=>setSecIdx(s=>s-1)} disabled={secIdx===0}>← Précédent</button>
            <span className="prog-txt">{Math.round((sec.items.filter(q=>answers[q.id]!==undefined).length/sec.items.length)*100)}% complété</span>
            <button className="btn-next" onClick={next} disabled={!canNext}>
              {secIdx===total-1?"✨ Analyser mes risques":"Suivant →"}
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {screen==="loading"&&(
        <div className="content">
          <div className="loading-wrap">
            <div className="ring"/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:21,fontWeight:700,color:"white",marginBottom:8}}>Analyse IA en cours...</h2>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.4)",marginBottom:28}}>Notre IA analyse votre profil selon les standards OHADA</p>
            {["Calcul des scores sectoriels...","Vérification conformité OHADA...","Analyse des risques critiques...","Benchmarking PME africaines...","Génération du plan d'action FCFA...","Finalisation du rapport..."].map((s,i)=>(
              <div key={i} className={`lstep ${i===loadStep?"active":i<loadStep?"done":""}`}>
                <div className="sdot"/>{i<loadStep?"✓ ":""}{s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {screen==="results"&&scores&&(
        <div className="content">
          <div className="score-hero">
            <Gauge score={scores.global}/>
            <div className="score-info">
              <div className="rl-badge" style={{background:getRiskLevel(scores.global).bg+"20",color:getRiskLevel(scores.global).dot,borderColor:getRiskLevel(scores.global).dot+"40"}}>
                ● {getRiskLevel(scores.global).label}
              </div>
              <h2>Score de risque : {scores.global}/100</h2>
              <p>{aiData?aiData.resume_executif:"Votre diagnostic est prêt. Consultez les détails ci-dessous."}</p>
            </div>
          </div>

          <div className="dim-grid">
            {[["⚖️ OHADA & Gouvernance",scores.ohada],["👥 RH & Management",scores.rh],["💰 Finance & Fraude",scores.finance],["⚠️ HSE & Opérations",scores.hse],["🎯 Risques Sectoriels",scores.sectoriel]].map(([l,s],i)=>(
              <div className="dcard" key={i}>
                <div className="dhead"><div className="dname">{l}</div><div className="dscore" style={{color:getRiskColor(s)}}>{s}</div></div>
                <div className="dbar-bg"><div className="dbar" style={{width:`${s}%`,background:getRiskColor(s)}}/></div>
              </div>
            ))}
          </div>

          {/* Projection */}
          {scores&&(
            <div className="proj-card">
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:14}}>📈 Projection de votre score</div>
              {[[`Aujourd'hui`,scores.global,"#ef4444"],[`Dans 3 mois`,aiData?.score_projection?.score_3mois||Math.max(scores.global-15,8),"#f59e0b"],[`Dans 6 mois`,aiData?.score_projection?.score_6mois||Math.max(scores.global-28,5),"#10b981"]].map(([l,v,c],i)=>(
                <div key={i}>
                  <div className="proj-bar-lbl"><span>{l}</span><span style={{color:c,fontWeight:700}}>{v}/100</span></div>
                  <div className="proj-bg"><div className="proj-fill" style={{width:`${v}%`,background:c}}/></div>
                </div>
              ))}
              {aiData?.score_projection?.economies_estimees&&(
                <div className="eco-box">💰 Pertes évitées estimées : {aiData.score_projection.economies_estimees}</div>
              )}
            </div>
          )}

          {error&&<div className="err-box">⚠️ Analyse IA non disponible ({error}). Scores valides.</div>}

          {aiData&&(
            <div className="ai-card">
              <div className="ai-head">
                <div className="ai-badge">✨ Analyse IA</div>
                <div className="ai-title">Rapport de Risk Management — Contexte OHADA</div>
              </div>
              {aiData.alerte_ohada&&(
                <div className="ohada-alert">
                  <span style={{fontSize:18,flexShrink:0}}>⚖️</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#60a5fa",marginBottom:3}}>ALERTE CONFORMITÉ OHADA</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.5}}>{aiData.alerte_ohada}</div>
                  </div>
                </div>
              )}
              <div className="resume">{aiData.resume_executif}</div>
              {aiData.conformite_ohada&&(
                <div className="ohada-block">
                  <div style={{fontSize:12,fontWeight:700,color:"#60a5fa",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>⚖️ Conformité OHADA</div>
                  <div className="ohada-status" style={{background:aiData.conformite_ohada.statut==="CONFORME"?"rgba(16,185,129,0.1)":aiData.conformite_ohada.statut==="PARTIELLEMENT CONFORME"?"rgba(245,158,11,0.1)":"rgba(239,68,68,0.1)",color:aiData.conformite_ohada.statut==="CONFORME"?"#34d399":aiData.conformite_ohada.statut==="PARTIELLEMENT CONFORME"?"#fbbf24":"#f87171",borderColor:aiData.conformite_ohada.statut==="CONFORME"?"rgba(16,185,129,0.3)":aiData.conformite_ohada.statut==="PARTIELLEMENT CONFORME"?"rgba(245,158,11,0.3)":"rgba(239,68,68,0.3)"}}>
                    {aiData.conformite_ohada.statut==="CONFORME"?"✅":"⚠️"} {aiData.conformite_ohada.statut}
                  </div>
                  {aiData.conformite_ohada.points_attention?.map((p,i)=>(
                    <div key={i} style={{fontSize:13,color:"rgba(255,255,255,0.5)",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",gap:7}}>
                      <span style={{color:"#fbbf24",flexShrink:0}}>→</span>{p}
                    </div>
                  ))}
                </div>
              )}
              <div className="slbl">⚡ Points critiques</div>
              {aiData.points_critiques?.map((p,i)=>(
                <div className="crit" key={i}>
                  <div className="crit-title">⚠ {p.titre}<span className={`utag ${p.urgence==="IMMÉDIAT"?"u-i":p.urgence==="COURT TERME"?"u-c":"u-m"}`}>{p.urgence}</span></div>
                  <div className="crit-desc">{p.description}</div>
                  <div className="crit-impact">💸 {p.impact_financier}</div>
                </div>
              ))}
              <div className="slbl" style={{marginTop:18}}>✅ Points positifs</div>
              {aiData.points_positifs?.map((p,i)=>(
                <div className="pos" key={i}>
                  <span style={{fontSize:16,flexShrink:0,color:"#34d399"}}>✓</span>
                  <div><div className="pos-title">{p.titre}</div><div className="pos-desc">{p.description}</div></div>
                </div>
              ))}
              {aiData.message_dirigeant&&(
                <div className="msg-dir">
                  <span style={{fontSize:24,flexShrink:0}}>💬</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#d4af37",marginBottom:6,letterSpacing:".05em"}}>MESSAGE AU DIRIGEANT</div>
                    <div className="msg-text">{aiData.message_dirigeant}</div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="btn-row">
            <button className="btn-accent" onClick={()=>setScreen("actions")}>📋 Plan d'action complet →</button>
            {aiData&&<button className="btn-pdf" onClick={()=>generatePDF(aiData,scores,sectorLabel)}>⬇️ Télécharger PDF</button>}
            <button className="btn-outline" onClick={restart}>🔄 Nouveau diagnostic</button>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      {screen==="actions"&&(
        <div className="content">
          <div style={{marginBottom:22}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"white",marginBottom:5}}>Plan d'action personnalisé</h2>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.4)"}}>Généré par IA · Adapté au contexte ivoirien et OHADA{scores&&<> · Score actuel : <strong style={{color:getRiskColor(scores.global)}}>{scores.global}/100</strong></>}</p>
          </div>
          {aiData?.plan_action?(
            <>
              <div className="ai-hint">
                <span style={{fontSize:18,flexShrink:0}}>✨</span>
                <div>L'IA a identifié <strong style={{color:"#d4af37"}}>{aiData.plan_action.length} actions prioritaires</strong> avec coûts en FCFA.{aiData.score_projection&&` En suivant ce plan, votre score peut passer de ${aiData.score_projection.score_actuel} à ${aiData.score_projection.score_6mois}/100 en 6 mois.`}</div>
              </div>
              {aiData.plan_action.map((a,i)=>(
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
              {aiData.score_projection&&(
                <div className="proj-box">
                  <span style={{fontSize:28,flexShrink:0}}>🎯</span>
                  <div>
                    <div className="proj-title">Projection sur 6 mois</div>
                    <div className="proj-text">
                      Score actuel <strong style={{color:"#ef4444"}}>{aiData.score_projection.score_actuel}/100</strong> →
                      Dans 3 mois <strong style={{color:"#f59e0b"}}>{aiData.score_projection.score_3mois}/100</strong> →
                      Dans 6 mois <strong style={{color:"#d4af37"}}>{aiData.score_projection.score_6mois}/100</strong>
                      {aiData.score_projection.economies_estimees&&<><br/>💰 Pertes évitées : <strong style={{color:"#34d399"}}>{aiData.score_projection.economies_estimees}</strong></>}
                    </div>
                  </div>
                </div>
              )}
            </>
          ):(
            <div style={{textAlign:"center",padding:48,color:"rgba(255,255,255,0.2)",fontSize:14}}>Aucun plan disponible. Relancez le diagnostic.</div>
          )}
          <div className="btn-row">
            <button className="btn-outline" onClick={()=>setScreen("results")}>← Retour aux résultats</button>
            {aiData&&<button className="btn-pdf" onClick={()=>generatePDF(aiData,scores,sectorLabel)}>⬇️ Télécharger PDF</button>}
            <button className="btn-accent" onClick={restart}>🔄 Nouveau diagnostic</button>
          </div>
        </div>
      )}
    </>
  );
}
