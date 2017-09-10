// Initialize Firebase (ADD YOUR OWN DATA)

var config = {
  apiKey: "AIzaSyCQhHan-7lbmOpMe_KBaGHHeazWOny-AWY",
  authDomain: "pedido-rapido.firebaseapp.com",
  databaseURL: "https://pedido-rapido.firebaseio.com",
  projectId: "pedido-rapido",
  storageBucket: "",
  messagingSenderId: "24193204225"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {


  if (user ) {
    var uid = user.uid;

    var query = firebase.database().ref("users/"+uid+"/").orderByKey();

    query.once("value")
      .then(function(snapshot) {

        //tipo = snapshot.child("tipo").val();
        switch(snapshot.child("tipo").val()){

          case "garçom":

            break;

          case "gerente":

            window.location.href = "relatorios.html";

            break;    
        }
    });
    // ...
  } else {
    // User is signed out.
    window.location.href = "index.html";
  }
});

function sair(){
  
  // Sign out user
  firebase.auth().signOut()
   .catch(function (err) {
     
   });

}


// User is signed in.
//Lista de produtos
var listaLanches = document.getElementById("lanchesFiller");                    

mostraProdutos("lanches", listaLanches);

//Lista de bebidas
var listaBebidas = document.getElementById("bebidasFiller");                    

mostraProdutos("bebidas", listaBebidas);

//Lista de extras
var listaExtras = document.getElementById("extrasFiller");                    

mostraProdutos("extras", listaExtras);





// Listen for form submit
document.getElementById('produtosForm').addEventListener('submit', submitForm);


// Submit form
function submitForm(e){
  e.preventDefault();

  var mesa = getInputVal('mesa');

  var inputs = document.getElementsByTagName('input');

  var pedido = [{}];
  for (i = 0; i < inputs.length; i++) { 
    var produto = inputs[i].name;
    var quantidade = (inputs[i].value == "") ? null : inputs[i].value;
    pedido[produto] = quantidade;
  }

  pedido["total"] = somaPrecos().toFixed(2);

  // Salvar pedido
  salvarPedido(pedido);

  // Show alert
  scroll(0,0);
  
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 seconds
  setTimeout(function(){
    document.querySelector('.alert').style.display = 'none';
  },3000);

  // Clear form
  document.getElementById('produtosForm').reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

function somaPrecos(){
  var inputs = document.getElementsByTagName('input');
  var soma = 0;
  for (i = 0; i < inputs.length; i++) { 

    var preco = inputs[i].getAttribute('preço').replace(',', '.');
    var quantidade = (inputs[i].value == "") ? 0 : inputs[i].value;
    soma += (Number(preco)  * Number(quantidade));
  }
  return soma;
} 

// Save message to firebase
function salvarPedido(pedido){
  // Reference messages collection
  var novoPedidoRef = firebase.database().ref("pedidos").push(pedido);
}

//Adiciona um produto ao HTML
function mostraProdutos(categoria, filler){
        // Reference messages collection
        var index = 1;
var query = firebase.database().ref(categoria).orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      
      var nomeProduto = childSnapshot.key;
      var precoProduto = childSnapshot.child("preço").val();

    var novoProduto = document.createElement("p");

    var labelProduto = document.createElement("label");
    var inputProduto = document.createElement("input");

    var textoLabel = document.createTextNode(nomeProduto + " - R$" + precoProduto);

    novoProduto.className += "full";

    labelProduto.appendChild(textoLabel);

    inputProduto.type = "number";

    inputProduto.id = categoria + index;

    inputProduto.name = nomeProduto;

    inputProduto.setAttribute('preço', precoProduto);

    novoProduto.appendChild(labelProduto);

    novoProduto.appendChild(inputProduto);    

    filler.appendChild(novoProduto);
      index++;

  });

});


}


