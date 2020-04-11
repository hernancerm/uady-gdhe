const services = new ServiceProvider();

$(document).ready(function () {
  services.ReadGroups((majors) => {
    majorsList = JSON.parse(majors);
    majorsList.forEach((majorItem) => {
      item = `<button class='accordion'><span><i class="fa fa-angle-right"></i></span>${majorItem.major}</button><div class='panel'>`;

      majorItem.groups.forEach((group) => {
        item += `<button class='subitem' value='${group.group_id}'> ${
          group.semester
        } semestre ${group.group_letter ? group.group_letter : ""}`;
        if (!Number(group.approved))
          item += "<span class='disapprove'> </span>";
        item += "</button>";
      });
      item += "</div>";
      $("#groups").append(item);
    });
  });

  $("#groups").on("click", ".accordion", function () {
    $(this).toggleClass("active");
    ico = $(this).find(".fa");
    panel = $(this).next();
    panelHeight = panel.css("height");

    if (panelHeight.substring(0, panelHeight.length - 2) > 0) {
      panel.css("max-height", "0");
      ico.css("transform", "rotate(0deg)");
    } else {
      panel.css("max-height", panel.prop("scrollHeight") + "px");
      ico.css("transform", "rotate(90deg)");
    }
  });

  $("#groups").on("click", ".subitem", function () {
    alert($(this).val());
  });

  $("#logout").click(function () {
    alert("Adios guapo :*");
  });
});
