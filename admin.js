// 🔒 Vérification de l’adresse IP
const IP_AUTORISEE = "83.202.120.48"; // ← ton IP ici

// 🔑 Mot de passe admin
const PASSWORD = "2802 BASILE LVD"; // change-le aussi !

const loginSection = document.getElementById("login-section");
const adminSection = document.getElementById("admin-section");
const loginMessage = document.getElementById("login-message");
const statsBody = document.getElementById("stats-body");

// --- Vérification IP ---
fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    if (data.ip !== IP_AUTORISEE) {
      document.body.innerHTML = `
        <h1 style="color:red;text-align:center;margin-top:50px;">
          ⛔ Accès refusé<br>Votre IP (${data.ip}) n'est pas autorisée
        </h1>`;
    }
  });

// --- Connexion par mot de passe ---
document.getElementById("btn-login").addEventListener("click", () => {
  const pass = document.getElementById("admin-password").value.trim();
  if (pass === PASSWORD) {
    loginSection.classList.add("hidden");
    adminSection.classList.remove("hidden");
    afficherStats();
  } else {
    loginMessage.textContent = "❌ Mot de passe incorrect";
  }
});

// --- Affichage des statistiques ---
function afficherStats() {
  const data = JSON.parse(localStorage.getItem("quizStats"));
  if (!data) {
    statsBody.innerHTML = `<tr><td colspan="5">Aucune donnée disponible</td></tr>`;
    return;
  }

  statsBody.innerHTML = "";
  for (const profil in data) {
    const joueur = data[profil];
    afficherLigne(profil, "Départements", joueur.departementStats);
    afficherLigne(profil, "Capitales", joueur.capitaleStats);
  }
}

function afficherLigne(profil, type, stats) {
  const totalBonnes = Object.values(stats).reduce((a, s) => a + (s.bonnes || 0), 0);
  const totalMauvaises = Object.values(stats).reduce((a, s) => a + (s.mauvaises || 0), 0);
  const total = totalBonnes + totalMauvaises;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${profil}</td>
    <td>${type}</td>
    <td>${total}</td>
    <td>${totalBonnes}</td>
    <td>${totalMauvaises}</td>
  `;
  statsBody.appendChild(tr);
}

// --- Réinitialisation ---
document.getElementById("btn-reset").addEventListener("click", () => {
  if (confirm("Voulez-vous vraiment tout réinitialiser ?")) {
    localStorage.removeItem("quizStats");
    afficherStats();
    alert("✅ Statistiques réinitialisées !");
  }
});
