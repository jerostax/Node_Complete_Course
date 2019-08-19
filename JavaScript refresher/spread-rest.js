// The spread and rest operators
// Imagineons que nous voulons créer un nouvel array à chaque fois qu'on y rajoute une propriété

const hobbies = ['sports', 'cooking'];
// Onn peut utiliser l'opérateur spread '...'
const copiedArray = [...hobbies];
// Ici on a créé un nouveau tableau avec les propriétés du tableau original
console.log(copiedArray);

// On peut faire la même chose sur un objet
const person = {
  name: 'Jerem',
  age: 29,
  greet() {
    console.log(`Salut, je suis ${this.name}`);
  }
};

const copiedPerson = { ...person };

console.log(copiedPerson);

// Voyons l'opérateur rest
// C'est l'inverse de l'opérateur spread
// Ici on lui dit de passer les arguments dans un tableau
const toArray = (...args) => {
  return args;
};

console.log(toArray(1, 2, 3, 4));
