import main from "./main";
import ServicesProvider from "./ServicesProvider";
import Classrooms from "./Classrooms";
import Courses from "./Courses";
import CardClassVisualizer from "./CardClassVisualizer";

main($);
const services = new ServicesProvider();
const classrooms = new Classrooms();
const courses = new Courses();
const visualizer = new CardClassVisualizer();
const days = new Array("mon", "tue", "wed", "thu", "fri", "sat");
const spinner = $("#spinner");
let idGroupSelected = 0;
let courseSelected;

$(document).ready(function () {
  if (localStorage.login == "false" || typeof localStorage.login == "undefined")
    window.location.href = "login.html";
  if ($(window).width() > 768) $("#sidebar").addClass("active");
  mkNotifications();
  spinner.fadeIn(1000);
  // Display schedule of default selected group on landing

  services.readGroups((majors) => {
    majorsList = JSON.parse(majors);
    idGroupSelected = majorsList[0].groups[0].group_id;
    $("#lblGroup").html(`
      ${majorsList[0].major} ${majorsList[0].groups[0].semester} semestre  ${
      majorsList[0].groups[0].group_letter ? group.group_letter : ""
    }`);
    if (majorsList[0].groups[0].approved)
      $("#chxApproved").attr("checked", "checked");
    majorsList.forEach((majorItem) => {
      item = `<button class='accordion'>
                <span><i class="fa fa-angle-right"></i></span> ${majorItem.major}
              </button><div class='panel'>`;
      majorItem.groups.forEach((group) => {
        item += `<button class='subitem' id='${group.group_id}'>${
          group.semester
        } semestre ${group.group_letter ? group.group_letter : ""}`;
        if (!Number(group.approved))
          item += "<span class='disapprove'> </span>";
        item += "</button>";
      });
      item += "</div>";
      $("#groups").append(item);
    });
    $(`#${idGroupSelected}`).addClass("subitem-selected");
    $(`#${idGroupSelected}`).parent().prev().click();
    courses.refresh(idGroupSelected);
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
    const textGroup = $(this).parent().prev().text() + " " + $(this).text();
    $("#lblGroup").html(textGroup);
    if (!$(this).children("span").hasClass("disapprove"))
      $("#chxApproved").prop("checked", true);
    else $("#chxApproved").prop("checked", false);
    $(`#${idGroupSelected}`).removeClass("subitem-selected");
    idGroupSelected = $(this).attr("id");
    $(this).addClass("subitem-selected");
    spinner.fadeIn(300);
    courses.refresh(idGroupSelected);
  });

  $("#logout").click(function () {
    localStorage.login = "false";
    location.reload(true);
    localStorage.user = null;
  });

  $("#btnEdit").click(function () {
    $("#sidebar").addClass("active");
    $("#menu").addClass("hidden");
    $("#control").removeClass("hidden");
    $(this).addClass("hidden");
  });

  $("#chxApproved").change(function () {
    spinner.fadeIn(300);
    courses.approveGroup(idGroupSelected, this.checked);
  });

  $("#selectCourses").change(function () {
    let courseSelected = courses.get($(this).val());
    $(".toggle-active").removeClass("toggle-active");
    fillCourseControl(courseSelected);
  });

  $(".toggle-btn").click(function () {
    if ($(this).hasClass("toggle-active")) {
      arrayClasses = courseSelected.classes;
      weekday = $(this).attr("id");

      sessionId = arrayClasses.find(function (session) {
        return session.weekday == weekday;
      }).class_id;
      deleteClass(sessionId);
      $(this).removeClass("toggle-active");
    } else {
      let missHours =
        courseSelected.required_class_hours -
        courses.calcAsigHours(courseSelected.classes);
      let startHour = new Date("01/01/1999 07:00");
      let endHour = new Date(startHour.getTime() + missHours * 60 * 60 * 1000);
      if (missHours > 0) {
        let newClass = new Object({
          class_id: $(this).attr("id"),
          start_hour:
            startHour.getHours() +
            ":" +
            (startHour.getMinutes() < 10 ? "0" : "") +
            startHour.getMinutes() +
            ":00",
          end_hour:
            endHour.getHours() +
            ":" +
            (endHour.getMinutes() < 10 ? "0" : "") +
            endHour.getMinutes() +
            ":00",
          weekday: $(this).attr("id"),
          classroom_name: classrooms.getClassrooms()[0],
        });
        courseSelected.classes.push(newClass);
        fillCourseControl(courseSelected);
        courses.addCreatedClass(newClass, courseSelected.course_id);
      } else {
        mkNoti("¡Ups!", "No puede asignar más clases.", {
          status: "warning",
          duration: 5000,
        });
      }
    }
  });

  $("#dayCards").on("click", ".btn-delete-class", function () {
    classInfo = $(this).attr("id").split("-");
    deleteClass(classInfo[1]);
    $("#" + classInfo[0]).removeClass("toggle-active");
  });

  $("#dayCards").on("change", ".selectClassroom", function () {
    idSession = $(this).attr("id");
    classEdited = courseSelected.classes.find(function (item) {
      return item.class_id == idSession;
    });
    classEdited.classroom_name = $(this).val();
    courses.addEditedClass(classEdited, courseSelected.course_id);
  });

  $("#dayCards").on("focus", ".date", function () {
    let prevPeriod;
    let startHour = $(this);
    let endHour;
    let idElement = $(this).attr("id");
    let idClass = idElement.split("-")[1];
    if (idElement == "startHour-" + idClass) {
      endHour = $("#endHour-" + idClass);
    } else {
      startHour = $("#startHour-" + idClass);
      endHour = $(this);
    }

    $(this).timepicker({
      hours: { starts: 7, ends: 21 },
      minutes: {
        starts: 0,
        ends: 30,
        interval: 30,
      },
      beforeShow: function (time, inst) {
        let startDate = new Date("01/01/1999 " + startHour.val() + ":00");
        let endDate = new Date("01/01/1999 " + endHour.val() + ":00");
        prevPeriod = (endDate.getTime() - startDate.getTime()) / 3600000;
      },
      onSelect: function (time, inst) {
        let startDate = new Date("01/01/1999 " + startHour.val() + ":00");
        let endDate = new Date("01/01/1999 " + endHour.val() + ":00");
        let currentPeriod = (endDate.getTime() - startDate.getTime()) / 3600000;

        let maxPeriod =
          courseSelected.required_class_hours -
          courses.calcAsigHours(courseSelected.classes) +
          prevPeriod;
        if (currentPeriod > maxPeriod || currentPeriod <= 0) {
          if (currentPeriod <= 0) {
            mkNoti(
              "¡Ups!",
              "La hora inicial no puede ser mayor o igual que la hora final.",
              {
                status: "warning",
                duration: 4000,
              }
            );
            maxPeriod = prevPeriod;
            if (maxPeriod == 0) maxPeriod = 0.5;
          } else {
            mkNoti("¡Ups!", "Superó el máximo de horas faltantes.", {
              status: "warning",
              duration: 4000,
            });
          }

          if (idElement == "startHour-" + idClass) {
            endDate.setHours(startDate.getHours());
            endDate.setMinutes(60 * maxPeriod);
            if (startDate.getHours() == endDate.getHours())
              endDate.setMinutes(60);
            if (
              endDate.getHours() > 21 ||
              endDate.getDay() != startDate.getDay()
            ) {
              startHour.val("20:30");
              endHour.val("21:00");
            } else
              endHour.val(
                (endDate.getHours() < 10
                  ? "0" + endDate.getHours()
                  : endDate.getHours()) +
                  ":" +
                  (endDate.getMinutes() == 0
                    ? endDate.getMinutes() + "0"
                    : endDate.getMinutes())
              );
          } else {
            startDate.setHours(endDate.getHours());
            startDate.setMinutes(60 * (-1 * maxPeriod) + 30);
            if (startDate.getHours() == endDate.getHours())
              startDate.setMinutes(-60);
            if (
              startDate.getHours() < 7 ||
              endDate.getDay() != startDate.getDay()
            ) {
              startHour.val("07:00");
              endHour.val("07:30");
            } else
              startHour.val(
                (startDate.getHours() < 10
                  ? "0" + startDate.getHours()
                  : startDate.getHours()) +
                  ":" +
                  (startDate.getMinutes() == 0
                    ? startDate.getMinutes() + "0"
                    : startDate.getMinutes())
              );
          }
        }
        currentClass = courseSelected.classes.find(function (item) {
          return item.class_id == idClass;
        });
        currentClass.start_hour = startHour.val() + ":00";
        currentClass.end_hour = endHour.val() + ":00";
        courses.addEditedClass(currentClass, courseSelected.course_id);
      },
      onClose: function () {
        fillCourseControl(courseSelected);
      },
    });
  });

  $("#btnSave").click(function () {
    spinner.fadeIn(300);
    courses.saveChanges(idGroupSelected);
  });

  $("#btnCancel").click(function () {
    $("#control").addClass("hidden");
    $("#menu").removeClass("hidden");
    $("#btnEdit").removeClass("hidden");
    courses.refresh(idGroupSelected);
  });
});

