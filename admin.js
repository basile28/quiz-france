const ADMIN_PASSWORD = "123"; // mot de passe

function log(text){
    const logEl = document.getElementById("admin-log");
    if(logEl) logEl.innerHTML += text+"<br>";
}

document.getElementById("btn-admin-login").addEventListener("click", () => {
    const pwd = document.getElementById("admin-password").value;
    if(pwd !== ADMIN_PASSWORD){
        alert("Mot de passe incorrect !");
        return;
    }
    document.getElementById("admin-login").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    log("Admin connecté ✅");
    afficherProfils();
});

function afficherProfils(){
    const list = document.getElementById("list-profiles");
    list.innerHTML = "";
    for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i);
        if(key.startsWith("stats_")){
            const li = document.createElement("li");
            li.textContent = key.replace("stats_","");
            list.appendChild(li);
        }
    }
}

document.getElementById("btn-reset").addEventListener("click", () => {
    if(confirm("Réinitialiser toutes les stats ?")){
        for(let i=0;i<localStorage.length;i++){
            const key = localStorage.key(i);
            if(key.startsWith("stats_")) localStorage.removeItem(key);
        }
        alert("Toutes les stats ont été réinitialisées !");
        log("Toutes les stats réinitialisées");
        afficherProfils();
    }
});

document.getElementById("btn-export").addEventListener("click", exportCSV);

function exportCSV(){
    let csv = "Profil,Type,Nom,Bonnes,Mauvaises\n";
    for(let i=0;i<localStorage.length;i++){
        const profilKey = localStorage.key(i);
        if(!profilKey.startsWith("stats_")) continue;
        const profil = profilKey.replace("stats_","");
        const stats = JSON.parse(localStorage.getItem(profilKey));
        for(const dep in stats.departements){
            const s = stats.departements[dep];
            csv += `${profil},departement,${dep},${s.bonnes},${s.mauvaises}\n`;
        }
        for(const cap in stats.capitales){
            const s = stats.capitales[cap];
            csv += `${profil},capitale,${cap},${s.bonnes},${s.mauvaises}\n`;
        }
    }
    const blob = new Blob([csv], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats_quiz.csv";
    a.click();
    URL.revokeObjectURL(url);
    log("Stats exportées en CSV ✅");
}
