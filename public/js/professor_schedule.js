const professor = {
  names: "Diódora",
  first_lname: "Cantún",
  second_lname: "Pech",
  professor_id: "0001",
};

const services = new ServicesProvider();
const visualizer = new CardClassVisualizer();

// Logout button click handler
$("#schedule-controls__logout").click(() => {
  window.location.replace("login.html");
});

$("#schedule-title")
  .fadeTo(500, 1)
  .html(
    `${professor.names} ${professor.first_lname} ${professor.second_lname}`
  );

$(".hidden").fadeTo(500, 1);

// Print button click handler
$("#schedule-controls__print").click(() => {
  window.print();
});

services.readProfessorClasses(professor.professor_id, (classes) => {
  visualizer.render(JSON.parse(classes));
});
