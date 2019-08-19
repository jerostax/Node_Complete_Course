const person = {
  name: 'Jerem',
  age: 29,
  greet() {
    console.log(`Salut, je suis ${this.name}`);
  }
};

// Ca nous évite d'écrire person.name
// On déstructure à l'interieur des accolades
const printName = ({ name }) => {
  console.log(name);
};

printName(person);

// On peut déstructurer en dehors d'un fx aussi
const { name, age } = person;

console.log(name, age);

// Ca marche aussi sur les arrays
const hobbies = ['sports', 'cooking'];
// On peut choisir le nom qu'on veut (ici hooby1 et hobby2)
const [hobby1, hobby2] = hobbies;

console.log(hobby1, hobby2);
