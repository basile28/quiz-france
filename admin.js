const ADMIN_PASSWORD = "123"; // change le mot de passe

const adminLogin = document.getElementById("admin-login");
const adminPanel = document.getElementById("admin-panel");
const profilesContainer = document.getElementById("profiles-container");

// Connexion
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

// Afficher tous les profils
function afficherProfiles(){
    profilesContainer.innerHTML = "";
    const profiles = Object.keys(localStorage).filter(k => k.startsWith("stats_"));

    if(profiles.length === 0){
        profilesContainer.innerHTML = "<p>Aucun profil enregistré.</p>";
        return;
    }

    profiles.forEach(key => {
        const nom = key.replace("stats_","");
        const stats = JSON.parse(localStorage.getItem(key));
        const departements = stats.departements || {};
        const capitales = stats.capitales || {};

        const bonnesDept = Object.values(departements).reduce((a,b)=>a+b.bonnes,0);
        const mauvaisesDept = Object.values(departements).reduce((a,b)=>a+b.mauvaises,0);
        const bonnesCap = Object.values(capitales).reduce((a,b)=>a+b.bonnes,0);
        const mauvaisesCap = Object.values(capitales).reduce((a,b)=>a+b.mauvaises,0);

        const card = document.createElement("div");
        card.className = "admin-profile-card";
        card.innerHTML = `
            <h3>${nom}</h3>
            <p>Départements: ${bonnesDept} ✅ / ${mauvaisesDept} ❌</p>
            <p>Capitales: ${bonnesCap} ✅ / ${mauvaisesCap} ❌</p>
            <button class="btn-suppr" data-nom="${nom}">Supprimer</button>
            <button class="btn-reset" data-nom="${nom}">Réinitialiser</button>
        `;
        profilesContainer.appendChild(card);
    });

    // Ajouter événements boutons
    document.querySelectorAll(".btn-suppr").forEach(btn => {
        btn.addEventListener("click", () => {
            const nom = btn.dataset.nom;
            if(confirm(`Supprimer le profil ${nom} ?`)){
                localStorage.removeItem("stats_" + nom);
                afficherProfiles();
            }
        });
    });

    document.querySelectorAll(".btn-reset").forEach(btn => {
        btn.addEventListener("click", () => {
            const nom = btn.dataset.nom;
            if(confirm(`Réinitialiser les stats du profil ${nom} ?`)){
                localStorage.setItem("stats_" + nom, JSON.stringify({departements:{}, capitales:{}}));
                afficherProfiles();
            }
        });
    });
}

// Bouton réinit global
document.getElementById("btn-reinit").addEventListener("click", () => {
    if(confirm("Réinitialiser toutes les stats de tous les profils ?")){
        Object.keys(localStorage).forEach(k=>{
            if(k.startsWith("stats_")) localStorage.setItem(k, JSON.stringify({departements:{}, capitales:{}}));
        });
        afficherProfiles();
    }
});

// Export CSV
document.getElementById("btn-export").addEventListener("click", () => {
    let csv = "Profil,Type,Nom,Bonnes,Mauvaises\n";
    Object.keys(localStorage).forEach(k => {
        if(!k.startsWith("stats_")) return;
        const profil = k.replace("stats_","");
        const stats = JSON.parse(localStorage.getItem(k));

        for(const dep in stats.departements){
            const s = stats.departements[dep];
            csv += `${profil},departement,${dep},${s.bonnes},${s.mauvaises}\n`;
        }
        for(const cap in stats.capitales){
            const s = stats.capitales[cap];
            csv += `${profil},capitale,${cap},${s.bonnes},${s.mauvaises}\n`;
        }
    });

    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats_quiz.csv";
    a.click();
    URL.revokeObjectURL(url);
    alert("Stats exportées en CSV ✅");
});
