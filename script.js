document.addEventListener("DOMContentLoaded", () => {

    // === DONNEES ===
    const dp = {
        1:"Ain",2:"Aisne",3:"Allier",4:"Alpes-de-Haute-Provence",5:"Hautes-Alpes",
        6:"Alpes-Maritimes",7:"Ardèche",8:"Ardennes",9:"Ariège",10:"Aube",
        11:"Aude",12:"Aveyron",13:"Bouches-du-Rhône",14:"Calvados",15:"Cantal",
        16:"Charente",17:"Charente-Maritime",18:"Cher",19:"Corrèze",20:"Côte-d'Or",
        21:"Côtes-d'Armor",22:"Creuse",23:"Dordogne",24:"Doubs",25:"Drôme",
        26:"Eure",27:"Eure-et-Loir",28:"Finistère",29:"Gard",30:"Haute-Garonne",
        31:"Gers",32:"Gironde",33:"Hérault",34:"Ille-et-Vilaine",35:"Indre",
        36:"Indre-et-Loire",37:"Isère",38:"Jura",39:"Landes",40:"Loir-et-Cher",
        41:"Loire",42:"Haute-Loire",43:"Loire-Atlantique",44:"Loiret",45:"Lot",
        46:"Lot-et-Garonne",47:"Lozère",48:"Maine-et-Loire",49:"Manche",50:"Marne",
        51:"Haute-Marne",52:"Mayenne",53:"Meurthe-et-Moselle",54:"Meuse",55:"Morbihan",
        56:"Moselle",57:"Nièvre",58:"Nord",59:"Oise",60:"Orne",61:"Pas-de-Calais",
        62:"Puy-de-Dôme",63:"Pyrénées-Atlantiques",64:"Hautes-Pyrénées",65:"Pyrénées-Orientales",
        66:"Bas-Rhin",67:"Haut-Rhin",68:"Rhône",69:"Haute-Saône",70:"Saône-et-Loire",
        71:"Sarthe",72:"Savoie",73:"Haute-Savoie",74:"Paris",75:"Seine-Maritime",
        76:"Seine-et-Marne",77:"Yvelines",78:"Deux-Sèvres",79:"Somme",80:"Tarn",
        81:"Tarn-et-Garonne",82:"Var",83:"Vaucluse",84:"Vendée",85:"Vienne",
        86:"Haute-Vienne",87:"Vosges",88:"Yonne",89:"Territoire de Belfort",
        90:"Essonne",91:"Hauts-de-Seine",92:"Seine-Saint-Denis",93:"Val-de-Marne",
        94:"Val-d'Oise","2A":"Corse-du-Sud","2B":"Haute-Corse"
    };

    const paysCapitales = {
        "France":"Paris","Espagne":"Madrid","Italie":"Rome","Allemagne":"Berlin",
        "Royaume-Uni":"Londres","Portugal":"Lisbonne","Suisse":"Berne","Belgique":"Bruxelles",
        "Pays-Bas":"Amsterdam","Grèce":"Athènes","Suède":"Stockholm","Norvège":"Oslo",
        "Danemark":"Copenhague","Pologne":"Varsovie","Canada":"Ottawa","États-Unis":"Washington D.C.",
        "Mexique":"Mexico","Brésil":"Brasilia","Argentine":"Buenos Aires","Japon":"Tokyo",
        "Chine":"Pékin","Inde":"New Delhi","Australie":"Canberra","Maroc":"Rabat","Égypte":"Le Caire"
    };

    let profil="", departementStats={}, capitaleStats={}, currentQuestion=null, currentType=null;

    const profilSection=document.getElementById("profil-section");
    const menuJeux=document.getElementById("menu-jeux");
    const quizSection=document.getElementById("quiz-section");
    const questionEl=document.getElementById("question");
    const reponseEl=document.getElementById("reponse");
    const correctionEl=document.getElementById("correction");
    const statsSection=document.getElementById("stats-section");
    const statsCards=document.getElementById("stats-cards");

    // --- Profil ---
    document.getElementById("btn-profil").addEventListener("click", () => {
        const input = document.getElementById("profil").value.trim();
        if(!input) return alert("Entrez un profil !");
        profil=input;
        const saved = localStorage.getItem("stats_"+profil);
        if(saved){
            const stats=JSON.parse(saved);
            departementStats=stats.departements||{};
            capitaleStats=stats.capitales||{};
        } else { departementStats={}; capitaleStats={}; }
        profilSection.classList.add("hidden");
        menuJeux.classList.remove("hidden");
    });

    // --- Menu ---
    document.getElementById("btn-departements").addEventListener("click",()=>startQuiz("departement"));
    document.getElementById("btn-capitales").addEventListener("click",()=>startQuiz("capitale"));
    document.getElementById("btn-suivant").addEventListener("click",()=>startQuiz(currentType));
    document.getElementById("btn-retour").addEventListener("click",()=>{
        quizSection.classList.add("hidden");
        menuJeux.classList.remove("hidden");
    });
    document.getElementById("btn-stats").addEventListener("click",showStats);
    document.getElementById("btn-quit").addEventListener("click",()=>{
        if(confirm("Voulez-vous vraiment quitter le site ?")) window.location.href="https://www.google.com";
    });

    // --- Quiz ---
    document.getElementById("btn-valider").addEventListener("click", validerReponse);
    reponseEl.addEventListener("keydown", e=>{ if(e.key==="Enter") validerReponse(); });

    function startQuiz(type){
        currentType=type;
        menuJeux.classList.add("hidden");
        quizSection.classList.remove("hidden");
        reponseEl.value="";
        correctionEl.textContent="";
        if(type==="departement"){
            const keys=Object.keys(dp);
            currentQuestion=keys[Math.floor(Math.random()*keys.length)];
            questionEl.textContent=`Quel est le nom du département n°${currentQuestion} ?`;
        } else {
            const keys=Object.keys(paysCapitales);
            currentQuestion=keys[Math.floor(Math.random()*keys.length)];
            questionEl.textContent=`Quelle est la capitale de ${currentQuestion} ?`;
        }
    }

    function validerReponse(){
        if(!currentQuestion) return;
        const answer=reponseEl.value.trim();
        if(!answer){ alert("Veuillez entrer une réponse !"); return; }
        let correct=false;
        if(currentType==="departement"){
            const deptName=dp[currentQuestion];
            correct=(answer.toLowerCase()===deptName.toLowerCase());
            if(!departementStats[deptName]) departementStats[deptName]={bonnes:0,mauvaises:0};
            departementStats[deptName][correct?"bonnes":"mauvaises"]++;
        } else {
            const capName=paysCapitales[currentQuestion];
            correct=(answer.toLowerCase()===capName.toLowerCase());
            if(!capitaleStats[capName]) capitaleStats[capName]={bonnes:0,mauvaises:0};
            capitaleStats[capName][correct?"bonnes":"mauvaises"]++;
        }
        correctionEl.textContent=correct?"✅ Bonne réponse !":`❌ Mauvaise réponse. C'était : ${currentType==="departement"?dp[currentQuestion]:paysCapitales[currentQuestion]}`;
        reponseEl.value="";
        reponseEl.focus();
        sauvegarderStats();
    }

    function sauvegarderStats(){
        const stats={departements:departementStats,capitales:capitaleStats};
        localStorage.setItem("stats_"+profil, JSON.stringify(stats));
    }

    function showStats(){
        menuJeux.classList.add("hidden");
        quizSection.classList.add("hidden");
        statsSection.classList.remove("hidden");
        statsCards.innerHTML="";
        const types={departement:departementStats,capitale:capitaleStats};
        for(const type in types){
            for(const key in types[type]){
                const s=types[type][key];
                const card=document.createElement("div");
                card.className="stats-card";
                card.innerHTML=`<h3>${key} (${type})</h3>
                    <div class="bar-container">
                        <div class="bar bonnes" style="width:${s.bonnes*10}px;"></div>
                        <div class="bar mauvaises" style="width:${s.mauvaises*10}px;"></div>
                    </div>
                    <p>✅ ${s.bonnes} - ❌ ${s.mauvaises}</p>`;
                statsCards.appendChild(card);
            }
        }
    }

    document.getElementById("btn-stats-retour").addEventListener("click",()=>{
        statsSection.classList.add("hidden");
        menuJeux.classList.remove("hidden");
    });

});
