const ADMIN_PASSWORD = "123"; // change le mot de passe

document.getElementById("btn-admin-login").addEventListener("click", () => {
    const pwd = document.getElementById("admin-password").value;
    if(pwd !== ADMIN_PASSWORD){
        alert("Mot de passe incorrect !");
        return;
    }

    document.getElementById("admin-login").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    afficherProfiles();
});

function afficherProfiles(){
    const listEl = document.getElementById("list-profiles");
    listEl.innerHTML = "";
    for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i);
        if(key.startsWith("stats_")){
            const li = document.createElement("li");
            li.textContent = key.replace("stats_","");
            listEl.appendChild(li);
        }
    }
}

document.getElementById("btn-reinit").addEventListener("click", () => {
    if(confirm("Réinitialiser toutes les stats ?")){
        localStorage.clear();
        alert("Toutes les stats ont été réinitialisées !");
        afficherProfiles();
    }
});

document.getElementById("btn-suppr").addEventListener("click", () => {
    const nom = prompt("Entrez le nom du profil à supprimer :");
    if(!nom) return;
    localStorage.removeItem("stats_" + nom);
    alert(`Profil ${nom} supprimé.`);
    afficherProfiles();
});
