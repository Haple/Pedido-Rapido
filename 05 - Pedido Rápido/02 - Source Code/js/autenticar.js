var config = {
  apiKey: "AIzaSyCQhHan-7lbmOpMe_KBaGHHeazWOny-AWY",
  authDomain: "pedido-rapido.firebaseapp.com",
  databaseURL: "https://pedido-rapido.firebaseio.com",
  projectId: "pedido-rapido",
  storageBucket: "",
  messagingSenderId: "24193204225"
};
firebase.initializeApp(config);

var logado = false;
var uid = "";

// Listen for form submit
document.getElementById('loginForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
	e.preventDefault();

	// Login info
	var email = getInputVal('email');
	var senha = getInputVal('senha');
	var tipo = "";



	firebase.auth().signInWithEmailAndPassword(email, senha).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ...
	});


	if (logado) {

 		var query = firebase.database().ref("users/"+uid+"/").orderByKey();
		query.once("value")
		  .then(function(snapshot) {
		      //tipo = snapshot.child("tipo").val();
		      switch(snapshot.child("tipo").val()){
				case "garçom":
					window.location.href = "anotar.html";
					break;
				case "gerente":
					window.location.href = "relatorios.html";
					break;		
			}
		});


	}else{

		// User is signed out.
	    // ...
		document.querySelector('.alert').style.display = 'block';
		document.querySelector('.alert').style.backgroundColor = 'red';

		// Hide alert after 3 seconds
		setTimeout(function(){
			document.querySelector('.alert').style.display = 'none';
		},3000);

	}

}


firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    uid = user.uid;
	    logado = true;
	   
	  } else {
	    
	  	logado = false;

	  }
	});


// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}
