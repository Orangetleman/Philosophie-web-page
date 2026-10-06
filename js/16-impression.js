/* js/16-impression.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── FICHE IMPRIMABLE D'UNE NOTION (étape 6, oct. 2026) ──────────────────
   Le point fort historique de Fiches BUT : une fiche de révision à
   imprimer (ou à enregistrer en PDF depuis la fenêtre d'impression). Le
   bouton « 🖨 Fiche » de l'en-tête d'une notion compose la fiche dans
   #impression, invisible à l'écran ; la feuille css/10-impression.css
   n'imprime que lui. Contenu : question et définition (sections
   « Approfondir » dépliées), auteurs (synthèse de chaque idée et première
   citation exacte), concepts, plans (problématique et parties), sujets
   (dont ceux tombés au bac), sources. */

/* ficheImpressionHTML(k) — le HTML de la fiche de la notion k. */
function ficheImpressionHTML(k){
  const n=D[k], e=s=>String(s||'');
  const def=e(n.def).replace(/<details>/g,'<details open>');
  // Auteurs, dans l'ordre des cartes de la notion (compareAuthors).
  const parNom={}; (n.auteurs||[]).forEach(a=>{ (parNom[a.n]=parNom[a.n]||[]).push(...(a.ideas||[])); });
  const noms=Object.keys(parNom).sort(compareAuthors);
  const auteurs=noms.map(nom=>{
    const st=statutAuteur(nom), etiq=st==='programme'?' <span class="imp-etiq">programme</span>':'';
    const idees=parNom[nom].map(it=>{
      const cit=(it.citations||[]).find(c=>/[«“]/.test(c));
      return `<li><span class="imp-oeuvre">${e(it.w)}</span> : ${e(it.fiche||quizThesis(it)||stripHtml(it.i))}${cit?`<div class="imp-cit">${cit}</div>`:''}</li>`;
    }).join('');
    return `<div class="imp-auteur"><div class="imp-nom">${nom}${etiq}</div><ul>${idees}</ul></div>`;
  }).join('');
  const concepts=CONCEPTS.filter(c=>!isRepere(c)&&(c.notions||[]).includes(k)).map(c=>`<li><strong>${c.term}</strong> : ${stripHtml(c.def)}</li>`).join('');
  const plans=(n.plans||[]).map(p=>`<div class="imp-plan"><div class="imp-plan-q">${e(p.q)}</div>${p.pb?`<div class="imp-pb">${p.pb}</div>`:''}<ol>${(p.axes||[]).map(a=>`<li>${e(a.t)||'(partie)'}${(a.sps||[]).length?`<ul>${a.sps.map(s=>`<li>${e(s.t)}${s.auteurs?' ('+s.auteurs+')':''}</li>`).join('')}</ul>`:''}</li>`).join('')}</ol></div>`).join('');
  const bac=sujetsDeNotion(k).map(x=>`<li>${x.type==='explication'?'Explication : '+x.auteur+', <em>'+x.oeuvre+'</em>':x.q} <span class="imp-quand">(bac ${x.annee}, voie ${x.voie})</span></li>`).join('');
  const diss=(n.diss||[]).map(d=>`<li>${typeof d==='object'?d.q:d}</li>`).join('');
  const sources=(n.sources||[]).map(s=>`<li>${s}</li>`).join('');
  const adresse=location.origin+location.pathname+'#/notion/'+k;
  return `<header class="imp-tete"><div class="imp-site">Graphe Philosophie · fiche de révision${estHP(k)?' · hors programme':''}</div>
      <h1>${n.l}</h1><div class="imp-question">${e(n.s)}</div></header>
    <section><h2>Définition</h2><div class="imp-def">${def}</div></section>
    ${auteurs?`<section><h2>Auteurs et idées clés</h2>${auteurs}</section>`:''}
    ${concepts?`<section><h2>Concepts</h2><ul class="imp-concepts">${concepts}</ul></section>`:''}
    ${plans?`<section><h2>Plans de dissertation</h2>${plans}</section>`:''}
    ${bac?`<section><h2>Tombés au bac</h2><ul>${bac}</ul></section>`:''}
    ${diss?`<section><h2>Autres sujets</h2><ul>${diss}</ul></section>`:''}
    ${sources?`<section><h2>Sources</h2><ul>${sources}</ul></section>`:''}
    <footer class="imp-pied">${adresse}</footer>`;
}

/* imprimerFiche(k) — compose la fiche et ouvre la fenêtre d'impression du
   navigateur ; la fiche est retirée une fois l'impression terminée. */
function imprimerFiche(k){
  k=k||cur;
  let box=document.getElementById('impression');
  if(!box){ box=document.createElement('div'); box.id='impression'; document.body.appendChild(box); }
  box.innerHTML=ficheImpressionHTML(k);
  document.body.classList.add('impression-prete');
  const fin=()=>{ document.body.classList.remove('impression-prete'); box.innerHTML=''; window.removeEventListener('afterprint',fin); };
  window.addEventListener('afterprint',fin);
  window.print();
}
