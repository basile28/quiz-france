const dp = {
    1: "Ain", 2: "Aisne", 3: "Allier", 4: "Alpes-de-Haute-Provence", 5: "Hautes-Alpes",
    6: "Alpes-Maritimes", 7: "Ardèche", 8: "Ardennes", 9: "Ariège", 10: "Aube",
    11: "Aude", 12: "Aveyron", 13: "Bouches-du-Rhône", 14: "Calvados", 15: "Cantal",
    16: "Charente", 17: "Charente-Maritime", 18: "Cher", 19: "Corrèze", 21: "Côte-d’Or",
    22: "Côtes-d’Armor", 23: "Creuse", 24: "Dordogne", 25: "Doubs", 26: "Drôme",
    27: "Eure", 28: "Eure-et-Loir", 29: "Finistère", 2A: "Corse-du-Sud", 2B: "Haute-Corse",
    30: "Gard", 31: "Haute-Garonne", 32: "Gers", 33: "Gironde", 34: "Hérault",
    35: "Ille-et-Vilaine", 36: "Indre", 37: "Indre-et-Loire", 38: "Isère", 39: "Jura",
    40: "Landes", 41: "Loir-et-Cher", 42: "Loire", 43: "Haute-Loire", 44: "Loire-Atlantique",
    45: "Loiret", 46: "Lot", 47: "Lot-et-Garonne", 48: "Lozère", 49: "Maine-et-Loire",
    50: "Manche", 51: "Marne", 52: "Haute-Marne", 53: "Mayenne", 54: "Meurthe-et-Moselle",
    55: "Meuse", 56: "Morbihan", 57: "Moselle", 58: "Nièvre", 59: "Nord",
    60: "Oise", 61: "Orne", 62: "Pas-de-Calais", 63: "Puy-de-Dôme", 64: "Pyrénées-Atlantiques",
    65: "Hautes-Pyrénées", 66: "Pyrénées-Orientales", 67: "Bas-Rhin", 68: "Haut-Rhin", 69: "Rhône",
    70: "Haute-Saône", 71: "Saône-et-Loire", 72: "Sarthe", 73: "Savoie", 74: "Haute-Savoie",
    75: "Paris", 76: "Seine-Maritime", 77: "Seine-et-Marne", 78: "Yvelines", 79: "Deux-Sèvres",
    80: "Somme", 81: "Tarn", 82: "Tarn-et-Garonne", 83: "Var", 84: "Vaucluse",
    85: "Vendée", 86: "Vienne", 87: "Haute-Vienne", 88: "Vosges", 89: "Yonne",
    90: "Territoire de Belfort", 91: "Essonne", 92: "Hauts-de-Seine", 93: "Seine-Saint-Denis",
    94: "Val-de-Marne", 95: "Val-d’Oise"
        };

const paysCapitales = {
    "France": "Paris",
    "Espagne": "Madrid",
    "Italie": "Rome",
    "Allemagne": "Berlin",
    "Portugal": "Lisbonne",
    "Belgique": "Bruxelles",
    "Suisse": "Berne",
    "Autriche": "Vienne",
    "Pays-Bas": "Amsterdam",
    "Luxembourg": "Luxembourg",
    "Royaume-Uni": "Londres",
    "Irlande": "Dublin",
    "Norvège": "Oslo",
    "Suède": "Stockholm",
    "Finlande": "Helsinki",
    "Danemark": "Copenhague",
    "Pologne": "Varsovie",
    "Tchéquie": "Prague",
    "Slovaquie": "Bratislava",
    "Hongrie": "Budapest",
    "Grèce": "Athènes",
    "Turquie": "Ankara",
    "Chypre": "Nicosie",
    "Roumanie": "Bucarest",
    "Bulgarie": "Sofia",
    "Croatie": "Zagreb",
    "Slovénie": "Ljubljana",
    "Serbie": "Belgrade",
    "Bosnie-Herzégovine": "Sarajevo",
    "Monténégro": "Podgorica",
    "Albanie": "Tirana",
    "Macédoine du Nord": "Skopje",
    "Islande": "Reykjavik",
    "États-Unis": "Washington",
    "Canada": "Ottawa",
    "Mexique": "Mexico",
    "Brésil": "Brasilia",
    "Argentine": "Buenos Aires",
    "Chili": "Santiago",
    "Pérou": "Lima",
    "Colombie": "Bogotá",
    "Venezuela": "Caracas",
    "Maroc": "Rabat",
    "Algérie": "Alger",
    "Tunisie": "Tunis",
    "Égypte": "Le Caire",
    "Sénégal": "Dakar",
    "Côte d’Ivoire": "Yamoussoukro",
    "Afrique du Sud": "Pretoria",
    "Kenya": "Nairobi",
    "Chine": "Pékin",
    "Japon": "Tokyo",
    "Corée du Sud": "Séoul",
    "Inde": "New Delhi",
    "Indonésie": "Jakarta",
    "Australie": "Canberra",
    "Nouvelle-Zélande": "Wellington",
    "Russie": "Moscou"
};


