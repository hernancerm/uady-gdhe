const services = new ServicesProvider();
const classrooms = new Classrooms();
const courses = new Courses();
const visualizer = new CardClassVisualizer();
const days = new Array("mon", "tue", "wed", "thu", "fri", "sat", "sun");

var idGroupSelected = 0;
var courseSelected;

$(document).ready(function () {
  $("#sidebar").removeClass("active");

  services.readGroups((majors) => {
    majorsList = JSON.parse(majors);
    idGroupSelected = majorsList[0].groups[0].group_id;

    // Display schedule of default selected group on landing
    services.readClassesGroupedByWeekday(idGroupSelected, (collegeClasses) => {
      visualizer.render(JSON.parse(collegeClasses));
    });

    majorsList.forEach((majorItem) => {
      item = `<button class='accordion'><span><i class="fa fa-angle-right"></i></span>${majorItem.major}</button><div class='panel'>`;
      majorItem.groups.forEach((group) => {
        item += `<button class='subitem' id='${group.group_id}'> ${
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
    $(`#${idGroupSelected}`).removeClass("subitem-selected");
    idGroupSelected = $(this).attr("id");
    $(this).addClass("subitem-selected");
    courses.refresh(idGroupSelected);

    services.readClassesGroupedByWeekday(idGroupSelected, (collegeClasses) => {
      visualizer.render(JSON.parse(collegeClasses));
    });
  });

  $("#logout").click(function () {
    //Session.close()
  });

  $("#btnEdit").click(function () {
    $("#control").toggleClass("hidden");
    $("#menu").toggleClass("hidden");
    $(this).toggleClass("hidden");
  });

  $("#btnCancel").click(function () {
    $("#control").toggleClass("hidden");
    $("#menu").toggleClass("hidden");
    $("#btnEdit").toggleClass("hidden");
    courses.refresh(idGroupSelected);
  });

  $(".toggle-btn").click(function () {
    var missHours =
      courseSelected.required_class_hours -
      calcAsigHours(courseSelected.classes);
    var starHour = new Date("01/01/1999 07:00");
    var endHour = new Date(starHour.getTime() + missHours * 60 * 60 * 1000);
    if (missHours > 0) {
      var newClass = new Object({
        class_id: $(this).attr("id"),
        start_hour: starHour.getHours() + ":" + starHour.getMinutes(),
        end_hour: endHour.getHours() + ":" + endHour.getMinutes(),
        weekday: $(this).attr("id"),
        classroom_name: classrooms.getClassrooms()[0],
      });
      courseSelected.classes.push(newClass);
      fillCourseControl(courseSelected);
    } else {
      //ALERT
      console.log(courseSelected.required_class_hours);
    }
  });

  $("#selectCourses").change(function () {
    var courseSelected = courses.get($(this).val());
    $(".toggle-active").removeClass("toggle-active");
    fillCourseControl(courseSelected);
  });

  $("#dayCards").on("focus", ".date", function () {
    var prevHour;
    $(this).timepicker({
      hours: { starts: 7, ends: 21 },
      minutes: {
        starts: 0,
        ends: 30,
        interval: 30,
      },
      beforeShow: function (time, inst) {
        prevHour = time.value;
      },
      onSelect: function (time, inst) {
        console.log(prevHour, time);
        prevHour = time;
      },
    });
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
    var timeStart = new Date("01/01/1999 " + session.start_hour);
    var timeEnd = new Date("01/01/1999 " + session.end_hour);
    btnDay.addClass("toggle-active");

    cards += `<div class="card-day container-fluid">
    <div class="row">
      <div class="col-sm-3">
        <label>${btnDay.val()}</label>
      </div>
      <div class="col-sm-7 offset-md-2">
        <select id="selectClassroom${session.class_id}">
          ${getClassroomOptions(session.classroom_name)}  
        </select>
      </div>
    </div>
    <div class="class-hours">
        <input class= date type="text"
          id="startHour${session.class_id}"
          value="${timeStart.getHours()}:${
      (timeStart.getMinutes() < 10 ? "0" : "") + timeStart.getMinutes()
    }"readonly/>
        <div class="divisor"></div>
        <input class= date type="text"
          id="EndHour${session.class_id}"
          value="${timeEnd.getHours()}:${
      (timeEnd.getMinutes() < 10 ? "0" : "") + timeEnd.getMinutes()
    }"readonly/>
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
