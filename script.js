// -------------------- DONNÉES --------------------
const dp = {
1:"ain",2:"aisne",3:"allier",4:"alpes de haute provence",5:"hautes alpes",6:"alpes maritimes",7:"ardeche",
8:"ardennes",9:"ariege",10:"aube",11:"aude",12:"aveyron",13:"bouches du rhone",14:"calvados",15:"cantal",
16:"charente",17:"charente maritime",18:"cher",19:"correze",20:"cote d'or",21:"cote d'armor",22:"creuse",
23:"dordogne",24:"doubs",25:"drome",26:"eure",27:"eure et loir",28:"finistere",29:"gard",30:"haute garonne",
31:"gers",32:"gironde",33:"herault",34:"ille et vilaine",35:"indre",36:"indre et loire",37:"isere",38:"jura",
39:"landes",40:"loir et cher",41:"loire",42:"haute loire",43:"loire atlantique",44:"loiret",45:"lot",
46:"lot et garonne",47:"lozere",48:"maine et loire",49:"manche",50:"marne",51:"haute marne",52:"mayenne",
53:"meurthe et moselle",54:"meuse",55:"morbihan",56:"moselle",57:"nievre",58:"nord",59:"oise",60:"orne",
61:"pas de calais",62:"puy de dome",63:"pyrenees atlantiques",64:"hautes pyrenees",65:"pyrenees orientales",
66:"bas rhin",67:"haut rhin",68:"rhone",69:"haute saone",70:"saone et loire",71:"sarthe",72:"savoie",
73:"haute savoie",74:"paris",75:"seine maritime",76:"seine et marne",77:"yvelines",78:"deux sevres",
79:"somme",80:"tarn",81:"tarn et garonne",82:"var",83:"vaucluse",84:"vendee",85:"vienne",86:"haute vienne",
87:"vosges",88:"yonne",89:"territoire de belfort",90:"essonne",91:"hauts de seine",92:"seine saint denis",
93:"val de marne",94:"val d'oise"
};

const paysCapitales = {
"France":"Paris","Espagne":"Madrid","Italie":"Rome","Allemagne":"Berlin","Royaume-Uni":"Londres",
"Portugal":"Lisbonne","Suisse":"Berne","Belgique":"Bruxelles","Pays-Bas":"Amsterdam","Grèce":"Athènes",
"Suède":"Stockholm","Norvège":"Oslo","Danemark":"Copenhague","Pologne":"Varsovie","Canada":"Ottawa",
"États-Unis":"Washington D.C.","Mexique":"Mexico","Brésil":"Brasilia","Argentine":"Buenos Aires",
"Japon":"Tokyo","Chine":"Pékin","Inde":"New Delhi","Australie":"Canberra","Maroc":"Rabat","Égypte":"Le Caire"
};

const ADMIN_PASSWORD = "123";

// -------------------- VARIABLES --------------------
let profil = "";
let departementStats = {};
let capitaleStats = {};
let currentQuestion = null;
let currentType = null;

// -------------------- ELEMENTS --------------------
const profilSection = document.getElementById("profil-section");
const menuJeux = document.getElementById("menu-jeux");
const quizSection = document.getElementById("quiz-section");
const questionEl = document.getElementById("question");
const reponseEl = document.getElementById("reponse");
const correctionEl = document.getElementById("correction");
const statsSection = document.getElementById("stats-section");
const statsText = document.getElementById("stats-text");
const btnAdmin = document.getElementById("btn-admin");

// -------------------- PROFIL --------------------
function loadProfilStats() {
    const data = JSON.parse(localStorage.getItem("quizFranceProfiles") || "{}");
    if(data[profil]) {
        departementStats = data[profil].departements;
        capitaleStats = data[profil].capitales;
    } else {
        departementStats = {};
        capitaleStats = {};
    }
}

function saveProfilStats() {
    const data = JSON.parse(localStorage.getItem("quizFranceProfiles") || "{}");
    data[profil] = {departements: departementStats, capitales: capitaleStats};
    localStorage.setItem("quizFranceProfiles", JSON.stringify(data));
}

