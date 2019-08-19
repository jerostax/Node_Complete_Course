// Asynchrone
const fetchData = () => {
  // Ici on créé une nouvelle promesse
  // 2 arguments
  // resolve (complète la promesse avec succès)
  // reject (rejette la promesse, renvoie une erreure)
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Done!');
    }, 1500);
  });
  return promise;
};

setTimeout(() => {
  console.log('Timer is done!');
  fetchData()
    .then(text => {
      console.log(text);
      return fetchData();
    })
    .then(text2 => {
      console.log(text2);
    });
}, 2000);

// Synchrone
console.log('Hello !');
console.log('Hi !');
