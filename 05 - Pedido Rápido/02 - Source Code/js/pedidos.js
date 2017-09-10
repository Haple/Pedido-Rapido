var preco;
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


//Lista de produtos
var listaPedidos = document.getElementById("pedidosFiller");                    

mostrarPedidos(listaPedidos);

// Listen for form submit
document.getElementById('produtosForm').addEventListener('submit', submitForm);


// Submit form
function submitForm(e){

  e.preventDefault();

  var button = document.getElementById(e.id);
  var total = button.getAttribute('total');

  excluirPedido(e.id, total);

 
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

// Salvar pedido no Firebase
function salvarPedido(pedido){
  // Reference messages collection
  var novoPedidoRef = firebase.database().ref("pedidos").push(pedido);
}

// Deletar pedido do firebase
function excluirPedido(pedido, total){
  var currDate = new Date();
  var dia = currDate.getDate();
  var ano = currDate.getFullYear();
  var mes = currDate.getMonth() + 1;
  var hoje = ano +'/' + mes + '/' + dia;
  // Reference messages collection
  var novoRelatorioRef = firebase.database().ref("relatorios/").push({
    total: total,
    ano: ano,
    mes: mes,
    dia: dia
  });
  var pedidoConcluido = firebase.database().ref("pedidos/" + pedido).remove();
}

//Adiciona um produto ao HTML
function mostrarPedidos(filler){
        // Reference messages collection
var query = firebase.database().ref("pedidos/").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      
      var codigoPedido = childSnapshot.key;
      var objetoPedido = childSnapshot.val();

      var novoPedido = document.createElement("p");

      novoPedido.className += "card";

      var labelMesa = document.createElement("label");

      var numeroMesa = document.createTextNode("Mesa " + objetoPedido["mesa"]);

      delete objetoPedido["mesa"]; 

      labelMesa.appendChild(numeroMesa);

      novoPedido.appendChild(labelMesa);

      novoPedido.appendChild(document.createElement("hr"));
      


      for (var pedido in objetoPedido) {
        var nomeProduto = pedido;

        var quantidadeProduto = objetoPedido[nomeProduto];

        if(nomeProduto == "total") break;

        var spanPedido = document.createElement("span");


        var textoSpan = document.createTextNode(nomeProduto + " x " + quantidadeProduto);

        spanPedido.appendChild(textoSpan);

        novoPedido.appendChild(spanPedido);

        var breakPedido = document.createElement("br");

        novoPedido.appendChild(breakPedido);

      }

      novoPedido.appendChild(document.createElement("hr"));

        var total = objetoPedido["total"];

        var labelTotal = document.createElement("label");

        var textoTotal = document.createTextNode("Total: " + total);

        labelTotal.appendChild(textoTotal);

        novoPedido.appendChild(labelTotal);

        delete objetoPedido["total"]; 


      var excluirPedido = document.createElement("button");

      excluirPedido.className = "fa fa-check";

      excluirPedido.type = "submit";

      var stringOnClick = "excluirPedido('" + childSnapshot.key + "', '" + total + "')";

      excluirPedido.setAttribute('onClick', stringOnClick);

      excluirPedido.id = childSnapshot.key;

      excluirPedido.setAttribute('total', total);      

      var textoExcluir = document.createTextNode(" Concluído");

      excluirPedido.appendChild(textoExcluir);


      novoPedido.appendChild(excluirPedido);


      filler.appendChild(novoPedido);

  });

});


}


function precoLanche(lanche){
  var ref = firebase.database().ref("lanches/" + lanche);
  ref.once("value").resolve(true)
  .then(function(snapshot) {
    preco = snapshot.child("preço").val();
  });
}