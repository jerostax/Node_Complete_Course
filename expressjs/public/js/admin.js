const deleteProduct = btn => {
  console.log(btn);
  // Ici on accède à l'input qui a le name productId pour récupérer cet id
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  // Même opération avec le csrf token
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  // closest() est une méthode qui nous permet de trouver l'élement le plus proche
  // ici l'élement avec la classe article le plus proche du btn sur lequel on a cliqué (ca va nous permettre de delete l'article côté front)
  const productElement = btn.closest('article');

  // fetch() est une méthode comprise par le navigateur pour envoyer ou fetch des requêtes http
  fetch('/admin/product/' + prodId, {
    // Ici on set la méthode et le csrf token dans le headers
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then(result => {
      // console.log(result);
      return result.json();
    })
    .then(data => {
      console.log(data);
      // Ici on remove/supprimé l'élément article qui contient le produit qu'on vient de delete
      // note: pourrait être productElement.remove() mais c'est pas compris par IE donc on utilise le code ci-dessous
      productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
      console.log(err);
    });
};
