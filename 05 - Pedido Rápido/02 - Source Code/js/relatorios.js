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


//Lista de relatórios
var listaRelatorios = document.getElementById("relatoriosFiller");                    

// Listen for form submit
document.getElementById('relatoriosForm').addEventListener('submit', submitForm);


// Submit form
function submitForm(e){

  e.preventDefault();

  var dataRelatorio = document.getElementById("dataRelatorio").value;

  var ano = dataRelatorio.substr(0,4);

  var mes = dataRelatorio.substr(5,2);

  var dia = dataRelatorio.substr(8,2);

  // Apresenta os relatórios de determinado mês
  relatoriosMes(ano, mes, dia);

}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}


//Adiciona um produto ao HTML
function relatoriosMes(ano, mes, dia){
  var totalAno = 0;
  var totalMes = 0;
  var totalDia = 0;

  // Referência da coleção de relatórios
  var query = firebase.database().ref("relatorios/").orderByKey();

  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        
        var codigoRelatorio = childSnapshot.key;

        var objetoRelatorio = childSnapshot.val();  

        totalMes += (objetoRelatorio["ano"] == ano && objetoRelatorio["mes"] == mes)?  parseFloat(objetoRelatorio["total"]) : 0 ;


        totalAno += (objetoRelatorio["ano"] == ano) ? parseFloat(objetoRelatorio["total"]) : 0;

        totalDia += (objetoRelatorio["ano"] == ano && objetoRelatorio["mes"] == mes && objetoRelatorio["dia"] == dia) ? parseFloat(objetoRelatorio["total"]) : 0;

        //alert('Ano:' + totalAno + "\n" + "Mes:" + totalMes + "\n" + "Dia: " + totalDia);

    });

    mostraRelatorioMes(totalAno, totalMes, totalDia);

  });

}


function somaMes(incremento){



}


function mostraRelatorioMes(somaAno, somaMes, somaDia){

  var novoRelatorio = document.createElement("p");

  novoRelatorio.className += "card";

  var spanTotalDia = document.createElement("span");
  var textoTotalDia = document.createTextNode("Total do dia: " + somaDia);
  spanTotalDia.appendChild(textoTotalDia);

  var spanTotalMes = document.createElement("span");
  var textoTotalMes = document.createTextNode("Total do mês: " + somaMes);
  spanTotalMes.appendChild(textoTotalMes);

  var spanTotalAno = document.createElement("span");
  var textoTotalAno = document.createTextNode("Total do ano: " + somaAno);
  spanTotalAno.appendChild(textoTotalAno);

  novoRelatorio.appendChild(spanTotalDia);
  var breakPedido = document.createElement("hr");
  novoRelatorio.appendChild(breakPedido);

  novoRelatorio.appendChild(spanTotalMes);
  breakPedido = document.createElement("hr");
  novoRelatorio.appendChild(breakPedido);

  novoRelatorio.appendChild(spanTotalAno);
  breakPedido = document.createElement("hr");
  novoRelatorio.appendChild(breakPedido);

  listaRelatorios.innerHTML = "";

  listaRelatorios.appendChild(novoRelatorio);

}