// --- Variables globales ---
let profil = "";
let currentQuestion = null;
let currentType = null;
let stats = JSON.parse(localStorage.getItem("quizStats")) || {}; // stockage local
const ADMIN_KEY = "basilePC-2025"; // clé d'identification de ton PC
const ADMIN_PASSWORD = "admin123"; // mot de passe admin

// --- Sélection des éléments ---
const profilSection = document.getElementById("profil-section");
const menuJeux = document.getElementById("menu-jeux");
const quizSection = document.getElementById("quiz-section");
const questionEl = document.getElementById("question");
const reponseEl = document.getElementById("reponse");
const correctionEl = document.getElementById("correction");

// --- Boutons ---
document.getElementById("btn-profil").addEventListener("click", () => {
    const input = document.getElementById("profil").value.trim();
    if (input === "") return alert("Entrez un profil !");
    profil = input;

    if (!stats[profil]) {
        stats[profil] = { departementStats: {}, capitaleStats: {} };
    }

    saveStats();
    profilSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});

document.getElementById("btn-departements").addEventListener("click", () => startQuiz("departement"));
document.getElementById("btn-capitales").addEventListener("click", () => startQuiz("capitale"));
document.getElementById("btn-retour").addEventListener("click", () => {
    quizSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});

// --- Validation d'une réponse ---
document.getElementById("btn-valider").addEventListener("click", () => {
    const answer = reponseEl.value.trim().toLowerCase();
    let correct = false;

    if (currentType === "departement") {
        if (answer === dp[currentQuestion]) correct = true;
        updateStats(profil, "departementStats", currentQuestion, correct);
    } else {
        if (answer === paysCapitales[currentQuestion].toLowerCase()) correct = true;
        updateStats(profil, "capitaleStats", currentQuestion, correct);
    }

    correctionEl.textContent = correct
        ? "✅ Bonne réponse !"
        : `❌ Mauvaise réponse. C’était : ${currentType === "departement" ? dp[currentQuestion] : paysCapitales[currentQuestion]}`;
});

document.getElementById("btn-suivant").addEventListener("click", () => startQuiz(currentType));

// --- Fonction de quiz ---
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

// --- Gestion des stats ---
function updateStats(user, type, question, correct) {
    const target = stats[user][type];
    if (!target[question]) target[question] = { bonnes: 0, mauvaises: 0 };
    target[question][correct ? "bonnes" : "mauvaises"]++;
    saveStats();
}

function saveStats() {
    localStorage.setItem("quizStats", JSON.stringify(stats));
}

// --- Mode Admin ---
function showAdminPanel() {
    const adminDiv = document.createElement("div");
    adminDiv.className = "card";
    adminDiv.innerHTML = `
        <h2>🛠️ Mode Administrateur</h2>
        <button id="btn-view" class="btn btn-blue">Voir les connexions</button>
        <button id="btn-reset" class="btn btn-orange">Réinitialiser les stats</button>
        <pre id="admin-log" style="text-align:left; background:#f9f9f9; padding:10px; border-radius:10px; max-height:300px; overflow:auto;"></pre>
    `;
    document.body.appendChild(adminDiv);

    document.getElementById("btn-view").addEventListener("click", () => {
        const log = document.getElementById("admin-log");
        log.textContent = JSON.stringify(stats, null, 2);
    });

    document.getElementById("btn-reset").addEventListener("click", () => {
        if (confirm("Voulez-vous vraiment tout réinitialiser ?")) {
            stats = {};
            saveStats();
            alert("Statistiques réinitialisées !");
            document.getElementById("admin-log").textContent = "";
        }
    });
}

// --- Accès réservé à ton PC ---
function checkAdminAccess() {
    // Clé secrète simulée (tu peux changer la condition ci-dessous)
    const key = localStorage.getItem("admin-key");
    if (key === ADMIN_KEY) {
        const pwd = prompt("Mot de passe admin :");
        if (pwd === ADMIN_PASSWORD) {
            showAdminPanel();
        } else {
            alert("Mot de passe incorrect !");
        }
    }
}

// Active le mode admin avec une combinaison spéciale (ex: appuyer sur A + D + M)
document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key.toLowerCase() === "a") {
        checkAdminAccess();
    }
});
