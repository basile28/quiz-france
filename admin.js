const ADMIN_PASSWORD = "123"; // mot de passe admin
const ADMIN_IP = "xxx.xxx.xxx.xxx"; // ton IP locale

document.getElementById("btn-admin-login").addEventListener("click", loginAdmin);
document.getElementById("btn-reinit").addEventListener("click", () => {
    if(confirm("Réinitialiser toutes les stats ?")) {
        localStorage.clear();
        alert("Toutes les stats ont été réinitialisées !");
        loadProfiles();
    }
});
document.getElementById("btn-export").addEventListener("click", exportCSV);

function loginAdmin(){
    const pwd=document.getElementById("admin-password").value.trim();
    if(pwd!==ADMIN_PASSWORD) return alert("Mot de passe incorrect !");
    document.getElementById("admin-login").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    loadProfiles();
}

function loadProfiles(){
    const ul=document.getElementById("list-profiles");
    ul.innerHTML="";
    for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(key.startsWith("stats_")){
            const li=document.createElement("li");
            li.textContent=key.replace("stats_","");
            ul.appendChild(li);
        }
    }
}

function exportCSV(){
    let csv="Profil,Type,Nom,Bonnes,Mauvaises\n";
    for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(!key.startsWith("stats_")) continue;
        const profil=key.replace("stats_","");
        const stats=JSON.parse(localStorage.getItem(key));
        for(const dep in stats.departements){
            const s=stats.departements[dep];
            csv+=`${profil},departement,${dep},${s.bonnes},${s.mauvaises}\n`;
        }
        for(const cap in stats.capitales){
            const s=stats.capitales[cap];
            csv+=`${profil},capitale,${cap},${s.bonnes},${s.mauvaises}\n`;
        }
    }
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download="stats_quiz.csv";
    a.click();
    URL.revokeObjectURL(url);
}
