// 🔒 Vérification de l’adresse IP
const IP_AUTORISEE = "83.202.120.48"; // ← ton IP ici

const listeProfilsEl = document.getElementById("liste-profils");
const statsProfilEl = document.getElementById("stats-profil");
const btnReinit = document.getElementById("btn-reinit");
const btnSupprimer = document.getElementById("btn-supprimer");
const btnRetour = document.getElementById("btn-retour");

let profils = [];
let selectedProfil = null;

// Vérifier IP
fetch('https://api.ipify.org?format=json').then(res=>res.json()).then(data=>{
    if(data.ip !== ADMIN_IP){
        alert("Accès admin réservé à l'ordinateur autorisé !");
        window.location.href = "index.html";
    } else {
        chargerProfils();
    }
});

function chargerProfils(){
    listeProfilsEl.innerHTML = "";
    profils = Object.keys(localStorage);
    profils.forEach(profil => {
        const li = document.createElement("li");
        li.textContent = profil;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => selectProfil(profil, li));
        listeProfilsEl.appendChild(li);
    });
}

function selectProfil(profil, li){
    selectedProfil = profil;
    Array.from(listeProfilsEl.children).forEach(el => el.style.fontWeight = "normal");
    li.style.fontWeight = "bold";

    const stats = JSON.parse(localStorage.getItem(profil));
    let texte = `📊 Stats du profil : ${profil}\n\nDépartements:\n`;
    for(const dep in stats.departementStats){
        const s = stats.departementStats[dep];
        texte += `${dep}: ${s.bonnes}✓ / ${s.mauvaises}✗\n`;
    }
    texte += `\nCapitales:\n`;
    for(const cap in stats.capitaleStats){
        const s = stats.capitaleStats[cap];
        texte += `${cap}: ${s.bonnes}✓ / ${s.mauvaises}✗\n`;
    }
    statsProfilEl.textContent = texte;
}

// Réinitialiser stats
btnReinit.addEventListener("click", () => {
    if(!selectedProfil) return alert("Sélectionnez un profil !");
    const confirm = window.confirm(`Réinitialiser les stats de ${selectedProfil} ?`);
    if(confirm){
        localStorage.setItem(selectedProfil, JSON.stringify({departementStats:{}, capitaleStats:{}}));
        selectProfil(selectedProfil, Array.from(listeProfilsEl.children).find(el=>el.textContent===selectedProfil));
    }
});

// Supprimer profil
btnSupprimer.addEventListener("click", () => {
    if(!selectedProfil) return alert("Sélectionnez un profil !");
    const confirm = window.confirm(`Supprimer le profil ${selectedProfil} ?`);
    if(confirm){
        localStorage.removeItem(selectedProfil);
        selectedProfil = null;
        statsProfilEl.textContent = "";
        chargerProfils();
    }
});

btnRetour.addEventListener("click", () => window.location.href = "index.html");
