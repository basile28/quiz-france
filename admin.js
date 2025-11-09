// 🔒 Vérification de l’adresse IP
const IP_AUTORISEE = "83.202.120.48"; // ← ton IP ici

fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    if (data.ip !== IP_AUTORISEE) {
      document.body.innerHTML = `
        <h1 style="color:red;text-align:center;">⛔ Accès refusé</h1>
        <p style="text-align:center;">Cette page est réservée à l’administrateur.</p>
      `;
    }
  });

// 🔑 Mot de passe admin
const PASSWORD = "2802 BASILE LVD"; // change-le aussi !

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
