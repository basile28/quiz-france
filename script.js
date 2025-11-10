// === DONNEES ===
const dp = {
    1: "Ain",2: "Aisne",3: "Allier",4: "Alpes de Haute Provence",5: "Hautes Alpes",
    6: "Alpes Maritimes",7: "Ardèche",8: "Ardennes",9: "Ariège",10: "Aube",
    11: "Aude",12: "Aveyron",13: "Bouches-du-Rhône",14: "Calvados",15: "Cantal",
    16: "Charente",17: "Charente-Maritime",18: "Cher",19: "Corrèze",20: "Côte-d'Or",
    21: "Côtes-d'Armor",22: "Creuse",23: "Dordogne",24: "Doubs",25: "Drôme",
    26: "Eure",27: "Eure-et-Loir",28: "Finistère",29: "Gard",30: "Haute-Garonne",
    31: "Gers",32: "Gironde",33: "Hérault",34: "Ille-et-Vilaine",35: "Indre",
    36: "Indre-et-Loire",37: "Isère",38: "Jura",39: "Landes",40: "Loir-et-Cher",
    41: "Loire",42: "Haute-Loire",43: "Loire-Atlantique",44: "Loiret",45: "Lot",
    46: "Lot-et-Garonne",47: "Lozère",48: "Maine-et-Loire",49: "Manche",50: "Marne",
    51: "Haute-Marne",52: "Mayenne",53: "Meurthe-et-Moselle",54: "Meuse",55: "Morbihan",
    56: "Moselle",57: "Nièvre",58: "Nord",59: "Oise",60: "Orne",61: "Pas-de-Calais",
    62: "Puy-de-Dôme",63: "Pyrénées-Atlantiques",64: "Hautes-Pyrénées",65: "Pyrénées-Orientales",
    66: "Bas-Rhin",67: "Haut-Rhin",68: "Rhône",69: "Haute-Saône",70: "Saône-et-Loire",
    71: "Sarthe",72: "Savoie",73: "Haute-Savoie",74: "Paris",75: "Seine-Maritime",
    76: "Seine-et-Marne",77: "Yvelines",78: "Deux-Sèvres",79: "Somme",80: "Tarn",
    81: "Tarn-et-Garonne",82: "Var",83: "Vaucluse",84: "Vendée",85: "Vienne",
    86: "Haute-Vienne",87: "Vosges",88: "Yonne",89: "Territoire de Belfort",
    90: "Essonne",91: "Hauts-de-Seine",92: "Seine-Saint-Denis",93: "Val-de-Marne",
    94: "Val-d'Oise"
};

const paysCapitales = {
    "France":"Paris","Espagne":"Madrid","Italie":"Rome","Allemagne":"Berlin",
    "Royaume-Uni":"Londres","Portugal":"Lisbonne","Suisse":"Berne","Belgique":"Bruxelles",
    "Pays-Bas":"Amsterdam","Grèce":"Athènes","Suède":"Stockholm","Norvège":"Oslo",
    "Danemark":"Copenhague","Pologne":"Varsovie","Canada":"Ottawa","États-Unis":"Washington D.C.",
    "Mexique":"Mexico","Brésil":"Brasilia","Argentine":"Buenos Aires","Japon":"Tokyo",
    "Chine":"Pékin","Inde":"New Delhi","Australie":"Canberra","Maroc":"Rabat","Égypte":"Le Caire"
};


let profil = "";
let departementStats = {};
let capitaleStats = {};
let currentQuestion = null;
let currentType = null;

const profilSection = document.getElementById("profil-section");
const menuJeux = document.getElementById("menu-jeux");
const quizSection = document.getElementById("quiz-section");
const statsSection = document.getElementById("stats-section");
const questionEl = document.getElementById("question");
const reponseEl = document.getElementById("reponse");
const correctionEl = document.getElementById("correction");
const statsText = document.getElementById("stats-text");
const nomProfilEl = document.getElementById("nom-profil");

