// ==========================
// Données du quiz
// ==========================

const dp = {
    1: "Ain", 2: "Aisne", 3: "Allier", 4: "Alpes-de-Haute-Provence", 5: "Hautes-Alpes",
    6: "Alpes-Maritimes", 7: "Ardèche", 8: "Ardennes", 9: "Ariège", 10: "Aube",
    11: "Aude", 12: "Aveyron", 13: "Bouches-du-Rhône", 14: "Calvados", 15: "Cantal",
    16: "Charente", 17: "Charente-Maritime", 18: "Cher", 19: "Corrèze", 21: "Côte-d’Or",
    22: "Côtes-d’Armor", 23: "Creuse", 24: "Dordogne", 25: "Doubs", 26: "Drôme",
    27: "Eure", 28: "Eure-et-Loir", 29: "Finistère", 2: "Haute-Corse", 30: "Gard",
    31: "Haute-Garonne", 32: "Gers", 33: "Gironde", 34: "Hérault", 35: "Ille-et-Vilaine",
    36: "Indre", 37: "Indre-et-Loire", 38: "Isère", 39: "Jura", 40: "Landes", 41: "Loir-et-Cher",
    42: "Loire", 43: "Haute-Loire", 44: "Loire-Atlantique", 45: "Loiret", 46: "Lot",
    47: "Lot-et-Garonne", 48: "Lozère", 49: "Maine-et-Loire", 50: "Manche", 51: "Marne",
    52: "Haute-Marne", 53: "Mayenne", 54: "Meurthe-et-Moselle", 55: "Meuse", 56: "Morbihan",
    57: "Moselle", 58: "Nièvre", 59: "Nord", 60: "Oise", 61: "Orne", 62: "Pas-de-Calais",
    63: "Puy-de-Dôme", 64: "Pyrénées-Atlantiques", 65: "Hautes-Pyrénées", 66: "Pyrénées-Orientales",
    67: "Bas-Rhin", 68: "Haut-Rhin", 69: "Rhône", 70: "Haute-Saône", 71: "Saône-et-Loire",
    72: "Sarthe", 73: "Savoie", 74: "Haute-Savoie", 75: "Paris", 76: "Seine-Maritime",
    77: "Seine-et-Marne", 78: "Yvelines", 79: "Deux-Sèvres", 80: "Somme", 81: "Tarn",
    82: "Tarn-et-Garonne", 83: "Var", 84: "Vaucluse", 85: "Vendée", 86: "Vienne",
    87: "Haute-Vienne", 88: "Vosges", 89: "Yonne", 90: "Territoire de Belfort",
    91: "Essonne", 92: "Hauts-de-Seine", 93: "Seine-Saint-Denis", 94: "Val-de-Marne",
    95: "Val-d’Oise"
};

const paysCapitales = {
    "France": "Paris", "Espagne": "Madrid", "Italie": "Rome", "Allemagne": "Berlin",
    "Portugal": "Lisbonne", "Suisse": "Berne", "Belgique": "Bruxelles", "Pays-Bas": "Amsterdam",
    "Royaume-Uni": "Londres", "Irlande": "Dublin", "Norvège": "Oslo", "Suède": "Stockholm",
    "Finlande": "Helsinki", "Danemark": "Copenhague", "Pologne": "Varsovie", "Grèce": "Athènes",
    "Turquie": "Ankara", "Autriche": "Vienne", "Canada": "Ottawa", "États-Unis": "Washington",
    "Mexique": "Mexico", "Brésil": "Brasilia", "Argentine": "Buenos Aires", "Maroc": "Rabat",
    "Algérie": "Alger", "Tunisie": "Tunis", "Égypte": "Le Caire", "Sénégal": "Dakar",
    "Chine": "Pékin", "Japon": "Tokyo", "Corée du Sud": "Séoul", "Inde": "New Delhi",
    "Russie": "Moscou", "Australie": "Canberra", "Afrique du Sud": "Pretoria"
};

// ==========================
// Variables globales
// ==========================

// --- Variables globales ---
let profil = "";
let departementStats = {};
let capitaleStats = {};
let currentQuestion = null;
let currentType = null;

// --- Récupération des éléments ---
const profilSection = document.getElementById("profil-section");
const menuJeux = document.getElementById("menu-jeux");
const quizSection = document.getElementById("quiz-section");
const questionEl = document.getElementById("question");
const reponseEl = document.getElementById("reponse");
const correctionEl = document.getElementById("correction");

// --- Chargement des stats existantes ---
window.addEventListener("load", () => {
    const data = JSON.parse(localStorage.getItem("quizStats"));
    if (data) {
        departementStats = data.departementStats || {};
        capitaleStats = data.capitaleStats || {};
    }
});

// --- Sauvegarde ---
function saveStats() {
    const data = {
        departementStats,
        capitaleStats
    };
    localStorage.setItem("quizStats", JSON.stringify(data));
}

// --- Connexion du profil ---
document.getElementById("btn-profil").addEventListener("click", () => {
    const input = document.getElementById("profil").value.trim();
    if (input === "") return alert("Entrez un profil !");
    profil = input;
    profilSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});

// --- Navigation ---
document.getElementById("btn-departements").addEventListener("click", () => startQuiz("departement"));
document.getElementById("btn-capitales").addEventListener("click", () => startQuiz("capitale"));
document.getElementById("btn-retour").addEventListener("click", () => {
    quizSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});

// --- Validation de la réponse ---
document.getElementById("btn-valider").addEventListener("click", () => {
    const answer = reponseEl.value.trim().toLowerCase();
    if (!currentQuestion) return;

    let correct = false;

    if (currentType === "departement") {
        if (answer === dp[currentQuestion]) correct = true;
        departementStats[currentQuestion] = departementStats[currentQuestion] || { bonnes: 0, mauvaises: 0 };
        departementStats[currentQuestion][correct ? "bonnes" : "mauvaises"]++;
    } else {
        if (answer === paysCapitales[currentQuestion].toLowerCase()) correct = true;
        capitaleStats[currentQuestion] = capitaleStats[currentQuestion] || { bonnes: 0, mauvaises: 0 };
        capitaleStats[currentQuestion][correct ? "bonnes" : "mauvaises"]++;
    }

    correctionEl.textContent = correct
        ? "✅ Bonne réponse !"
        : `❌ Mauvaise réponse. C’était : ${currentType === "departement" ? dp[currentQuestion] : paysCapitales[currentQuestion]}`;

    saveStats(); // ✅ sauvegarde
});

// --- Question suivante ---
document.getElementById("btn-suivant").addEventListener("click", () => {
    startQuiz(currentType);
});

// --- Fonction principale ---
function startQuiz(type) {
    currentType = type;
    menuJeux.classList.add("hidden");
    quizSection.classList.remove("hidden");
    reponseEl.value = "";
    correctionEl.textContent = "";

    if (type === "departement") {
        const keys = Object.keys(dp);
        currentQuestion = keys[Math.floor(Math.random() * keys.length)];
        questionEl.textContent = `Quel est le nom du département n°${currentQuestion} ?`;
    } else {
        const keys = Object.keys(paysCapitales);
        currentQuestion = keys[Math.floor(Math.random() * keys.length)];
        questionEl.textContent = `Quelle est la capitale de ${currentQuestion} ?`;
    }
}
