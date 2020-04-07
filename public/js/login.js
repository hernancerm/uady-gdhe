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

  if (username != "" && password != "") {
    loginWithCredentials(username, password);
  } else {
    
    alert('Algun dato es incorrecto');
    if (username == "") {
      usernameLabel.classList.add("text-danger");
    }
    if (password == "") {
      passwordLabel.classList.add("text-danger");
    }
  }
});

function loginWithCredentials(username, password) {
  const url = `../src/services/READ_admin_BY_credentials.php`;
  const request = { username: username, password: password };
  fetch(url, { method: "POST", body: JSON.stringify(request) })
    .then((res) => res.json())
    .then((data) => {
      ///Ingresa al login basico
      //window.location="ARCHIVO A DIRECCIONAR"
      console.log(data);
    })
    .catch((error) => alert('Usuario o contraseña incorrecto'));
}
