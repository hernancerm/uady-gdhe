import ServicesProvider from "./ServicesProvider.mjs";
import {
  changes,
  fillselectCourses,
  visualizer,
  spinner,
  approved,
} from "./index";

export default class Courses {
  refresh(group_id) {
    new ServicesProvider()
      .readCourses(group_id)
      .then((response) => response.json())
      .then((courses) => {
        this.courses = courses;
        new ServicesProvider()
          .readClasses(group_id)
          .then((response) => response.json())
          .then((jsonClasses) => {
            const classes = jsonClasses;

            Array.prototype.forEach.call(this.courses, (course) => {
              course.classes = classes.find(function (sessions) {
                return sessions.course_id == course.course_id;
              }).classes;
            });
            this.classesCreated = new Array();
            this.classesEdited = new Array();
            this.classesDeleted = new Array();
            new ServicesProvider()
              .readGroupClasses(group_id)
              .then((response) => response.json())
              .then((collegeClasses) => {
                changes(false);
                fillselectCourses(this.courses);
                visualizer.render(collegeClasses);
                spinner.fadeOut(1000);
                mkNoti("¡Bien hecho!", "El horario cargó correctamente.", {
                  status: "success",
                  duration: 2000,
                });
              });
          });
      });
  }

  get = (course_id) =>
    this.courses.find(function (course) {
      return course.course_id == course_id;
    });

  addCreatedClass(item, course_id) {
    this.classesCreated.push(
      new Object({
        class: item,
        course_id: course_id,
      })
    );
    changes(true);
  }

  addEditedClass(item, course_id) {
    let newClassEdited = this.classesCreated.find(function (session) {
      return item.class_id == session.class.class_id;
    });
    if (newClassEdited) {
      newClassEdited.class = item;
    } else {
      let classEdited = this.classesEdited.find(function (session) {
        return item.class_id == session.class.class_id;
      });
      if (classEdited) {
        classEdited.class = item;
      } else {
        this.classesEdited.push(
          new Object({ class: item, course_id: course_id })
        );
      }
    }
    changes(true);
  }

  addDeletedClass(item, course_id) {
    const newClassDeleted = this.classesCreated.find(function (session) {
      return item.class_id == session.class.class_id;
    });
    if (newClassDeleted) {
      this.classesCreated = this.classesCreated.filter(
        (session) => item.class_id != session.class.class_id
      );
    } else {
      const classDeleted = this.classesEdited.find(function (session) {
        return item.class_id == session.class.class_id;
      });
      if (classDeleted) {
        this.classesEdited = this.classesEdited.filter(
          (session) => item.class_id != session.class.class_id
        );
      }
      this.classesDeleted.push(
        new Object({ class: item, course_id: course_id })
      );
    }
    changes(true);
  }

