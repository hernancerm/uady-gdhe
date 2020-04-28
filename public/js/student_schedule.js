const student = {
  names: "Hernán",
  first_lname: "Cervera",
  second_lname: "Manzanilla",
  group_id: "1",
};

const services = new ServicesProvider();
const visualizer = new CardClassVisualizer();

services.readGroup(student.group_id, (group) => {
  if (JSON.parse(group).approved === true) {
    $(".hidden").fadeTo(500, 1);
    services.readClassesGroupedByWeekday(student.group_id, (classes) => {
      visualizer.render(JSON.parse(classes));
    });
  }
});
