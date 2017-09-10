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

            window.location.href = "anotar.html";  

            break;

          case "gerente":

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


// Listen for form submit
document.getElementById('produtoForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var nome = getInputVal('nome');
  var tipo = getInputVal('tipo');
  var preco = getInputVal('preço');
  var desc = getInputVal('desc');


  // Save message
  salvarProduto(nome, tipo, preco, desc);

  // Show alert
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 seconds
  setTimeout(function(){
    document.querySelector('.alert').style.display = 'none';
  },3000);

  // Clear form
  document.getElementById('produtoForm').reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save message to firebase
function salvarProduto(nome, tipo, preco, desc){
  // Reference messages collection
  var novoProdutoRef = firebase.database().ref(tipo + "/" + nome).set({
    preço:preco,
    descrição:desc
  });

}