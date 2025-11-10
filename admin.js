const ADMIN_PASSWORD = "123"; // change le mot de passe
const adminLogin = document.getElementById("admin-login");
const adminPanel = document.getElementById("admin-panel");
const profilesContainer = document.getElementById("profiles-container");

// Connexion admin
document.getElementById("btn-admin-login").addEventListener("click", () => {
    const pwd = document.getElementById("admin-password").value;
    if(pwd !== ADMIN_PASSWORD){
        alert("Mot de passe incorrect !");
        return;
    }
    adminLogin.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    afficherProfiles();
});

// Affichage profils
async function afficherProfiles() {
    const res = await fetch("stats.json");
    const data = await res.json();

    profilesContainer.innerHTML = "";
    for (const profil in data) {
        const stats = data[profil];
        const departements = stats.departements || {};
        const capitales = stats.capitales || {};

        const bonnesDept = Object.values(departements).reduce((a,b)=>a+b.bonnes,0);
        const mauvaisesDept = Object.values(departements).reduce((a,b)=>a+b.mauvaises,0);
        const bonnesCap = Object.values(capitales).reduce((a,b)=>a+b.bonnes,0);
        const mauvaisesCap = Object.values(capitales).reduce((a,b)=>a+b.mauvaises,0);

        const card = document.createElement("div");
        card.className = "admin-profile-card";
        card.innerHTML = `
            <h3>${profil}</h3>
            <p>Départements: ${bonnesDept} ✅ / ${mauvaisesDept} ❌</p>
            <p>Capitales: ${bonnesCap} ✅ / ${mauvaisesCap} ❌</p>
            <button class="btn-reset" data-nom="${profil}">Réinitialiser</button>
        `;
        profilesContainer.appendChild(card);
    }

    document.querySelectorAll(".btn-reset").forEach(btn => {
        btn.addEventListener("click", async () => {
            const nom = btn.dataset.nom;
            if(confirm(`Réinitialiser les stats du profil ${nom} ?`)){
                await fetch("save_stats.php", {
                    method:"POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({profil:nom, departements:{}, capitales:{}})
                });
                afficherProfiles();
            }
        });
    });
}

// Boutons globaux
document.getElementById("btn-reinit").addEventListener("click", async () => {
    if(confirm("Réinitialiser toutes les stats de tous les profils ?")){
        const res = await fetch("stats.json");
        const data = await res.json();
        for(const p in data){
            await fetch("save_stats.php", {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({profil:p, departements:{}, capitales:{}})
            });
        }
        afficherProfiles();
    }
});

document.getElementById("btn-export").addEventListener("click", async () => {
    const res = await fetch("stats.json");
    const data = await res.json();
    let csv = "Profil,Type,Nom,Bonnes,Mauvaises\n";
    for(const profil in data){
        const stats = data[profil];
        for(const dep in stats.departements){
            const s = stats.departements[dep];
            csv += `${profil},departement,${dep},${s.bonnes},${s.mauvaises}\n`;
        }
        for(const cap in stats.capitales){
            const s = stats.capitales[cap];
            csv += `${profil},capitale,${cap},${s.bonnes},${s.mauvaises}\n`;
        }
    }
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats_quiz.csv";
    a.click();
    URL.revokeObjectURL(url);
    alert("Stats exportées en CSV ✅");
});