// Valider Profil
document.getElementById("btn-profil").addEventListener("click", () => {
    const input = document.getElementById("profil").value.trim();
    if(input === "") return alert("Entrez un profil !");
    profil = input;
    // Charger stats depuis localStorage
    const savedStats = localStorage.getItem(profil);
    if(savedStats){
        const obj = JSON.parse(savedStats);
        departementStats = obj.departementStats || {};
        capitaleStats = obj.capitaleStats || {};
    } else {
        departementStats = {};
        capitaleStats = {};
    }
    nomProfilEl.textContent = profil;
    profilSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});

// Boutons Quiz
document.getElementById("btn-departements").addEventListener("click", () => startQuiz("departement"));
document.getElementById("btn-capitales").addEventListener("click", () => startQuiz("capitale"));

// Bouton Statistiques
document.getElementById("btn-stats").addEventListener("click", () => {
    menuJeux.classList.add("hidden");
    statsSection.classList.remove("hidden");
    displayStats();
});
document.getElementById("btn-retour-stats").addEventListener("click", () => {
    statsSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});

// Quiz
document.getElementById("btn-retour").addEventListener("click", () => {
    quizSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
    saveStats();
});

document.getElementById("btn-valider").addEventListener("click", () => {
    const answer = reponseEl.value.trim().toLowerCase();
    let correct = false;

    if(currentType === "departement"){
        if(answer === dp[currentQuestion]) correct = true;
        departementStats[currentQuestion] = departementStats[currentQuestion] || {bonnes:0, mauvaises:0};
        departementStats[currentQuestion][correct ? "bonnes" : "mauvaises"]++;
    } else {
        if(answer === paysCapitales[currentQuestion].toLowerCase()) correct = true;
        capitaleStats[currentQuestion] = capitaleStats[currentQuestion] || {bonnes:0, mauvaises:0};
        capitaleStats[currentQuestion][correct ? "bonnes" : "mauvaises"]++;
    }

    correctionEl.textContent = correct ? "✅ Bonne réponse !" :
        `❌ Mauvaise réponse. C’était : ${currentType==="departement"?dp[currentQuestion]:paysCapitales[currentQuestion]}`;

    saveStats();
});

document.getElementById("btn-suivant").addEventListener("click", () => startQuiz(currentType));

function startQuiz(type){
    currentType = type;
    menuJeux.classList.add("hidden");
    quizSection.classList.remove("hidden");
    reponseEl.value = "";
    correctionEl.textContent = "";

    if(type === "departement"){
        const keys = Object.keys(dp);
        currentQuestion = keys[Math.floor(Math.random()*keys.length)];
        questionEl.textContent = `Quel est le nom du département n°${currentQuestion} ?`;
    } else {
        const keys = Object.keys(paysCapitales);
        currentQuestion = keys[Math.floor(Math.random()*keys.length)];
        questionEl.textContent = `Quelle est la capitale de ${currentQuestion} ?`;
    }
}

function displayStats(){
    let texte = "📍 Départements :\n";
    for(const key in departementStats){
        const stat = departementStats[key];
        const total = stat.bonnes + stat.mauvaises;
        const taux = total ? (stat.bonnes/total*100).toFixed(1) : 0;
        texte += `${dp[key]} : ${stat.bonnes}✓ / ${stat.mauvaises}✗ (${taux}%)\n`;
    }
    texte += "\n🌆 Capitales :\n";
    for(const key in capitaleStats){
        const stat = capitaleStats[key];
        const total = stat.bonnes + stat.mauvaises;
        const taux = total ? (stat.bonnes/total*100).toFixed(1) : 0;
        texte += `${key} : ${stat.bonnes}✓ / ${stat.mauvaises}✗ (${taux}%)\n`;
    }
    statsText.textContent = texte;
}

function saveStats(){
    if(profil){
        const obj = {departementStats, capitaleStats};
        localStorage.setItem(profil, JSON.stringify(obj));
    }
}