// -------------------- ÉVÉNEMENTS --------------------
document.getElementById("btn-profil").addEventListener("click", () => {
    const input = document.getElementById("profil").value.trim();
    if(!input) return alert("Entrez un profil");
    profil = input;
    loadProfilStats();

    profilSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");

    if(profil.toLowerCase() === "basile") btnAdmin.classList.remove("hidden");
});

document.getElementById("btn-changer-profil").addEventListener("click", () => {
    profilSection.classList.remove("hidden");
    menuJeux.classList.add("hidden");
});

document.getElementById("btn-departements").addEventListener("click", () => startQuiz("departement"));
document.getElementById("btn-capitales").addEventListener("click", () => startQuiz("capitale"));
document.getElementById("btn-retour").addEventListener("click", () => {
    quizSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});
document.getElementById("btn-suivant").addEventListener("click", () => startQuiz(currentType));
document.getElementById("btn-valider").addEventListener("click", () => checkAnswer());
document.getElementById("btn-stats").addEventListener("click", showStats);
document.getElementById("btn-stats-retour").addEventListener("click", () => {
    statsSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});
btnAdmin.addEventListener("click", () => {
    const pwd = prompt("Entrez le mot de passe admin :");
    if(pwd === ADMIN_PASSWORD) {
        if(confirm("Réinitialiser toutes les stats ?")) {
            localStorage.removeItem("quizFranceProfiles");
            alert("Stats réinitialisées !");
        }
    } else alert("Mot de passe incorrect !");
});

// -------------------- QUIZ --------------------
function startQuiz(type) {
    currentType = type;
    menuJeux.classList.add("hidden");
    quizSection.classList.remove("hidden");
    reponseEl.value = "";
    correctionEl.textContent = "";

    if(type === "departement") {
        const keys = Object.keys(dp);
        currentQuestion = keys[Math.floor(Math.random()*keys.length)];
        questionEl.textContent = `Quel est le nom du département : ${currentQuestion} ?`;
    } else if(type === "capitale") {
        const keys = Object.keys(paysCapitales);
        currentQuestion = keys[Math.floor(Math.random()*keys.length)];
        questionEl.textContent = `Quelle est la capitale de : ${currentQuestion} ?`;
    }
}

function checkAnswer() {
    const answer = reponseEl.value.trim().toLowerCase();
    let correct = false;

    if(currentType === "departement") {
        correct = answer === dp[currentQuestion].toLowerCase();
        departementStats[currentQuestion] = departementStats[currentQuestion] || {bonnes:0,mauvaises:0};
        departementStats[currentQuestion][correct?"bonnes":"mauvaises"]++;
    } else if(currentType === "capitale") {
        correct = answer === paysCapitales[currentQuestion].toLowerCase();
        capitaleStats[currentQuestion] = capitaleStats[currentQuestion] || {bonnes:0,mauvaises:0};
        capitaleStats[currentQuestion][correct?"bonnes":"mauvaises"]++;
    }

    correctionEl.textContent = correct ? "✅ Bonne réponse !" : `❌ Mauvaise réponse. C'était : ${currentType==="departement"?dp[currentQuestion]:paysCapitales[currentQuestion]}`;
    saveProfilStats();
}

// -------------------- STATISTIQUES --------------------
function showStats() {
    menuJeux.classList.add("hidden");
    statsSection.classList.remove("hidden");

    let txt = "📍 Départements :\n";
    Object.keys(departementStats).forEach(dep => {
        const s = departementStats[dep];
        const total = s.bonnes + s.mauvaises;
        const pct = total ? ((s.bonnes/total)*100).toFixed(1) : 0;
        txt += `${dp[dep]} : ${pct}% (${s.bonnes}✓/${s.mauvaises}✗)\n`;
    });

    txt += "\n🌆 Capitales :\n";
    Object.keys(capitaleStats).forEach(p => {
        const s = capitaleStats[p];
        const total = s.bonnes + s.mauvaises;
        const pct = total ? ((s.bonnes/total)*100).toFixed(1) : 0;
        txt += `${p} : ${pct}% (${s.bonnes}✓/${s.mauvaises}✗)\n`;
    });

    statsText.textContent = txt || "Aucune donnée disponible.";
}