function fillselectCourses(arrayCourses) {
  spinner.fadeOut(1000);
  let options = "";
  arrayCourses.forEach((course) => {
    options += `<option value=${course.course_id}>${course.subject_name}</option>`;
  });
  $("#selectCourses").html(options);
  if (typeof courseSelected == "undefined") {
    fillCourseControl(arrayCourses[0]);
  } else {
    $("#selectCourses").val(courseSelected.course_id);
    let course = arrayCourses.find(function (course) {
      return courseSelected.course_id == course.course_id;
    });
    if (typeof course == "undefined") {
      fillCourseControl(arrayCourses[0]);
    } else {
      $("#selectCourses").val(courseSelected.course_id);
      if ($("#chxApproved").attr("checked"))
        courses.validateApproved(idGroupSelected);
      fillCourseControl(course);
    }
  }
}

function fillCourseControl(course) {
  courseSelected = course;
  $(".toggle-btn").removeClass("toggle-active");
  $("#lblTeacher").html(course.professor_full_name);
  createClassesCards(course.classes);
  const asigHours = courses.calcAsigHours(course.classes);
  $("#lblAsigHours").html(asigHours);
  $("#lblMissHours").html(course.required_class_hours - asigHours);
}

function createClassesCards(classes) {
  let cards = "";

  const classesSorted = classes.sort((t1, t2) => {
    const day1 = days.indexOf(t1.weekday);
    const day2 = days.indexOf(t2.weekday);
    if (day1 > day2) {
      return 1;
    }
    if (day1 < day2) {
      return -1;
    }
    return 0;
  });

  classesSorted.forEach((session) => {
    let btnDay = $(`#${session.weekday}`);
    btnDay.addClass("toggle-active");

    cards += `<div class="card-day">
    <div class="container-delete-class"><i id="${session.weekday}-${
      session.class_id
    }" 
    class="btn-delete-class fa fa-times"></i></div>
    <div class="row">
      <div class="col-sm-3">
        <label>${btnDay.val()}</label>
      </div>
      <div class="col-sm-7 offset-md-2">
        <select class="selectClassroom" id="${session.class_id}">
          ${getClassroomOptions(session.classroom_name)}  
        </select>
      </div>
    </div>
    <div class="class-hours">
        <input class="date" type="text"
          id="startHour-${session.class_id}"
          value="${session.start_hour.substring(
            0,
            session.start_hour.length - 3
          )}"readonly/>
        <div class="divisor"></div>
        <input class= "date" type="text"
          id="endHour-${session.class_id}"
          value="${session.end_hour.substring(
            0,
            session.end_hour.length - 3
          )}"readonly/>
    </div>
  </div>`;
  });
  $("#dayCards").html(cards);
}

