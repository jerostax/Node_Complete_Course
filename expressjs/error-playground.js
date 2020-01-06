const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  // Ici on créé notre erreur dans le cas ou on a pas les 2 arguments (new Error est une fonctionnalité de node)
  throw new Error('Invalid arguments');
};

try {
  console.log(sum(1));
} catch (error) {
  console.log('Error occured');
  console.log(error);
}
// Grâce au try catch, le server ne plante pas et on peut executer le code qui suit
console.log('this works!');
