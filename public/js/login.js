//Funcion de input para las animaciones
const animationInput = () => $(window, document, undefined).ready(function() {

  $('input').blur(function() {
    var $this = $(this);
    if ($this.val())
      $this.addClass('used');
    else
      $this.removeClass('used');
  });

  var $ripples = $('.ripples');

  $ripples.on('click.Ripples', function(e) {

    var $this = $(this);
    var $offset = $this.parent().offset();
    var $circle = $this.find('.ripplesCircle');

    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;

    $circle.css({
      top: y + 'px',
      left: x + 'px'
    });

    $this.addClass('is-active');

  });

  $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function(e) {
  	$(this).removeClass('is-active');
  });

});

animationInput();

///
const alert = (mensaje) => {
  //Se crea el elemento
  const div = document.createElement("div");
  div.classList.add("alert", "alert-danger");
  div.innerHTML = mensaje;

  //Se definen elementos que son utilizados para el alert
  const elementoPadre = document.querySelector(".card-body");
  const elementoDespues = document.querySelector(".form-group");
  //Se inserta el elemento
  elementoPadre.insertBefore(div, elementoDespues);

  setTimeout(()=>{
    document.querySelector('.alert.alert-danger').remove();
  } ,4000)
};

///Events listeners
document.getElementById("lostPassword").addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Recuperar contraseña");
});

document.getElementById("btnSesion").addEventListener("click", (event) => {
  event.preventDefault();

  const usernameLabel = document.getElementById("label-usuario");
  const passwordLabel = document.getElementById("label-password");
  //Obteniendo datos de los inputs
  const username = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  if (username == "") {
    usernameLabel.classList.add("text-danger");
  }
  if (password == "") {
    passwordLabel.classList.add("text-danger");
  }

  if (username != "" && password != "") {
    loginWithCredentials(username, password);
  } else {
    alert('Algun dato es incorrecto');
  }
});

function loginWithCredentials(username, password) {
  
  const request = { username: username.substring(1), password: password };
  const services = new ServicesProvider();
  const callback = () => window.location = "index.html";
  
  switch(username[0].toLowerCase()){
    case 'a':
      services.logInWithCredentials(request, callback, alert('Usuario o contraseña invalida'));
    break;
    case 'b':
      break;
    case 'c':
      break;
    default:
      alert('Usuario invalido')
    break;
  }
  
}
