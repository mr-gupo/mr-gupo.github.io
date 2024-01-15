const randomWord = document.getElementById("random-word");

const vowels = "aeiou";
const consonants = "bcdfghjklmnpqrstvwxyz";

const prefixes = [
    "a", "an", "auto", "anti",
    "co", "con", "di", "de",
    "en", "ex", "in", "non",
    "sub", "tri", "uni", "un",
    "ed"
];
const suffixes = [
    "acy", "al", "dom", "ecy",
    "er", "ism", "ist", "ment",
    "or", "tion", 
];

const beginningConsonants = [
    "bl", "br", "cl", "cr",
    "dr", "fr", "tr", "fl",
    "gl", "gr", "pl", "pr",
    "sl", "sm", "sp", "st",
    "tr"
];
const endConsonants = [
    "ct", "ck", "ft", "ks",
    "ld", "lf", "lp", "lt",
    "mp", "nd", "nk", "nt",
    "pt", "rd", "rk", "rt",
    "sk", "sp", "st", "sm"
];

function choice(item) {
    return item[Math.floor(Math.random() * item.length)];
};

function conjoin(list) {
    word = "";
    for (const items of list) {
        word = word.concat(choice(items))
    };
    
    return word;
};

const modes = [
    new Array(prefixes, beginningConsonants, vowels, endConsonants, suffixes),
    new Array(prefixes, beginningConsonants, vowels, endConsonants),
    new Array(beginningConsonants, vowels, endConsonants, suffixes),
    new Array(beginningConsonants, vowels, endConsonants),
    new Array(prefixes, vowels, beginningConsonants, vowels, endConsonants, suffixes),
    new Array(prefixes, vowels, beginningConsonants, vowels, endConsonants),
    new Array(vowels, beginningConsonants, vowels, endConsonants, suffixes),
    new Array(vowels, beginningConsonants, vowels, endConsonants),
    new Array(prefixes, vowels, beginningConsonants, vowels, endConsonants, suffixes),
    new Array(prefixes, vowels, beginningConsonants, vowels, endConsonants),
    new Array(vowels, beginningConsonants, vowels, endConsonants, suffixes),
    new Array(vowels, beginningConsonants, vowels, endConsonants),
    new Array(prefixes, consonants, vowels, endConsonants, suffixes),
    new Array(prefixes, consonants, vowels, endConsonants),
    new Array(consonants, vowels, endConsonants, suffixes),
    new Array(consonants, vowels, endConsonants),
    new Array(prefixes, vowels, consonants, vowels, endConsonants, suffixes),
    new Array(prefixes, vowels, consonants, vowels, endConsonants),
    new Array(vowels, consonants, vowels, endConsonants, suffixes),
    new Array(vowels, consonants, vowels, endConsonants),
    new Array(prefixes, consonants, vowels, consonants, suffixes),
    new Array(prefixes, consonants, vowels, consonants),
    new Array(consonants, vowels, consonants, suffixes),
    new Array(consonants, vowels, consonants)
];

function generateWord() {
    let word = "";
    mode = Math.floor(Math.random() * modes.length);
    selections = modes[mode];
    
    word = conjoin(selections);
    
    word = word.charAt(0).toUpperCase() + word.slice(1);
    return word.replace("tt", "t").replace("ii", "i").replace("dd", "d");
};

function generate() {
    randomWord.innerText = generateWord();
}