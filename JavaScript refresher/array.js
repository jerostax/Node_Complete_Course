const hobbies = ['Sports', 'Cooking'];

for (let hobby of hobbies) {
  console.log(hobby);
}

// map retourne un nouveau tableau (ne change pas le tableau initial)
console.log(
  hobbies.map(hobby => {
    return `Hobby : ${hobby}`;
  })
);

console.log(hobbies);

// On peut update un array ou un objet même s'il est stocké dans une variable const
hobbies.push('Programming');
console.log(hobbies);
