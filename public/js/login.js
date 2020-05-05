// Input function for animations
const animationInput = () =>
  $(window, document, undefined).ready(function () {
    localStorage.login = "false";
    $("input").blur(function () {
      var $this = $(this);
      if ($this.val()) $this.addClass("used");
      else $this.removeClass("used");
    });

    var $ripples = $(".ripples");

    $ripples.on("click.Ripples", function (e) {
      var $this = $(this);
      var $offset = $this.parent().offset();
      var $circle = $this.find(".ripplesCircle");

      var x = e.pageX - $offset.left;
      var y = e.pageY - $offset.top;

      $circle.css({
        top: y + "px",
        left: x + "px",
      });

      $this.addClass("is-active");
    });

    $ripples.on(
      "animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd",
      function (e) {
        $(this).removeClass("is-active");
      }
    );
  });

animationInput();

const showErrorPrompt = (mensaje) => {
  //Element is created
  const div = document.createElement("div");
  div.classList.add("alert", "alert-danger");
  div.innerHTML = mensaje;

  //Elements are defined that are used for the alert
  const parentElement = document.querySelector(".card-body");
  const beforeElement = document.querySelector(".form-group");
  //
  if (document.querySelector(".alert.alert-danger") == null) {
    parentElement.insertBefore(div, beforeElement);
  }

  setTimeout(() => {
    document.querySelector(".alert.alert-danger").remove();
  }, 4000);
};

// Events listeners
document.getElementById("lostPassword").addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Recuperar contraseña");
});

document.getElementById("btnSesion").addEventListener("click", (event) => {
  event.preventDefault();

  const usernameLabel = document.getElementById("label-user");
  const passwordLabel = document.getElementById("label-password");
  //Obtaining data from the inputs
  const username = document.getElementById("user").value;
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
    showErrorPrompt("Usuario o contraseña incorrecto.");
  }
});

function loginWithCredentials(username, password) {
  const request = { username: username.substring(1), password: password };

  const services = new ServicesProvider();

  switch (username[0]) {
    case "A":
      services.logInWithCredentials(
        request,
        (data) => {
          userData = JSON.parse(data);
          localStorage.login = "true";
          window.location = `index.html?names=${userData.names}&first_lname=${userData.first_lname}&second_lname=${userData.second_lname}`;
        },
        () => showErrorPrompt("Usuario o contraseña incorrecto.")
      );
      break;
    case "S":
      services.logInStudentWithCredentials(
        request,
        (data) => {
          userData = JSON.parse(data);
          window.location = `student_schedule.html?names=${userData.names}&first_lname=${userData.first_lname}&second_lname=${userData.second_lname}&group_id=${userData.group_id}`;
        },
        () => showErrorPrompt("Usuario o contraseña incorrecto.")
      );
      break;
    case "P":
      services.logInProfessorWithCredentials(
        request,
        (data) => {
          userData = JSON.parse(data);
          window.location = `professor_schedule.html?names=${userData.names}&first_lname=${userData.first_lname}&second_lname=${userData.second_lname}&professor_id=${userData.professor_id}`;
        },
        () => showErrorPrompt("Usuario o contraseña incorrecto.")
      );
      break;
    default:
      () => showErrorPrompt("Usuario no registrado.");
      break;
  }
}
