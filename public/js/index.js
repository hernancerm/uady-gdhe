const services = new ServicesProvider();
const classrooms = new Classrooms();
const courses = new Courses();
const days = new Array("mon", "tue", "wed", "thu", "fri", "sat", "sun");

var idGroupSelected = 0;
var courseSelected;

$(document).ready(function () {
  if ($(window).width() > 768) $("#sidebar").addClass("active");

  services.readGroups((majors) => {
    majorsList = JSON.parse(majors);
    idGroupSelected = majorsList[0].groups[0].group_id;
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
    var textGroup = $(this).parent().prev().text() + " " + $(this).text();
    $("#lblGroup").html(textGroup);
    $(`#${idGroupSelected}`).removeClass("subitem-selected");
    idGroupSelected = $(this).attr("id");
    $(this).addClass("subitem-selected");
    courses.refresh(idGroupSelected);
  });

  $("#logout").click(function () {
    //Session.close()
  });

  $("#btnEdit").click(function () {
    $("#sidebar").addClass("active");
    $("#menu").addClass("hidden");
    $("#control").removeClass("hidden");
    $(this).addClass("hidden");
  });

  $("#selectCourses").change(function () {
    var courseSelected = courses.get($(this).val());
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
      var missHours =
        courseSelected.required_class_hours -
        calcAsigHours(courseSelected.classes);
      var startHour = new Date("01/01/1999 07:00");
      var endHour = new Date(startHour.getTime() + missHours * 60 * 60 * 1000);
      if (missHours > 0) {
        var newClass = new Object({
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
        //ALERT
        console.log(courseSelected.required_class_hours);
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
    var prevHour;
    var prevPeriod;
    var startHour = $(this);
    var endHour;
    var idElement = $(this).attr("id");
    var idClass = idElement.split("-")[1];
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
        prevHour = time.value;
        var startDate = new Date("01/01/1999 " + startHour.val() + ":00");
        var endDate = new Date("01/01/1999 " + endHour.val() + ":00");
        prevPeriod = (startDate.getTime() - endDate.getTime()) / 3600000;
      },
      onSelect: function (time, inst) {
        var startDate = new Date("01/01/1999 " + startHour.val() + ":00");
        var endDate = new Date("01/01/1999 " + endHour.val() + ":00");

        if (startDate.getTime() < endDate.getTime()) {
          currentPeriod = (startDate.getTime() - endDate.getTime()) / 3600000;
          difPeriod = prevPeriod - currentPeriod;
          missHours =
            courseSelected.required_class_hours -
            calcAsigHours(courseSelected.classes);
          if (difPeriod > 0 && difPeriod > missHours) {
            $(this).val(prevHour);
            //ALERT ERROR
          } else {
            currentClass = courseSelected.classes.find(function (item) {
              return item.class_id == idClass;
            });
            currentClass.start_hour = startHour.val() + ":00";
            currentClass.end_hour = endHour.val() + ":00";
            courses.addEditedClass(currentClass, courseSelected.course_id);
            prevHour = time;
          }
        } else {
          $(this).val(prevHour);
          //ALERT ERROR
        }
      },
      onClose: function () {
        fillCourseControl(courseSelected);
      },
    });
  });

  $("#btnSave").click(function () {
    courses.saveChanges(idGroupSelected);
  });

  $("#btnCancel").click(function () {
    $("#control").addClass("hidden");
    $("#menu").removeClass("hidden");
    $("#btnEdit").removeClass("hidden");
    courses.refresh(idGroupSelected);
  });
});

function fillselectCourses(courses) {
  var options = "";
  courses.forEach((course) => {
    options += `<option value=${course.course_id}>${course.subject_name}</option>`;
  });
  $("#selectCourses").html(options);
  fillCourseControl(courses[0]);
}

function fillCourseControl(course) {
  courseSelected = course;
  $(".toggle-btn").removeClass("toggle-active");
  $("#lblTeacher").html(course.professor_full_name);
  createClassesCards(course.classes);
  var asigHours = calcAsigHours(course.classes);
  $("#lblAsigHours").html(asigHours);
  $("#lblMissHours").html(course.required_class_hours - asigHours);
}

function createClassesCards(classes) {
  var cards = "";

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
    var btnDay = $(`#${session.weekday}`);
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

function calcAsigHours(classes) {
  var hours = 0;
  classes.forEach((session) => {
    var timeStart = new Date("01/01/1999 " + session.start_hour);
    var timeEnd = new Date("01/01/1999 " + session.end_hour);
    hours += (timeEnd.getTime() - timeStart.getTime()) / 3600000; //3,600,000= hours(60)*minutes(60)*milliseconds(1000);
  });
  return hours;
}

function getClassroomOptions(selected) {
  var options = "";
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
