const deleteProduct = btn => {
  console.log(btn);
  // Ici on accède à l'input qui a le name productId pour récupérer cet id
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_crsf]').value;
};