function getClassroomOptions(selected) {
  let options = "";
  classrooms.getClassrooms().forEach((classroom) => {
    options += "<option ";
    if (selected == classroom) options += "selected";
    options += ">" + classroom + "</option>";
  });
  return options;
}

function deleteClass(idSession) {
  classDeleted = courseSelected.classes.find(function (item) {
    return item.class_id == idSession;
  });

  courseSelected.classes = courseSelected.classes.filter(
    (item) => item.class_id != idSession
  );
  fillCourseControl(courseSelected);
  courses.addDeletedClass(classDeleted, courseSelected.course_id);
}

function changes(areChanges) {
  spinner.fadeOut(1000);
  if (areChanges) $("#btnSave").removeAttr("disabled");
  else $("#btnSave").attr("disabled", "disabled");
}

function approved(isApproved, id_group) {
  spinner.fadeOut(1000);
  if (isApproved) {
    $("#chxApproved").attr("checked", "checked");
    $("#" + id_group)
      .children("span")
      .removeClass(
        "disapprove",
        $("#" + id_group)
          .children("span")
          .hasClass("disapprove")
      );
  } else {
    $("#chxApproved").removeAttr("checked");
    if (
      !$("#" + id_group)
        .children("span")
        .hasClass("disapprove")
    ) {
      $("#" + id_group)
        .children("span")
        .addClass("disapprove");
    }
  }
}
