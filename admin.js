const ADMIN_PASSWORD = "123";

const adminLogin = document.getElementById("admin-login");
const adminPanel = document.getElementById("admin-panel");

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

async function afficherProfiles(){
    const res = await fetch("stats.json");
    const data = await res.json();
    const list = document.getElementById("list-profiles");
    list.innerHTML = "";
    Object.keys(data).forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        list.appendChild(li);
    });
}

document.getElementById("btn-reinit").addEventListener("click", async () => {
    if(!confirm("Réinitialiser toutes les stats ?")) return;
    await fetch("save_stats.php?reset=1");
    alert("Stats réinitialisées !");
    afficherProfiles();
});

document.getElementById("btn-export").addEventListener("click", async () => {
    const res = await fetch("stats.json");
    const data = await res.json();
    let csv = "Profil,Type,Nom,Bonnes,Mauvaises\n";
    for(const profil in data){
        const s = data[profil];
        for(const d in s.departements){
            const v = s.departements[d];
            csv += `${profil},Département,${d},${v.bonnes},${v.mauvaises}\n`;
        }
        for(const c in s.capitales){
            const v = s.capitales[c];
            csv += `${profil},Capitale,${c},${v.bonnes},${v.mauvaises}\n`;
        }
    }
    const blob = new Blob([csv], {type: "text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stats_quiz.csv";
    a.click();
});
