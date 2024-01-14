const input = document.querySelector("input");

const tableHeader = document.getElementById("table-header");
const verbTitle = document.getElementById("verb-title");
const spanishdictLink = document.getElementById("spanishdict-link");

const table = document.querySelector("table");

const yo = document.getElementById("yo");
const eres = document.getElementById("eres");
const el = document.getElementById("el");
const nosotros = document.getElementById("nosotros");
const son = document.getElementById("son");

class Conjugation {
    constructor(yo, eres, el, nosotros, son) {
        this.yo = yo;
        this.eres = eres;
        this.el = el;
        this.nosotros = nosotros;
        this.son = son;
    }
}

const manualConjugations = {
    "ser": new Conjugation("fui", "fuiste", "fue", "fuimos", "fueron"),
    "dar": new Conjugation("di", "diste", "dio", "dimos", "dieron"),
    "ver": new Conjugation("vi", "viste", "vio", "vimos", "vieron"),
    "decir": new Conjugation("dije", "dijiste", "dijo", "dijimos", "dijeron"),
    "hacer": new Conjugation("hice", "hiciste", "hizo", "hicimos", "hicieron")
};
manualConjugations["ir"] = manualConjugations["ser"];

const stemReplacements = {
    "andar": "anduv",
    "venir": "vin",
    "estar": "estuv",
    "poder": "pud",
    "poner": "pus",
    "saber": "sup",
    "tener": "tuv",
    "venir": "vin",
    "querer": "quis",
    "decir": "dij",
    "traer": "traj",
    "conducir": "conduj",
    "producir": "produj",
    "traducir": "traduj",
    "detener": "detuv",
    "retener": "retuv",
    "contener": "contuv",
    "convenir": "convin",
    "prevenir": "previn",
    "componer": "compus",
    "descomponer": "descompus",
    "proponer": "propus",
    "disponer": "dispus",
    "predecir": "predij",
    "contradecir": "contradij",
    "deshacer": "deshic",
    "rehacer": "rehic",
    "haber": "hub"
};

const ARVerbEndings = new Conjugation("é", "aste", "ó", "amos", "aron");
const IRERVerbEndings = new Conjugation("í", "iste", "ió", "imos", "ieron");
const irregularVerbEndings = new Conjugation("e", "iste", "o", "imos", "ieron");
const reflexives = new Conjugation("me", "te", "se", "nos", "se");

const yoEndingChanges = {
    "car": "qué",
    "gar": "gué",
    "zar": "cé"
};

const validVerbEndings = ["ar", "ir", "er"];

function validate(verb) {
    if (!/\d/.test(verb)) {
        if (verb.slice(-2) == "se") {
            verb = verb.slice(0, -2);
        }

        return validVerbEndings.includes(verb.slice(-2));
    }
}

function conjugate(verb) {
    let verbStem = verb.slice(0, -2);
    const verbEnding = verb.slice(-2);

    if (verbEnding == "se") {
        const conjugations = conjugate(verbStem);
        return new Conjugation(
            reflexives.yo + " " + conjugations.yo,
            reflexives.eres + " " + conjugations.eres,
            reflexives.el + " " + conjugations.el,
            reflexives.nosotros + " " + conjugations.nosotros,
            reflexives.son + " " + conjugations.son
        )
    }

    if (verb in manualConjugations) {
        return manualConjugations[verb];
    }

    let endings = IRERVerbEndings;
    if (verbEnding == "ar") {
        endings = ARVerbEndings;
    }

    if (verb in stemReplacements) {
        verbStem = stemReplacements[verb];
        endings = irregularVerbEndings;
    }

    const conjugations = new Conjugation(
        verbStem + endings.yo,
        verbStem + endings.eres,
        verbStem + endings.el,
        verbStem + endings.nosotros,
        verbStem + endings.son
    )

    if (verbEnding in yoEndingChanges) {
        conjugations.yo = verbStem.slice(0, -1);
        conjugations.yo += yoEndingChanges[verb.slice(0, -3)]
    }

    return conjugations;
}

function setVisibility(visibility) {
    tableHeader.style.visibility = visibility;
    table.style.visibility = visibility;
}

input.addEventListener("input", () => {
    const verb = input.value.trim();

    if (validate(verb)) {
        const conjugation = conjugate(verb);

        setVisibility("visible");
        verbTitle.innerText = verb;
        spanishdictLink.href = "https://www.spanishdict.com/conjugate/" + verb;

        yo.innerText = conjugation.yo;
        eres.innerText = conjugation.eres;
        el.innerText = conjugation.el;
        nosotros.innerText = conjugation.nosotros;
        son.innerText = conjugation.son;

    } else {
        setVisibility("hidden");
    }
})

setVisibility("hidden");