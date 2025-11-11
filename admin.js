const ADMIN_PASSWORD = "123";

document.getElementById("btn-admin-login").addEventListener("click", () => {
    const pwd = document.getElementById("admin-password").value;
    if(pwd !== ADMIN_PASSWORD){ alert("Mot de passe incorrect !"); return; }
    document.getElementById("admin-login").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    loadAllStats();
});

async function loadAllStats() {
    try {
        const res = await fetch('load_stats.php');
        const allStats = await res.json();
        const container = document.getElementById("profiles-container");
        container.innerHTML = "";
        for(const profil in allStats){
            const stats = allStats[profil];
            const card = document.createElement("div");
            card.className = "admin-profile-card";
            card.innerHTML = `<h3>${profil}</h3>
                <p>Départements : ${Object.keys(stats.departements||{}).length}</p>
                <p>Capitales : ${Object.keys(stats.capitales||{}).length}</p>
                <button class="btn-reset">Réinitialiser</button>
                <button class="btn-suppr">Supprimer</button>`;
            container.appendChild(card);

            card.querySelector(".btn-reset").addEventListener("click", () => {
                if(confirm(`Réinitialiser toutes les stats de ${profil} ?`)){
                    stats.departements = {}; stats.capitales = {}; saveAllStats(allStats); loadAllStats();
                }
            });

            card.querySelector(".btn-suppr").addEventListener("click", () => {
                if(confirm(`Supprimer le profil ${profil} ?`)){
                    delete allStats[profil]; saveAllStats(allStats); loadAllStats();
                }
            });
        }
    } catch(e){ console.error(e); alert("Impossible de charger les stats."); }
}

function saveAllStats(data){
    fetch('save_stats.php', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({__full_replace:true, data})
    });
}
