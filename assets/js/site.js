(function () {
  var racine = document.body.dataset.racine || '';
  var en = document.documentElement.lang === 'en';
  var calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ecran = document.getElementById('ecran');
  var minuteries = [];
  var NOM = 'Elliott Robin';
  var TITRE = 'Consultant, PMP®';
  var NUAGE = [3,4,14,15,24,24,33,32,33,34,32,34,44,44,45,54,53,55,64,75,74,83,83,84,95,94,95,93,105,104,115,115,114,113,113,124,123,125,125,125,134,135,135,144,144,144,143,145,143,154,153,163,165,174,175,175,182,184,183,184,185,194,194,195,203,204,215,213,215,214,213,214,225,223,225,223,224,232,235,232,235,245,244,244,243,244,244,243,244,242,243,244,245,244,243,244,245,255,252,254,255,253,254,252,255,253,265,264,265,265,265,274,272,284,285,284,284,284,284,293,294,294,293,295,294,295,304,304,304,304,304,304,313,312,314,314,314,313,315,314,314,315,314,324,324,324,324,323,324,323,323,325,325,324,335,335,332,334,333,334,334,343,344,344,344,345,345,354,355,364];
  var MOYENNES = [3.79,3.52,3.75,3.58,3.64,3.58,3.79,3.77,3.85,3.76,4.1,4.04,3.89,3.84,3.92,3.89,3.81,3.81,3.93,4.08,3.95,3.96,3.85,3.86,3.96,4.01,4.0,3.94,4.23,4.0];
  var VOLUMES = [21,50,45,21,54,62,50,61,44,18,38,42,65,20,68,52,98,166,97,74,51,70,95,78,113,110,81,72,33,11];
  var PICTO = '<svg class="picto-agent" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" fill="#2b2f4a"/><path d="M3 32c0-6 4.6-9.2 10-10.2l3 2.2 3-2.2c5.4 1 10 4.2 10 10.200z" fill="#0d0e13"/><path d="M12.8 21.7 16 28l3.2-6.300z" fill="#fff"/><path d="M15 23.300h2l.5 1.1-.8 4.400h-1.400l-.8-4.400z" fill="#0d0e13"/><path d="M13.6 17h4.800v5.200L16 24l-2.4-1.800z" fill="#d9a67c"/><ellipse cx="16" cy="12.8" rx="6.6" ry="7.6" fill="#eebd93"/><path d="M9.2 12.400C8.4 6.6 11.8 3.6 16.5 3.600c4.8 0 7.2 3.2 6.3 8.8-.5-2.3-1.5-3.7-3.2-4.4-3.2 1-6.9.8-8.4.4-.9.9-1.6 2.1-2 4z" fill="#14110e"/><path d="M8.6 11.300h14.8" stroke="#08080a" stroke-width="1.1"/><path d="M9 11.300h6.300c.3 0 .5.2.5.5 0 2.6-1.1 4.5-3.5 4.5-2.2 0-3.6-1.9-3.7-4.5 0-.3.1-.5.4-.5zM16.2 11.800c0-.3.2-.5.5-.5H23c.3 0 .4.2.4.5-.1 2.6-1.5 4.5-3.7 4.5-2.4 0-3.5-1.9-3.5-4.500z" fill="#08080a"/><path d="M10.6 14.600l2.4-2.400M18 14.600l2.4-2.4" stroke="#fff" stroke-width="0.8" stroke-linecap="round" opacity="0.8"/><path d="M14.4 18.2c1.3.3 2.6.1 3.8-.8" fill="none" stroke="#6e3f24" stroke-width="0.7" stroke-linecap="round"/><path d="M22.7 13.800c.9.3 1 1.3.7 2.3-.4 1.5-.3 3.6.6 5.4" fill="none" stroke="#dfe2ea" stroke-width="0.6" stroke-linecap="round"/></svg>';
  function chargerCarte(fini) {
    if (window.CARTE_LANGUES) { fini(); return; }
    var s = document.createElement('script');
    s.src = racine + 'assets/js/carte-langues.js?v=ef06490bfd';
    s.onload = fini;
    document.head.appendChild(s);
  }
  var BONJOUR = { fr: 'Bonjour', en: 'Hello', es: 'Hola', zh: '你好', hi: 'नमस्ते', ar: 'مرحبا' };
  var INTERPRETES = [['EN', 'Understood'], ['ES', 'Entendido'], ['PT', 'Entendido'], ['IT', 'Capito'], ['DE', 'Verstanden'], ['NL', 'Begrepen'], ['SV', 'Uppfattat'], ['DA', 'Forstået'], ['NB', 'Forstått'], ['NN', 'Forstått'], ['FI', 'Selvä'], ['IS', 'Skilið']];
  var NOTE = '3.98';

  var T = en
    ? {
      locale: 'en-CA',
      rencontre: 'Team meeting', transcription: 'Transcript',
      moi: 'Me', lignes: [['Me', 'Clients want to filter the report by date.'], ['JT', 'And the export label is still wrong.'], ['Me', 'Let’s fix that in this sprint.'], ['agent', 'Got it. Preparing 2 cards for the PO.']],
      nomTranscription: 'Transcript agent', nomBacklog: 'Backlog agent', agent: 'In Teams', pour: 'For the Product Owner',
      cartes: [['New story', 'Filter the report by date'], ['Update to #1198', 'Fix the export label']], approuver: 'Approve', rejeter: 'Reject', approuve: 'Approved',
      filTeams: ['Meeting', 'Card to PO', 'Backlog'], filStories: ['Teams chat', 'Flow', 'Backlog'],
      sprint: 'Backlog · current sprint', nouveau: 'New', actif: 'Active', maj: 'Updated',
      lignesBacklog: [['1204', 'Import the monthly file', 'Active'], ['1198', 'Fix the export label', 'Active'], ['1191', 'Add the status column', 'New']],
      nouvelle: ['1207', 'Filter the report by date'],
      chat: [['moi', 'I need a story for the report'], ['agent', 'Who is it for?'], ['moi', 'Finance analysts'], ['agent', 'What should they be able to do?'], ['moi', 'Filter by date'], ['agent', 'Story ready. Sending it to the current sprint.']],
      fluxTitre: 'Flow called by the agent', flux: ['When the agent calls the flow', 'Parse the request', 'Find the current sprint', 'Create or update?', 'Create a work item'],
      compta: 'My accountant', etapes: ['Invoice generated', 'Receipt filed, deduction noted', 'Entry in the journal', 'Sales taxes calculated', 'Tax returns prepared', 'Deadlines added to the calendar'], ajour: 'Books up to date',
      comptaDit: 'What it tells me to do', aFaire: 'To do', aOptimiser: 'To optimize',
      rappels: [['Nov.', '30', 'GST and QST remittance', 'The amount is calculated, it just needs paying.'], ['Dec.', '15', 'Tax instalment', 'Set the money aside now.'], ['Apr.', '30', 'Tax return', 'Ready to file.']],
      conseils: [['Dividend or salary?', 'A dividend leaves you more this year.'], ['Missed deduction', 'Your home office isn’t claimed.']],
      note: 'Average score, last 40 prompts',
      bilanTitre: 'Since last time', bilan: 'You’ve clearly improved on catch-all messages: they drop from 10% to 2%, and your long requests are now much better structured. Your overall results barely move (92% first-try success, 3% corrections, 6% interruptions), so the next gain lies in messages sent too early or incomplete.',
      astuceTitre: 'Tip', astuce: ['Name the effect you want on the user', 'Say up front what the person should feel within 5 seconds, and what they must not feel.', 'Minimal page: within 5 seconds, you should think “this is simple”.'],
      nuage: 'Rated prompts, by day (1 to 5)', courbe: 'Average score, day by day',
      statsCoach: ['Prompts analyzed', 'Agent calls', 'Tokens written', 'Interruptions'],
      pbProgramme: 'Alpha program', pbStatut: 'Steering committee status', pbFil: ['Actual', 'Projection', 'Deliverables'],
      pbValeur: 'Value delivered', pbRealisation: 'Completion', pbCible: 'Target', pbVolet: 'Stream ', pbLivrable: 'Deliverable', pbReel: 'Actual', pbProjete: 'Projected',
      pbLignes: [['Mobile app', 100, 100], ['New website', 85, 100], ['Loyalty program', 55, 90], ['Virtual call center', 40, 85], ['Sales dashboard', 20, 75], ['Satisfaction survey', 10, 60]],
      barreMac: 'Mac menu bar',
      frappes: 'Keystrokes per day, on average', statsFrappes: ['Daily record', 'Words typed', 'Best minute', 'Corrections'], parHeure: 'By hour of the day',
      perf: 'Mac performance', processeur: 'Processor', statsPerf: ['GPU', 'Memory', 'Peak, last minute', 'Swap'], memoire: ' / 48 GB', go: ' GB', quiOccupe: 'What’s using the processor', occupants: ['Claude', 'Simulators', 'Rest of the Mac'],
      lTitre: 'What language does the world write in?', lPhrase: function (m, l) { return '<b>' + m + ' million people</b> write every day in ' + l + '.'; },
      lNoms: { fr: 'French', en: 'English', es: 'Spanish', zh: 'Mandarin', hi: 'Hindi', ar: 'Arabic' }, lDepart: 'en', lLegende: 'Share who write in this language',
      mFil: ['Decision', 'Checks', 'TestFlight', 'Interpreters'], mAgent: 'My agent', mAttend: 'Waiting for my decision',
      mChat: ['Two options are equal. Your call.', 'Noted. Nothing ships without your OK.'],
      mControles: 'Checks', mAvant: 'Before it reaches me', mTests: 'automated tests', mListe: ['Measurement benches', 'Language coverage', 'Project rules', 'Report read'],
      mTest: 'I try it myself', mEssais: [['Trial 1', 'The correction comes too late'], ['Trial 2', 'The correction comes at the right moment']], mValide: 'Approved', mRefaire: 'Redo',
      mInterpretes: 'Interpreters', mMeme: 'Same rigor in every language',
      chrono: 'Worked today', statsChrono: ['Billable', 'Sessions', 'This week', 'Rounding'], arrondi: '¼ hour', frise: 'The day'
    }
    : {
      locale: 'fr-CA',
      rencontre: 'Rencontre d’équipe', transcription: 'Transcription',
      moi: 'Moi', lignes: [['Moi', 'Les clients veulent filtrer le rapport par date.'], ['JT', 'Et le libellé de l’export est encore mauvais.'], ['Moi', 'On règle ça dans ce sprint.'], ['agent', 'C’est noté. Je prépare 2 cartes pour le PO.']],
      nomTranscription: 'Agent de transcription', nomBacklog: 'Agent du backlog', agent: 'Dans Teams', pour: 'Pour le Product Owner',
      cartes: [['Nouvelle story', 'Filtrer le rapport par date'], ['Mise à jour de #1198', 'Corriger le libellé de l’export']], approuver: 'Approuver', rejeter: 'Rejeter', approuve: 'Approuvée',
      filTeams: ['Rencontre', 'Carte au PO', 'Backlog'], filStories: ['Conversation', 'Flux', 'Backlog'],
      sprint: 'Backlog · sprint courant', nouveau: 'Nouveau', actif: 'Actif', maj: 'Mise à jour',
      lignesBacklog: [['1204', 'Importer le fichier du mois', 'Actif'], ['1198', 'Corriger le libellé de l’export', 'Actif'], ['1191', 'Ajouter la colonne Statut', 'Nouveau']],
      nouvelle: ['1207', 'Filtrer le rapport par date'],
      chat: [['moi', 'J’ai besoin d’une story pour le rapport'], ['agent', 'C’est pour qui ?'], ['moi', 'Les analystes finances'], ['agent', 'Que doivent-ils pouvoir faire ?'], ['moi', 'Filtrer par date'], ['agent', 'Story prête. Je l’envoie au sprint courant.']],
      fluxTitre: 'Flux appelé par l’agent', flux: ['Quand l’agent appelle le flux', 'Analyser la demande', 'Trouver le sprint courant', 'Créer ou mettre à jour ?', 'Créer l’élément de travail'],
      compta: 'Mon comptable', etapes: ['Facture générée', 'Reçu classé, déduction notée', 'Écriture au journal', 'TPS et TVQ calculées', 'Déclarations préparées', 'Échéances au calendrier'], ajour: 'Livres à jour',
      comptaDit: 'Ce qu’il me dit de faire', aFaire: 'À faire', aOptimiser: 'À optimiser',
      rappels: [['30', 'nov.', 'Remise TPS et TVQ', 'Le montant est calculé, il reste à payer.'], ['15', 'déc.', 'Acompte d’impôt', 'Mets la somme de côté dès maintenant.'], ['30', 'avr.', 'Déclaration de revenus', 'Prête à transmettre.']],
      conseils: [['Dividende ou salaire ?', 'Le dividende te laisse plus cette année.'], ['Déduction oubliée', 'Ton bureau à domicile n’est pas réclamé.']],
      note: 'Note moyenne, 40 derniers prompts',
      bilanTitre: 'Depuis la dernière fois', bilan: 'Tu as nettement progressé sur les messages fourre-tout : ils passent de 10 % à 2 %, et tes longues demandes sont maintenant bien mieux structurées. Tes résultats globaux, eux, ne bougent presque pas (92 % de réussite du premier coup, 3 % de corrections, 6 % d’interruptions), donc le prochain gain se trouve dans les messages envoyés trop tôt ou incomplets.',
      astuceTitre: 'Astuce', astuce: ['Nomme l’effet voulu sur l’utilisateur', 'Dis d’avance ce que la personne doit ressentir en 5 secondes, et ce qu’elle ne doit surtout pas ressentir.', 'Page minimaliste : en 5 secondes, on doit se dire « c’est tout simple ».'],
      nuage: 'Prompts notés, par jour (1 à 5)', courbe: 'Note moyenne, jour par jour',
      statsCoach: ['Prompts analysés', 'Appels d’agents', 'Tokens écrits', 'Interruptions'],
      pbProgramme: 'Programme Alpha', pbStatut: 'Statut au comité de gestion', pbFil: ['Réel', 'Projection', 'Livrables'],
      pbValeur: 'Valeur livrée', pbRealisation: 'Réalisation', pbCible: 'Cible', pbVolet: 'Volet ', pbLivrable: 'Livrable', pbReel: 'Réel', pbProjete: 'Projeté',
      pbLignes: [['Application mobile', 100, 100], ['Nouveau site web', 85, 100], ['Programme de fidélité', 55, 90], ['Centre d’appels virtuel', 40, 85], ['Tableau de bord des ventes', 20, 75], ['Sondage de satisfaction', 10, 60]],
      barreMac: 'Barre d’état du Mac',
      frappes: 'Frappes par jour, en moyenne', statsFrappes: ['Record d’une journée', 'Mots tapés', 'Meilleure minute', 'Corrections'], parHeure: 'Par heure de la journée',
      perf: 'Performance du Mac', processeur: 'Processeur', statsPerf: ['GPU', 'Mémoire', 'Pic, dernière minute', 'Swap'], memoire: ' / 48 Go', go: ' Go', quiOccupe: 'Qui occupe le processeur', occupants: ['Claude', 'Simulateurs', 'Reste du Mac'],
      lTitre: 'Dans quelle langue le monde écrit-il ?', lPhrase: function (m, l) { return '<b>' + m + ' millions de personnes</b> écrivent au quotidien en ' + l + '.'; },
      lNoms: { fr: 'français', en: 'anglais', es: 'espagnol', zh: 'mandarin', hi: 'hindi', ar: 'arabe' }, lDepart: 'fr', lLegende: 'Part qui écrit dans cette langue',
      mFil: ['Décision', 'Contrôles', 'TestFlight', 'Interprètes'], mAgent: 'Mon agent', mAttend: 'Attend ma décision',
      mChat: ['Deux options se valent. À toi de trancher.', 'Noté. Rien ne sort sans ton accord.'],
      mControles: 'Contrôles', mAvant: 'Avant que ça me parvienne', mTests: 'tests automatisés', mListe: ['Bancs de mesure', 'Couverture des langues', 'Règles du projet', 'Compte rendu lu'],
      mTest: 'Je l’essaie moi-même', mEssais: [['Essai 1', 'La correction arrive trop tard'], ['Essai 2', 'La correction arrive au bon moment']], mValide: 'Validé', mRefaire: 'À refaire',
      mInterpretes: 'Interprètes', mMeme: 'La même rigueur dans chaque langue',
      chrono: 'Travaillé aujourd’hui', statsChrono: ['Facturable', 'Séances', 'Cette semaine', 'Arrondi'], arrondi: '¼ d’heure', frise: 'La journée'
    };

  function apres(ms, f) { minuteries.push(setTimeout(f, calme ? 0 : ms)); }
  function arreter() {
    minuteries.forEach(clearTimeout);
    minuteries = [];
  }

  function ecrire(c, mot, titre) {
    c.innerHTML = '<div class="nom-bloc"><p class="nom-ecrit"><span></span><i class="curseur"></i><span class="reste">' + mot + '</span><i class="point"></i></p>' + (titre ? '<p class="nom-titre">' + titre + '</p>' : '') + '</div>';
    var p = c.querySelector('.nom-ecrit'), texte = p.firstChild, curseur = p.querySelector('.curseur'), reste = p.querySelector('.reste');
    for (var i = 1; i <= mot.length; i++) {
      (function (n) { apres(300 + n * 80, function () { texte.textContent = mot.slice(0, n); reste.textContent = mot.slice(n); }); })(i);
    }
    var fin = 300 + mot.length * 80;
    apres(fin + 500, function () {
      curseur.remove();
      p.classList.add('pose');
    });
    apres(fin + 1100, function () { p.querySelector('.point').classList.add('vue'); });
    if (titre) apres(fin + 1600, function () { c.querySelector('.nom-titre').classList.add('vue'); });
  }

  var scenes = {
    accueil: function (c) { ecrire(c, NOM, TITRE); },

    clavier: function (c) {
      var langue = en ? 'en' : 'fr';
      var v = document.createElement('video');
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.preload = 'auto';
      v.poster = racine + 'assets/video/intro-fin-' + langue + '.png';
      v.src = racine + 'assets/video/intro-' + langue + '.mp4';
      v.setAttribute('aria-label', en ? 'A Good Keyboard opening animation' : 'L’animation d’ouverture d’Un bon clavier');
      c.appendChild(v);
      if (calme) return;
      function repli() {
        if (ecran.lastElementChild !== c || !v.parentNode) return;
        v.remove();
        c.classList.add('repli');
        ecran.parentNode.dataset.scene = 'clavier-repli';
        ecrire(c, en ? 'A Good Keyboard' : 'Un bon clavier');
      }
      v.addEventListener('error', repli);
      var essai = v.play();
      if (essai && essai.catch) essai.catch(repli);
      apres(1500, function () { if (v.currentTime < 0.1) repli(); });
    },

    langues: function (c) {
      c.innerHTML = '<h4 class="l-titre">' + T.lTitre + '</h4><p class="l-mot"><span></span><i></i></p><div class="l-carte"><b class="l-balai"></b></div><p class="l-chiffre"></p><p class="l-phrase"></p><ul class="l-puces"></ul><p class="l-legende">' + T.lLegende + '</p><ul class="l-echelle"><li><i class="pas3"></i>≥ ' + pct(80) + '</li><li><i class="pas2"></i>40–' + pct(79) + '</li><li><i class="pas1"></i>15–' + pct(39) + '</li></ul>';
      chargerCarte(function () {
        if (!ecran.contains(c)) return;
        var d = window.CARTE_LANGUES;
        var ordre = [T.lDepart].concat(d.langues.filter(function (k) { return k !== T.lDepart; }));
        var cadre = d.vue.split(' ').map(Number);
        c.querySelector('.l-carte').insertAdjacentHTML('afterbegin', '<svg viewBox="' + d.vue + '" role="img" aria-label="' + T.lTitre + '">' + d.chemins.map(function (p) { return '<path d="' + p + '"/>'; }).join('') + '</svg>');
        var formes = c.querySelectorAll('.l-carte path');
        formes.forEach(function (f) { f.style.transitionDelay = Math.round((f.getBBox().x - cadre[0]) / cadre[2] * 1000) + 'ms'; });
        var puces = c.querySelector('.l-puces'), mot = c.querySelector('.l-mot span'), chiffre = c.querySelector('.l-chiffre'), phrase = c.querySelector('.l-phrase');
        puces.innerHTML = ordre.map(function (k) { return '<li>' + T.lNoms[k] + '</li>'; }).join('');
        function ecrit(n) { return n.toLocaleString(T.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
        function langue(i) {
          var k = ordre[i], rang = d.langues.indexOf(k), lettres = Array.from(BONJOUR[k]);
          mot.textContent = '';
          lettres.forEach(function (l, n) {
            apres(n * 95, function () { mot.textContent = lettres.slice(0, n + 1).join(''); });
          });
          formes.forEach(function (f, n) { f.setAttribute('class', 'pas' + d.parts[n].charAt(rang)); });
          var balai = c.querySelector('.l-balai'), neuf = balai.cloneNode();
          balai.parentNode.replaceChild(neuf, balai);
          for (var s = 1; s <= 16; s++) {
            (function (s) { apres(s * 60, function () { chiffre.textContent = pct(ecrit(d.pourcents[k] * s / 16)); }); })(s);
          }
          phrase.innerHTML = T.lPhrase(nombre(d.millions[k]), T.lNoms[k]);
          for (var n = 0; n < puces.children.length; n++) puces.children[n].classList.toggle('active', n === i);
          if (!calme) apres(4000, function () { langue((i + 1) % ordre.length); });
        }
        langue(0);
      });
    },

    methode: function (c) {
      var aller = fil(c, T.mFil);
      var vue = aller(0, enteteAgent(T.mAgent, T.mAttend) + '<div class="chat"></div>');
      function agent(html, classe) {
        vue.querySelector('.chat').insertAdjacentHTML('beforeend', '<div class="tour agent ' + (classe || '') + '">' + PICTO + '<div><div class="bulle agent">' + html + '</div></div></div>');
      }
      function repond(texte) {
        var points = vue.querySelector('.m-points');
        if (points) points.remove();
        agent(texte);
      }
      apres(200, function () { agent('<i></i><i></i><i></i>', 'm-points'); });
      apres(1000, function () { repond(T.mChat[0]); });
      apres(1500, function () {
        vue.querySelector('.chat').insertAdjacentHTML('beforeend', '<div class="m-options"><span>A</span><span>B</span></div>');
      });
      apres(2600, function () { vue.querySelectorAll('.m-options span')[1].classList.add('choisie'); });
      apres(3200, function () { agent('<i></i><i></i><i></i>', 'm-points'); });
      apres(3900, function () { repond(T.mChat[1]); });

      apres(5200, function () {
        vue = aller(1, '<div class="t-entete"><b>' + T.mControles + '</b><span>' + T.mAvant + '</span></div><div class="m-jauge"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="fond" cx="50" cy="50" r="44" pathLength="100"/><circle class="arc" cx="50" cy="50" r="44" pathLength="100"/></svg><p><b>0</b><span>' + T.mTests + '</span></p></div><div class="m-liste">' +
          T.mListe.map(function (l) { return '<div class="m-ligne"><span>' + l + '</span><svg viewBox="0 0 16 16" aria-hidden="true"><path pathLength="1" d="M3 8.5 6.5 12 13 4.5"/></svg></div>'; }).join('') + '</div>');
        apres(80, function () { vue.querySelector('.m-jauge .arc').classList.add('pleine'); });
        for (var s = 1; s <= 21; s++) {
          (function (s) { apres(s * 70, function () { vue.querySelector('.m-jauge b').textContent = nombre(s * 100) + (s === 21 ? '+' : ''); }); })(s);
        }
        T.mListe.forEach(function (l, i) {
          apres(500 + i * 420, function () { vue.querySelectorAll('.m-ligne')[i].classList.add('ok'); });
        });
      });

      apres(8900, function () {
        vue = aller(2, '<div class="t-entete"><b>TestFlight</b><span>' + T.mTest + '</span></div><div class="t-cartes"></div>');
        T.mEssais.forEach(function (k, i) {
          apres(200 + i * 1500, function () {
            vue.querySelector('.t-cartes').insertAdjacentHTML('beforeend', '<div class="carte-po m-essai"><small>' + k[0] + '</small><b>' + k[1] + '</b><em class="m-tampon ' + (i ? 'oui' : 'non') + '">' + (i ? T.mValide : T.mRefaire) + '</em></div>');
          });
          apres(900 + i * 1500, function () { vue.querySelectorAll('.m-tampon')[i].classList.add('vu'); });
        });
      });

      apres(12400, function () {
        var points = INTERPRETES.map(function (l, i) {
          var a = (i * 30 - 90) * Math.PI / 180;
          return [Math.round(100 + 80 * Math.cos(a)), Math.round(100 + 80 * Math.sin(a))];
        });
        vue = aller(3, '<div class="t-entete"><b>' + T.mInterpretes + '</b><span>' + T.mMeme + '</span></div><div class="m-reseau"><svg viewBox="0 0 200 200" aria-hidden="true">' +
          points.map(function (p) { return '<line x1="100" y1="100" x2="' + p[0] + '" y2="' + p[1] + '"/>'; }).join('') +
          points.map(function (p, i) { return '<g class="noeud" transform="translate(' + p[0] + ' ' + p[1] + ')"><circle r="15"/><text y="3.6">' + INTERPRETES[i][0] + '</text></g>'; }).join('') +
          '<g transform="translate(100 100)"><circle class="centre" r="23"/><text class="centre" y="5">FR</text></g>' +
          points.map(function () { return '<circle class="impulsion" r="4"/>'; }).join('') +
          '</svg><p class="m-dit"></p></div>');
        var liens = vue.querySelectorAll('line'), noeuds = vue.querySelectorAll('.noeud'), impulsions = vue.querySelectorAll('.impulsion'), dit = vue.querySelector('.m-dit');
        points.forEach(function (p, i) {
          apres(350 + i * 340, function () {
            if (calme) return;
            impulsions[i].animate([
              { transform: 'translate(100px, 100px)', opacity: 1 },
              { transform: 'translate(' + p[0] + 'px, ' + p[1] + 'px)', opacity: 1 }
            ], { duration: 400, easing: 'ease-in' });
          });
          apres(750 + i * 340, function () {
            liens[i].classList.add('ok');
            noeuds[i].classList.add('ok');
            dit.textContent = INTERPRETES[i][1];
          });
        });
        if (!calme) apres(5900, function () { scenes.methode(c); });
      });
    },

    belmont: function (c) {
      c.innerHTML = '<div class="marque">BELMONT</div>';
      ['accueil', 'chene', 'config'].forEach(function (nom, i) {
        var img = new Image();
        img.src = racine + 'assets/img/belmont-' + nom + '.jpg';
        img.alt = '';
        c.appendChild(img);
        apres(1300 + i * 2400, function () { img.classList.add('vue'); });
      });
    },

    teams: function (c) {
      var aller = fil(c, T.filTeams);
      var vue = aller(0, '<div class="t-entete"><b>' + T.rencontre + '</b><span>' + T.transcription + '</span></div><div class="t-lignes"></div>');
      T.lignes.forEach(function (l, i) {
        var qui = l[0] === 'agent' ? PICTO : '<i' + (l[0] === T.moi ? ' class="moi"' : '') + '>' + l[0] + '</i>';
        apres(300 + i * 650, function () {
          vue.querySelector('.t-lignes').insertAdjacentHTML('beforeend', '<div class="t-ligne">' + qui + '<span>' + l[1] + '</span></div>');
        });
      });
      apres(3000, function () {
        var cartes = T.cartes.map(function (k) {
          return '<div class="carte-po"><small>' + k[0] + '</small><b>' + k[1] + '</b><div class="boutons"><span class="oui">' + T.approuver + '</span><span>' + T.rejeter + '</span></div></div>';
        }).join('');
        vue = aller(1, enteteAgent(T.nomTranscription, T.pour) + '<div class="t-cartes">' + cartes + '</div>');
      });
      [0, 1].forEach(function (i) {
        apres(3900 + i * 800, function () {
          var carte = vue.querySelectorAll('.carte-po')[i];
          carte.classList.add('faite');
          carte.querySelector('.oui').textContent = T.approuve;
        });
      });
      apres(5600, function () { vue = aller(2, backlog()); });
      apres(6100, function () { ajouterStory(vue); });
      apres(6900, function () {
        var ligne = vue.querySelectorAll('.ado-ligne')[2];
        ligne.classList.add('maj');
        ligne.querySelector('em').textContent = T.maj;
      });
    },

    stories: function (c) {
      var aller = fil(c, T.filStories);
      var vue = aller(0, enteteAgent(T.nomBacklog, T.agent) + '<div class="chat"></div>');
      ecrireChat(vue, T.chat);
      var depart = 300 + T.chat.length * 650 + 500;
      apres(depart, function () {
        vue = aller(1, '<div class="pa-entete"><b>Power Automate</b><span>' + T.fluxTitre + '</span></div><div class="flux">' + T.flux.map(function (n) { return '<div class="noeud">' + n + '</div>'; }).join('') + '</div>');
      });
      T.flux.forEach(function (_, i) {
        apres(depart + 300 + i * 380, function () { vue.querySelectorAll('.noeud')[i].classList.add('fait'); });
      });
      var fin = depart + 300 + T.flux.length * 380 + 300;
      apres(fin, function () { vue = aller(2, backlog()); });
      apres(fin + 500, function () { ajouterStory(vue); });
    },

    powerbi: function (c) {
      var aller = fil(c, T.pbFil);
      var entete = '<div class="pb-entete"><b>' + T.pbProgramme + '</b><span>' + T.pbStatut + '</span></div>';
      var pages = [
        entete + blocPb(T.pbValeur, 47, [55, 49, 44, 38], 'reel') + blocPb(T.pbRealisation, 62, [68, 66, 57, 52], 'reel'),
        entete + blocPb(T.pbValeur, 84, [93, 88, 79, 74], 'projete', 90) + blocPb(T.pbRealisation, 89, [96, 90, 87, 83], 'projete'),
        entete + '<div class="pb-table"><div class="pb-ligne pb-tete"><span>' + T.pbLivrable + '</span><span>' + T.pbReel + '</span><span>' + T.pbProjete + '</span></div>' +
          T.pbLignes.map(function (l) {
            return '<div class="pb-ligne' + (l[1] === 100 ? ' fini' : '') + '"><span>' + l[0] + '</span><b>' + pct(l[1]) + '</b><b>' + pct(l[2]) + '</b></div>';
          }).join('') + '</div>'
      ];
      function page(i) {
        var vue = aller(i, pages[i]);
        apres(80, function () {
          vue.querySelectorAll('.pb-arc').forEach(function (a) { a.style.strokeDashoffset = 100 - a.dataset.v; });
        });
        if (!calme) apres(5500, function () { page((i + 1) % pages.length); });
      }
      page(0);
    },

    comptable: function (c) {
      c.innerHTML = '<h4>' + T.compta + '</h4><ol><li>' + T.etapes.join('</li><li>') + '</li></ol><p class="a-jour">' + T.ajour + '</p>';
      var etapes = c.querySelectorAll('li');
      etapes.forEach(function (e, i) {
        apres(400 + i * 450, function () { e.classList.add('fait'); });
      });
      var fin = 400 + etapes.length * 450;
      apres(fin, function () { c.querySelector('.a-jour').classList.add('vue'); });
      apres(fin + 1300, function () {
        c.innerHTML = '<h4>' + T.comptaDit + '</h4><h5>' + T.aFaire + '</h5>' +
          T.rappels.map(function (r) {
            return '<div class="carte"><span class="quand">' + r[0] + '<br>' + r[1] + '</span><p><b>' + r[2] + '</b>' + r[3] + '</p></div>';
          }).join('') + '<h5>' + T.aOptimiser + '</h5>' +
          T.conseils.map(function (r) {
            return '<div class="carte gain"><p><b>' + r[0] + '</b>' + r[1] + '</p></div>';
          }).join('');
        c.getBoundingClientRect();
        c.querySelectorAll('.carte').forEach(function (e, i) {
          apres(150 + i * 420, function () { e.classList.add('vue'); });
        });
      });
    },

    coach: function (c) {
      var chiffres = [nombre(5698), nombre(214870), nombre(163) + ' M', nombre(380)];
      var note = NOTE.replace('.', en ? '.' : ',') + ' / 5';
      var pages = [
        '<h4>' + T.note + '</h4><span class="grand">' + note + '</span>' + grille(T.statsCoach, chiffres) +
          '<h4>' + T.nuage + '</h4>' + nuage() + '<h4>' + T.courbe + '</h4>' + courbe(),
        '<div class="coach-note"><h4>' + T.bilanTitre + '</h4><p>' + T.bilan + '</p></div>' +
          '<div class="coach-note astuce"><h4>' + T.astuceTitre + '</h4><b>' + T.astuce[0] + '</b><p>' + T.astuce[1] + '</p><p class="exemple">' + T.astuce[2] + '</p></div>'
      ];
      c.classList.add('c-mac');
      c.innerHTML = barreMac(note);
      function page(i) {
        var ancienne = c.querySelector('.mac-menu');
        if (ancienne) ancienne.remove();
        c.insertAdjacentHTML('beforeend', '<div class="mac-menu">' + pages[i] + '</div>');
        if (!calme) apres(7000, function () { page(1 - i); });
      }
      apres(300, function () { page(0); });
    },

    widgets: function (c) {
      var heures = [36041, 38654, 36601, 28022, 23518, 12058, 12492, 9772, 10569, 18807, 14798, 13262, 10813, 6386, 4044, 20858, 18602, 24652, 7054];
      var etiquettes = heures.map(function (_, i) { return [0, 7, 13, 18].indexOf(i) >= 0 ? (i + 5) + ' h' : ''; });
      var virgule = function (t) { return en ? t : t.replace('.', ','); };
      var occupation = [3, 0, 14];
      var pages = [
        function (zone) {
          zone.innerHTML = '<h4>' + T.frappes + '</h4><span class="grand">' + nombre(29033) + '</span>' +
            grille(T.statsFrappes, [nombre(41909), nombre(55256), nombre(450), pct(5)]) + '<h4>' + T.parHeure + '</h4>' + barres(heures, etiquettes);
          apres(250, function () { monterBarres(zone, heures); });
        },
        function (zone) {
          zone.innerHTML = '<h4>' + T.processeur + '</h4><span class="grand">17 %</span>' +
            grille(T.statsPerf, [pct(43), virgule('18.8') + T.memoire, pct(21), virgule('3.8') + T.go]) + '<h4>' + T.quiOccupe + '</h4>' +
            '<div class="jauges">' + T.occupants.map(function (n, i) { return '<div><span>' + n + '</span><i><b></b></i><em>' + pct(occupation[i]) + '</em></div>'; }).join('') + '</div>';
          apres(250, function () {
            zone.querySelectorAll('.jauges b').forEach(function (b, i) { b.style.width = (occupation[i] / 17 * 100) + '%'; });
          });
        },
        function (zone) {
          zone.innerHTML = '<h4>' + T.chrono + '</h4><span class="grand">6 h 43</span>' +
            grille(T.statsChrono, ['6 h 45', '3', '31 h 30', T.arrondi]) + '<h4>' + T.frise + '</h4>' +
            '<div class="frise"><i></i><i></i><i></i></div>' +
            '<div class="frise-heures"><span>8 h</span><span>12 h</span><span>16 h</span></div>';
        }
      ];
      var picto = [
        '<path d="M1 3.5h14a.9.9 0 0 1 .9.9v7.2a.9.9 0 0 1-.9.9H1a.9.9 0 0 1-.9-.9V4.4A.9.9 0 0 1 1 3.5Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 6.4h1.4M6 6.4h1.4M9 6.4h1.4M12 6.4h1.4M4.6 9.6h6.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
        '<path d="M2 12.6a7 7 0 1 1 12 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M8 9.4 11 5.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="9.6" r="1.2" fill="currentColor"/>',
        '<circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.2V8l2.6 1.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
      ];
      var textes = [nombre(29033), pct(17), '6 h 43'];
      c.classList.add('c-mac');
      c.innerHTML = '<p class="mac-lieu">' + T.barreMac + '</p><div class="mac-barre mac-widgets">' + textes.map(function (t, i) {
        return '<span class="mac-item"><svg viewBox="0 0 16 16" aria-hidden="true">' + picto[i] + '</svg>' + t + '</span>';
      }).join('') + '</div>';
      var items = c.querySelectorAll('.mac-item');
      function page(i) {
        var ancienne = c.querySelector('.mac-menu');
        if (ancienne) ancienne.remove();
        items.forEach(function (e, n) { e.classList.toggle('actif', n === i); });
        c.insertAdjacentHTML('beforeend', '<div class="mac-menu"></div>');
        pages[i](c.querySelector('.mac-menu'));
        if (!calme) apres(5500, function () { page((i + 1) % pages.length); });
      }
      apres(300, function () { page(0); });
    }
  };

  function nombre(n) { return n.toLocaleString(T.locale); }
  function pct(n) { return n + (en ? '%' : ' %'); }

  function grille(noms, valeurs) {
    return '<dl class="grille">' + noms.map(function (n, i) { return '<div><dt>' + n + '</dt><dd>' + valeurs[i] + '</dd></div>'; }).join('') + '</dl>';
  }

  function nuage() {
    var jours = 36;
    var points = NUAGE.map(function (v, i) {
      var note = v % 10, x = 2 + Math.floor(v / 10) / jours * 96;
      var y = 22 - (note - 1) * 5 + ((i * 37 % 11) - 5) * 0.32;
      return '<circle class="n' + note + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="0.65"/>';
    }).join('');
    return '<svg class="nuage" viewBox="0 0 100 25" role="img" aria-label="' + T.nuage + '">' + points + '</svg>';
  }

  function courbe() {
    var n = MOYENNES.length, gauche = 8, largeur = 90, haut = 3, hauteur = 46;
    var x = function (i) { return gauche + i / (n - 1) * largeur; };
    var y = function (note) { return haut + (5 - note) / 2 * hauteur; };
    var maxVolume = Math.max.apply(null, VOLUMES);
    var lignes = [5, 4, 3].map(function (v) {
      return '<line x1="' + gauche + '" x2="100" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="0" y="' + (y(v) + 1.3) + '">' + v + '</text>';
    }).join('');
    var volumes = VOLUMES.map(function (v, i) {
      var h = v / maxVolume * 12;
      return '<rect x="' + (x(i) - 0.9).toFixed(1) + '" y="' + (haut + hauteur - h).toFixed(1) + '" width="1.8" height="' + h.toFixed(1) + '"/>';
    }).join('');
    var trace = MOYENNES.map(function (m, i) { return x(i).toFixed(1) + ',' + y(Math.max(m, 3)).toFixed(1); }).join(' ');
    var points = MOYENNES.map(function (m, i) { return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(Math.max(m, 3)).toFixed(1) + '" r="0.9"/>'; }).join('');
    return '<svg class="courbe" viewBox="0 0 100 52" role="img" aria-label="' + T.courbe + '">' + lignes + volumes + '<polyline points="' + trace + '"/>' + points + '</svg>';
  }

  function barres(valeurs, etiquettes) {
    return '<div class="barres">' + valeurs.map(function (_, i) { return '<div class="barre"><b></b><span>' + etiquettes[i] + '</span></div>'; }).join('') + '</div>';
  }

  function monterBarres(c, valeurs) {
    var max = Math.max.apply(null, valeurs);
    c.querySelectorAll('.barre b').forEach(function (b, i) { b.style.height = (valeurs[i] / max * 78) + '%'; });
  }

  function blocPb(titre, valeur, volets, genre, cible) {
    var repere = cible ? '<path class="pb-repere" d="M80.4 40.1 95.7 35.2"/>' : '';
    return '<section class="pb-bloc ' + genre + '"><h4>' + titre + (cible ? '<small>' + T.pbCible + ' ' + pct(cible) + '</small>' : '') + '</h4><div class="pb-rangee">' +
      '<svg class="pb-jauge" viewBox="0 0 100 56" role="img" aria-label="' + titre + ' ' + pct(valeur) + '"><path class="pb-fond" pathLength="100" d="M10 50A40 40 0 0 1 90 50"/><path class="pb-arc" data-v="' + valeur + '" pathLength="100" d="M10 50A40 40 0 0 1 90 50"/>' + repere + '<text x="50" y="50">' + pct(valeur) + '</text></svg>' +
      '<div class="pb-tuiles">' + volets.map(function (v, i) { return '<div><small>' + T.pbVolet + (i + 1) + '</small><b>' + pct(v) + '</b></div>'; }).join('') + '</div></div></section>';
  }

  function fil(c, noms) {
    c.innerHTML = '<div class="vue-zone"></div><ol class="fil"><li>' + noms.join('</li><li>') + '</li></ol>';
    var zone = c.firstChild, puces = c.lastChild.children;
    return function (i, html) {
      zone.innerHTML = '<div class="etape">' + html + '</div>';
      for (var n = 0; n < puces.length; n++) puces[n].classList.toggle('fait', n <= i);
      return zone.firstChild;
    };
  }

  function ecrireChat(vue, messages) {
    messages.forEach(function (m, i) {
      apres(300 + i * 650, function () {
        var agent = m[0] === 'agent';
        vue.querySelector('.chat').insertAdjacentHTML('beforeend', '<div class="tour ' + m[0] + '">' + (agent ? PICTO : '') + '<div><small>' + (agent ? T.nomBacklog : T.moi) + '</small><div class="bulle ' + m[0] + '">' + m[1] + '</div></div></div>');
      });
    });
  }

  function enteteAgent(nom, sousTitre) {
    return '<div class="t-entete a-picto">' + PICTO + '<div><b>' + nom + '</b><span>' + sousTitre + '</span></div></div>';
  }

  function ligneBacklog(l) {
    return '<div class="ado-ligne"><i></i><span class="id">' + l[0] + '</span><span class="titre">' + l[1] + '</span><em>' + l[2] + '</em></div>';
  }

  function backlog() {
    return '<div class="ado-entete"><b>Azure DevOps</b><span>' + T.sprint + '</span></div><div class="ado-liste">' + T.lignesBacklog.map(ligneBacklog).join('') + '</div>';
  }

  function ajouterStory(vue) {
    vue.querySelector('.ado-liste').insertAdjacentHTML('afterbegin', ligneBacklog([T.nouvelle[0], T.nouvelle[1], T.nouveau]));
    vue.querySelector('.ado-ligne').classList.add('pop');
  }

  function barreMac(texte) {
    return '<div class="mac-barre"><span class="mac-item">' + texte + '</span></div>';
  }

  function montrer(nom, reveler) {
    arreter();
    ecran.parentNode.dataset.scene = nom;
    var anciennes = Array.prototype.slice.call(ecran.children);
    var couche = document.createElement('div');
    couche.className = 'couche c-' + nom + (reveler ? ' revele' : '');
    ecran.appendChild(couche);
    scenes[nom](couche);
    couche.getBoundingClientRect();
    couche.classList.add('visible');
    setTimeout(function () { anciennes.forEach(function (a) { a.remove(); }); }, reveler ? 1100 : 400);
  }

  function envol(scene) {
    var p = ecran.querySelector('.nom-ecrit');
    if (calme || !p) {
      document.body.classList.remove('accueil');
      montrer(scene);
      return;
    }
    arreter();
    var curseur = p.querySelector('.curseur');
    if (curseur) curseur.remove();
    p.firstChild.textContent = NOM;
    p.querySelector('.reste').textContent = '';
    var depart = p.firstChild.getBoundingClientRect();
    var arrivee = document.querySelector('.qui h1 .n').getBoundingClientRect();
    var vol = document.createElement('div');
    vol.className = 'nom-vol';
    vol.textContent = NOM;
    vol.style.left = depart.left + 'px';
    vol.style.top = depart.top + 'px';
    vol.style.fontSize = getComputedStyle(p).fontSize;
    document.body.appendChild(vol);
    p.style.visibility = 'hidden';
    var titre = ecran.querySelector('.nom-titre');
    if (titre) titre.classList.remove('vue');
    document.body.classList.add('part');
    var fin = 'translate(' + (arrivee.left - depart.left) + 'px, ' + (arrivee.top - depart.top) + 'px) scale(' + (arrivee.width / depart.width) + ')';
    vol.animate([
      { transform: 'none', color: '#237220' },
      { transform: fin, color: '#ffffff' }
    ], { duration: 1150, easing: 'cubic-bezier(0.65, 0, 0.15, 1)', fill: 'forwards' });
    setTimeout(function () { montrer(scene, true); }, 300);
    setTimeout(function () {
      document.body.classList.remove('accueil');
      vol.remove();
    }, 1170);
  }

  var boutons = Array.prototype.slice.call(document.querySelectorAll('.titre-projet'));

  ecran.parentNode.insertAdjacentHTML('beforeend', '<div class="statut" aria-hidden="true"><span class="heure">9:41</span><span class="ile"></span><span class="icones">' +
    '<svg viewBox="0 0 18 12"><rect y="8" width="3" height="4" rx="0.8"/><rect x="5" y="5.5" width="3" height="6.5" rx="0.8"/><rect x="10" y="3" width="3" height="9" rx="0.8"/><rect x="15" width="3" height="12" rx="0.8"/></svg>' +
    '<svg viewBox="0 0 17 12"><path d="M1 4.6a10.6 10.6 0 0 1 15 0M3.6 7.2a6.9 6.9 0 0 1 9.8 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="8.5" cy="10.2" r="1.5"/></svg>' +
    '<svg viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.6" fill="none" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="20" height="9" rx="2.2"/><path d="M25 4.4v4.2c0.9-0.3 1.5-1.1 1.5-2.1s-0.6-1.8-1.5-2.1Z" opacity="0.5"/></svg>' +
    '</span></div><div class="indicateur" aria-hidden="true"></div>');

  var etroit = matchMedia('(max-width: 760px)');
  function sousLiPhone(b) {
    var bas = document.querySelector('.socle').getBoundingClientRect().bottom - 8;
    window.scrollBy({ top: b.getBoundingClientRect().top - bas, behavior: calme ? 'auto' : 'smooth' });
  }

  function fermer(b) {
    b.setAttribute('aria-expanded', 'false');
    document.getElementById(b.getAttribute('aria-controls')).classList.remove('ouvert');
  }

  boutons.forEach(function (b) {
    b.addEventListener('click', function () {
      var ouvrir = b.getAttribute('aria-expanded') !== 'true';
      boutons.forEach(fermer);
      if (!ouvrir) return;
      b.setAttribute('aria-expanded', 'true');
      document.getElementById(b.getAttribute('aria-controls')).classList.add('ouvert');
      if (document.body.classList.contains('accueil')) envol(b.dataset.scene);
      else montrer(b.dataset.scene);
      if (etroit.matches) setTimeout(function () { sousLiPhone(b); }, 420);
    });
  });

  ['accueil', 'chene', 'config'].forEach(function (nom) {
    new Image().src = racine + 'assets/img/belmont-' + nom + '.jpg';
  });

  montrer('accueil');
})();
