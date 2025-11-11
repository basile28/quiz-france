const ADMIN_PASSWORD = "123"; // changer le mot de passe admin
const adminLoginSection = document.getElementById("admin-login");
const adminPanelSection = document.getElementById("admin-panel");
const adminLog = document.getElementById("admin-log");
const listProfiles = document.getElementById("list-profiles");

function log(text){
    adminLog.innerHTML += text+"<br>";
}

// --- Login ---
document.getElementById("btn-admin-login").addEventListener("click", () => {
    const pwd = document.getElementById("admin-password").value.trim();
    if(pwd !== ADMIN_PASSWORD){
        alert("Mot de passe incorrect !");
        return;
    }
    adminLoginSection.classList.add("hidden");
    adminPanelSection.classList.remove("hidden");
    log("Admin connecté ✅");
    afficherProfils();
});

// --- Affichage des profils ---
function afficherProfils(){
    listProfiles.innerHTML="";
    for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(!key.startsWith("stats_")) continue;
        const li=document.createElement("li");
        li.textContent=key.replace("stats_","");
        listProfiles.appendChild(li);
    }
}

// --- Export CSV ---
document.getElementById("btn-export").addEventListener("click", ()=>{
    let csv = "Profil,Type,Nom,Bonnes,Mauvaises\n";
    for(let i=0;i<localStorage.length;i++){
        const profilKey = localStorage.key(i);
        if(!profilKey.startsWith("stats_")) continue;
        const profil = profilKey.replace("stats_","");
        const stats = JSON.parse(localStorage.getItem(profilKey));
        for(const dep in stats.departements){
            const s=stats.departements[dep];
            csv += `${profil},departement,${dep},${s.bonnes},${s.mauvaises}\n`;
        }
        for(const cap in stats.capitales){
            const s=stats.capitales[cap];
            csv += `${profil},capitale,${cap},${s.bonnes},${s.mauvaises}\n`;
        }
    }
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download="stats_quiz.csv";
    a.click();
    URL.revokeObjectURL(url);
    log("Stats exportées ✅");
});

// --- Réinitialiser ---
document.getElementById("btn-reinit").addEventListener("click", ()=>{
    if(confirm("Réinitialiser toutes les stats ?")){
        for(let i=0;i<localStorage.length;i++){
            const key=localStorage.key(i);
            if(key.startsWith("stats_")) localStorage.removeItem(key);
        }
        log("Toutes les stats ont été réinitialisées ✅");
        afficherProfils();
    }
});

// --- Supprimer un profil ---
document.getElementById("btn-suppr").addEventListener("click", ()=>{
    const profil = prompt("Entrez le nom du profil à supprimer :");
    if(!profil) return;
    const key = "stats_" + profil;
    if(localStorage.getItem(key)){
        localStorage.removeItem(key);
        log(`Profil ${profil} supprimé ✅`);
        afficherProfils();
    } else alert("Profil introuvable !");
});
