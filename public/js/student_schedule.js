import ServicesProvider from "./ServicesProvider";
import CardClassVisualizer from "./CardClassVisualizer";

const student = JSON.parse(localStorage.user);

const services = new ServicesProvider();
const visualizer = new CardClassVisualizer();

if (localStorage.login == "false" || typeof localStorage.login == "undefined")
  window.location.href = "login.html";

document.title = `MySched ${student.names} ${student.first_lname}`;

// Logout button click handler
$("#schedule-controls__logout").click(() => {
  localStorage.login = "false";
  localStorage.user = null;
  location.reload(true);
});

services.readGroup(student.group_id, (group) => {
  const parsedGroup = JSON.parse(group);

  const groupLetter =
    parsedGroup.group_letter === null ? "" : parsedGroup.group_letter;

  $("#schedule-title")
    .fadeTo(500, 1)
    .html(`${parsedGroup.major} ${parsedGroup.semester} sem ${groupLetter}`);

  if (parsedGroup.approved === true) {
    $(".hidden").fadeTo(500, 1);

    // Print button click handler
    $("#schedule-controls__print").click(() => {
      window.print();
    });

    services.readGroupClasses(student.group_id, (classes) => {
      visualizer.render(JSON.parse(classes));
    });
  } else {
    // Show "Schedule not available" prompt if schedule is not approved
    $("#schedule-visualizer").empty();
    $(
      "<p>Su horario actualmente no se encuentra aprobado. Por favor regrese más tarde.</p>"
    )
      .hide()
      .appendTo("#schedule-visualizer")
      .fadeIn("normal");
  }
});
