const PASSWORD = "2802 BASILE LVD"; // 🔒 Change-le par ton mot de passe secret

const authSection = document.getElementById("auth-section");
const adminSection = document.getElementById("admin-section");
const errorEl = document.getElementById("auth-error");
const statsContainer = document.getElementById("stats-container");

document.getElementById("btn-login").addEventListener("click", () => {
    const input = document.getElementById("admin-password").value;
    if (input === PASSWORD) {
        authSection.classList.add("hidden");
        adminSection.classList.remove("hidden");
        chargerStats();
    } else {
        errorEl.textContent = "❌ Mot de passe incorrect";
    }
});

function chargerStats() {
    const data = JSON.parse(localStorage.getItem("quizStats")) || {};
    statsContainer.innerHTML = "";

    if (Object.keys(data).length === 0) {
        statsContainer.innerHTML = "<p>Aucune donnée disponible.</p>";
        return;
    }

    for (const profil in data) {
        const div = document.createElement("div");
        div.classList.add("profil-card");
        const stats = data[profil];
        div.innerHTML = `
            <h3>${profil}</h3>
            <p>Bonnes réponses : ${stats.bonnes || 0}</p>
            <p>Mauvaises réponses : ${stats.mauvaises || 0}</p>
        `;
        statsContainer.appendChild(div);
    }
}

document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment tout réinitialiser ?")) {
        localStorage.removeItem("quizStats");
        statsContainer.innerHTML = "<p>Toutes les stats ont été effacées ✅</p>";
    }
});
