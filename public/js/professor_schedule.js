import ServicesProvider from "./ServicesProvider";
import CardClassVisualizer from "./CardClassVisualizer";

const professor = JSON.parse(localStorage.user);

const services = new ServicesProvider();
const visualizer = new CardClassVisualizer();

if (localStorage.login == "false" || typeof localStorage.login == "undefined")
  window.location.href = "login.html";

document.title = `MySched ${professor.names} ${professor.first_lname}`;

// Logout button click handler
$("#schedule-controls__logout").click(() => {
  localStorage.login = "false";
  localStorage.user = null;
  location.reload(true);
});

$("#schedule-title")
  .fadeTo(500, 1)
  .html(
    `${professor.names} ${professor.first_lname} ${professor.second_lname}`
  );

services
  .readProfessorClasses(professor.professor_id)
  .then((response) => response.json())
  .then((classes) => {
    const numOfClasses = classes
      .map((collegeClass) => collegeClass.classes.length)
      .reduce((a, b) => a + b);

    if (numOfClasses > 0) {
      visualizer.render(classes);

      $(".hidden").fadeTo(500, 1);

      // Print button click handler
      $("#schedule-controls__print").click(() => {
        window.print();
      });
    } else {
      // Show "No classes assigned" prompt if no classes are assigned to the professor
      // from the approved groups.
      $("#schedule-visualizer").empty();
      $("<p>Actualmente no tiene clases asignadas de grupos aprobados.</p>")
        .hide()
        .appendTo("#schedule-visualizer")
        .fadeIn("normal");
    }
  });
