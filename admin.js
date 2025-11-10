const ADMIN_PASSWORD = "123"; // change le mot de passe
const ADMIN_IP = ""; // ton IP locale

async function checkAdmin(){
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    if(data.ip !== ADMIN_IP){
        alert("Accès refusé : IP non autorisée");
        window.location.href = "index.html";
        return;
    }
    const pwd = prompt("Entrez le mot de passe admin :");
    if(pwd !== ADMIN_PASSWORD){
        alert("Mot de passe incorrect !");
        window.location.href = "index.html";
        return;
    }
    log("Admin connecté ✅");
}

function log(text){
    const logEl = document.getElementById("admin-log");
    logEl.innerHTML += text+"<br>";
}

checkAdmin();

document.getElementById("btn-export").addEventListener("click", exportCSV);
document.getElementById("btn-reset").addEventListener("click", () => {
    if(confirm("Réinitialiser toutes les stats ?")){
        localStorage.clear();
        alert("Toutes les stats ont été réinitialisées !");
        log("Toutes les stats réinitialisées");
    }
});

function exportCSV(){
    let csv = "Profil,Type,Nom,Bonnes,Mauvaises\n";
    for(let i=0;i<localStorage.length;i++){
        const profil = localStorage.key(i);
        const stats = JSON.parse(localStorage.getItem(profil));
        for(const dep in stats.departementStats){
            const s = stats.departementStats[dep];
            csv += `${profil},departement,${dep},${s.bonnes},${s.mauvaises}\n`;
        }
        for(const cap in stats.capitaleStats){
            const s = stats.capitaleStats[cap];
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

