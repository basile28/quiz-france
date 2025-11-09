const dp = {
    1: "ain", 2: "aisne", 3: "allier", 4: "alpes de haute provence", 5: "hautes alpes",
    6: "alpes maritimes", 7: "ardèche", 8: "ardennes", 9: "ariège", 10: "aube"
};

const paysCapitales = {
    "France": "Paris", "Espagne": "Madrid", "Italie": "Rome", "Allemagne": "Berlin",
    "Portugal": "Lisbonne", "Suisse": "Berne", "Belgique": "Bruxelles"
};

let profil = "";
let departementStats = {};
let capitaleStats = {};
let currentQuestion = null;
let currentType = null;

const profilSection = document.getElementById("profil-section");
const menuJeux = document.getElementById("menu-jeux");
const quizSection = document.getElementById("quiz-section");
const questionEl = document.getElementById("question");
const reponseEl = document.getElementById("reponse");
const correctionEl = document.getElementById("correction");

document.getElementById("btn-profil").addEventListener("click", () => {
    const input = document.getElementById("profil").value.trim();
    if(input === "") return alert("Entrez un profil !");
    profil = input;
    profilSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});

document.getElementById("btn-departements").addEventListener("click", () => startQuiz("departement"));
document.getElementById("btn-capitales").addEventListener("click", () => startQuiz("capitale"));
document.getElementById("btn-retour").addEventListener("click", () => {
    quizSection.classList.add("hidden");
    menuJeux.classList.remove("hidden");
});

document.getElementById("btn-valider").addEventListener("click", () => {
    const answer = reponseEl.value.trim().toLowerCase();
    let correct = false;

    if(currentType === "departement") {
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
});

document.getElementById("btn-suivant").addEventListener("click", () => {
    startQuiz(currentType);
});

function startQuiz(type) {
    currentType = type;
    menuJeux.classList.add("hidden");
    quizSection.classList.remove("hidden");
    reponseEl.value = "";
    correctionEl.textContent = "";

    if(type === "departement") {
        const keys = Object.keys(dp);
        currentQuestion = keys[Math.floor(Math.random()*keys.length)];
        questionEl.textContent = `Quel est le nom du département n°${currentQuestion} ?`;
    } else {
        const keys = Object.keys(paysCapitales);
        currentQuestion = keys[Math.floor(Math.random()*keys.length)];
        questionEl.textContent = `Quelle est la capitale de ${currentQuestion} ?`;
    }
}
