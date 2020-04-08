const services = new ServiceProvider();

$(document).ready(function () {
  services.ReadGroups((majors) => {
    majorsList = JSON.parse(majors);
    majorsList.forEach((majorItem) => {
      item = `<button class='accordion'>${majorItem.major}</button>`;

      majorItem.groups.forEach((group) => {
        item += `<button class='subitem'>${group.semester} semestre ${group.group_letter}</button>`;
      });
      $("#menu").append(item);
    });
  });

  $(".accordion").each(function (index) {
    $(this).click(function () {
      $(this).toggleClass("active");
      panel = $(this).nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  $(".subitem").each(function (index) {
    $(this).click(function () {
      alert("www");
    });
  });
});