  saveChanges(group_id) {
    const $this = this;
    let successList = new Array();
    let errorList = new Array();
    let countTransacts =
      this.classesCreated.length +
      this.classesEdited.length +
      this.classesDeleted.length;

    this.classesCreated.forEach(function (item) {
      const addSuccess = function () {
        successList.push(new Object({ transcact: "creada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      const addError = function () {
        errorList.push(new Object({ transcact: "creada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      new ServicesProvider()
        .createClass(item)
        .then((response) => (response.ok ? addSuccess() : addError()));
    });

    this.classesEdited.forEach(function (item) {
      const addSuccess = function () {
        successList.push(new Object({ transcact: "editada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      const addError = function () {
        errorList.push(new Object({ transcact: "editada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      new ServicesProvider()
        .updateClass(item)
        .then((response) => (response.ok ? addSuccess() : addError()));
    });

    this.classesDeleted.forEach(function (item) {
      const addSuccess = function () {
        successList.push(new Object({ transcact: "eliminada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      const addError = function (data) {
        errorList.push(new Object({ transcact: "eliminada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      new ServicesProvider()
        .deleteClass(item)
        .then((response) => (response.ok ? addSuccess() : addError()));
    });
  }

  alertChanges(successList, errorList, group_id) {
    if (errorList.length > 0) {
      const content =
        "Las siguientes clases no se guardaron ya que tuvieron conflicto." +
        " Esto sucede ya que el profesor o el aula ya tienen otra clase asignada en ese horario." +
        this.loadTransactsContent(errorList);

      $.alert({
        title: "¡Oh no!",
        icon: "fa fa-exclamation-triangle",
        type: "red",
        content: content,
      });
    }

    if (successList.length > 0) {
      const content =
        "Las siguientes clases se actualizaron con éxito." +
        this.loadTransactsContent(successList);

      $.alert({
        title: "¡Bien hecho!",
        icon: "fa fa-thumbs-up",
        type: "blue",
        content: content,
      });
    }
    this.refresh(group_id);
  }

  loadTransactsContent(classes) {
    const $this = this;
    let content = "";
    const weekdays = new Map([
      ["mon", "Lunes"],
      ["tue", "Martes"],
      ["wed", "Miércoles"],
      ["thu", "Jueves"],
      ["fri", "Viernes"],
      ["sat", "Sábado"],
    ]);

    const classesSorted = classes.sort((t1, t2) => {
      const id1 = t1.class.course_id;
      const id2 = t2.class.course_id;
      if (id1 > id2) {
        return 1;
      }
      if (id1 < id2) {
        return -1;
      }
      return 0;
    });

    let idPrev = -1;
    classesSorted.forEach(function (item) {
      if (item.class.course_id != idPrev) {
        const courseName = $this.courses.find(function (course) {
          return item.class.course_id == course.course_id;
        }).subject_name;
        content += "<hr> <strong>" + courseName + "</strong> <br>";
        idPrev = item.class.course_id;
      }
      content += `&nbsp;&nbsp;&nbsp;${weekdays.get(
        item.class.class.weekday
      )}: ${item.class.class.start_hour.substring(
        0,
        item.class.class.start_hour.length - 3
      )} - ${item.class.class.end_hour.substring(
        0,
        item.class.class.end_hour.length - 3
      )} <span class="transact ${item.transcact}">${item.transcact}</span><br>`;
    });
    return content;
  }

  approveGroup(group_id, isApprove) {
    const $this = this;
    let flag = true;

    if (!isApprove) {
      new ServicesProvider().approveGroup(
        group_id,
        isApprove,
        function () {
          mkNoti("¡Bien Hecho!", "Horario desapobrado con éxito.", {
            status: "success",
            duration: 3000,
          });
          approved(false, group_id);
        },
        function () {
          mkNoti("¡Oh no!", "Ocurrió un error inesperado.", {
            status: "danger",
            duration: 4000,
          });
          approved(true, group_id);
        }
      );
    } else {
      if (
        this.classesCreated.length > 0 ||
        this.classesEdited.length > 0 ||
        this.classesDeleted.length > 0
      ) {
        mkNoti(
          "¡Ups!",
          "Necesita guardar sus cambios antes de aprobar el horario.",
          {
            status: "warning",
            duration: 6000,
          }
        );
        approved(false, group_id);
      } else {
        $this.courses.forEach(function (course) {
          if (
            $this.calcAsigHours(course.classes) < course.required_class_hours
          ) {
            flag = false;
          }
        });
        if (flag)
          new ServicesProvider().approveGroup(
            group_id,
            isApprove,
            function () {
              mkNoti("¡Bien Hecho!", "Horario apobrado con éxito.", {
                status: "success",
                duration: 3000,
              });
              approved(true, group_id);
            },
            function () {
              mkNoti("¡Oh no!", "Ocurrió un error inesperado.", {
                status: "danger",
                duration: 4000,
              });
              approved(false, group_id);
            }
          );
        else {
          $.alert({
            title: "¡Oh no!",
            icon: "fa fa-exclamation-triangle",
            type: "red",
            content:
              "Necesita asignar todas las horas de las clases correspondientes para aprobar el grupo.",
          });
          approved(false, group_id);
        }
      }
    }
  }

  validateApproved(group_id) {
    for (let i = 0; i < this.courses.length; i++) {
      let course = this.courses[i];

      if (course.required_class_hours > this.calcAsigHours(course.classes)) {
        new ServicesProvider()
          .approveGroup(group_id, false)
          .then((response) => response.json())
          .then(() => {
            $.alert({
              title: "¡Oh no!",
              icon: "fa fa-exclamation-triangle",
              type: "red",
              content:
                "Al guardar sus nuevos cambios, algunas clases quedaron con horas faltantes." +
                "<br> Recuerde que necesita asignar todas las horas de las clases correspondientes para aprobar el grupo.",
            });
            approved(false, group_id);
          })
          .catch(() => {
            mkNoti("¡Oh no!", "Ocurrió un error inesperado.", {
              status: "danger",
              duration: 4000,
            });
            approved(false, group_id);
          });
      }
    }
  }

  calcAsigHours(classes) {
    let hours = 0;
    if (classes) {
      classes.forEach((session) => {
        const timeStart = new Date("01/01/1999 " + session.start_hour);
        const timeEnd = new Date("01/01/1999 " + session.end_hour);
        hours += (timeEnd.getTime() - timeStart.getTime()) / 3600000; //3,600,000= hours(60)*minutes(60)*milliseconds(1000);
      });
    }
    return hours;
  }
}
