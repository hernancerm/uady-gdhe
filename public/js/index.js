const services = new ServiceProvider();

$(document).ready(function () {
  services.ReadGroups((majors) => {
    majors =
      '[{"major":"Ciencias de la computación","groups":[{"group_id":"3","approved":"0","group_letter":null,"semester":"3"}]},{"major":"Ingeniería de software","groups":[{"group_id":"1","approved":"0","group_letter":"A","semester":"6"},{"group_id":"2","approved":"0","group_letter":"B","semester":"6"}]}]';
    majorsList = JSON.parse(majors);
    majorsList.forEach((majorItem) => {
      item = `<button>${majorItem.major}</button>`;

      majorItem.groups.forEach((group) => {
        item += `<button>${group.semester} semestre ${group.group_letter}</button>`;
      });
      $("#menu").append(item);
    });
  });
});

/*
  <button class="accordion">Section 1</button>
<div class="panel">
	<button class="subitem">SubSection 1</button>
    <button class="subitem">SubSection 2</button>
</div>
 */
