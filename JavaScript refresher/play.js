var name = 'Jerem';
var age = 29;
var hasHobbies = true;

function summarizeUser(userName, userAge, userHasHobby) {
  return `Le nom est ${userName}, l'âge est ${userAge} ans et l'utilisateur a des hobbies : ${userHasHobby}`;
}

// Run node play.js dans votre terminal pour voir le console log
console.log(summarizeUser(name, age, hasHobbies));

// Utilisons le mot clé let maintenant
let letName = 'Alex';
let letAge = 29;
let letHasHobbies = true;

console.log(summarizeUser(letName, letAge, letHasHobbies));

// Cette fois ci le mot const pour les variables ou l'on ne change pas la valeur
const constName = 'Qays';
// Comme l'âge change, on utilisera pas le mot clé const
let letAge2 = 29;
const constHasHobbies = true;

console.log(summarizeUser(constName, letAge2, constHasHobbies));

// Arrow FX
// Réécrivons notre fonction en fonction flêchée
// L'avantage est que le mot clé this est bindé
const summarizeUserArrow = (userName, userAge, userHasHobby) => {
  return `Le nom est ${userName}, l'âge est ${userAge} ans et l'utilisateur a des hobbies : ${userHasHobby}`;
};
const add = (a, b) => a + b;
// Pas besoin de parenthèse s'il n'y a qu'un argument
const addOne = a => a + 1;
// S'il n'y a pas d'argument, il faut placer des parenthèses vides
const addRandom = () => 1 + 5;

console.log(summarizeUserArrow(constName, letAge2, constHasHobbies));
console.log(add(3, 2));
console.log(addOne(2));
console.log(addRandom());
