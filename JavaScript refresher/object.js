const person = {
  name: 'Jerem',
  age: 29,
  greet() {
    console.log(`Salut, je suis ${this.name}`);
  }
};

person.greet();
console.log(person);
