const deleteProduct = btn => {
  console.log(btn);
  // Ici on accède à l'input qui a le name productId pour récupérer cet id
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  // Même opération avec le csrf token
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  // fetch() est une méthode comprise par le navigateur pour envoyer ou fetch des requêtes http
  fetch('/admin/product/' + prodId, {
    // Ici on set la méthode et le csrf token dans le headers
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};
