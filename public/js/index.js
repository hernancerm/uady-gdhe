const services = new ServiceProvider();
var idGroupSelected = 0;

$(document).ready(function () {
  $("#sidebar").removeClass("active");
  services.ReadGroups((majors) => {
    majorsList = JSON.parse(majors);
    idGroupSelected = "group" + majorsList[0].groups[0].group_id;
    majorsList.forEach((majorItem) => {
      item = `<button class='accordion'><span><i class="fa fa-angle-right"></i></span>${majorItem.major}</button><div class='panel'>`;
      majorItem.groups.forEach((group) => {
        item += `<button class='subitem' id='group${group.group_id}'> ${
          group.semester
        } semestre ${group.group_letter ? group.group_letter : ""}`;
        if (!Number(group.approved))
          item += "<span class='disapprove'> </span>";
        item += "</button>";
      });
      item += "</div>";
      $("#groups").append(item);

      $(`#${idGroupSelected}`).addClass("subitem-selected");
      $(`#${idGroupSelected}`).parent().prev().click();

      //services.ReadCoursesByGroup(idGroupSelected)=>{ showCourses() };
    });
  });

  $("#groups").on("click", ".accordion", function () {
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
    $(`#${idGroupSelected}`).removeClass("subitem-selected");
    idGroupSelected = $(this).attr("id");

    $(this).addClass("subitem-selected");
  });

  $("#logout").click(function () {});
});
