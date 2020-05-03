class Courses {
  refresh(group_id) {
    new ServicesProvider().readCourses(group_id, (courses) => {
      this.courses = JSON.parse(courses);
      new ServicesProvider().readClasses(group_id, (jsonClasses) => {
        var classes = JSON.parse(jsonClasses);
        Array.prototype.forEach.call(this.courses, (course) => {
          course.classes = classes.find(function (sessions) {
            return sessions.course_id == course.course_id;
          }).classes;
        });
        this.classesCreated = new Array();
        this.classesEdited = new Array();
        this.classesDeleted = new Array();
        new ServicesProvider().readGroupClasses(
          idGroupSelected,
          (collegeClasses) => {
            spinner.fadeOut(1000);
            mkNoti("¡Bien hecho!", "El horario cargó correctamente.", {
              status: "success",
              duration: 2000,
            });
            visualizer.render(JSON.parse(collegeClasses));
          }
        );
        changes(false);
        fillselectCourses(this.courses);
      });
    });
  }

  get(course_id) {
    return this.courses.find(function (course) {
      return course.course_id == course_id;
    });
  }

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
    var newClassEdited = this.classesCreated.find(function (session) {
      return item.class_id == session.class.class_id;
    });
    if (newClassEdited) {
      newClassEdited.class = item;
    } else {
      var classEdited = this.classesEdited.find(function (session) {
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
    var newClassDeleted = this.classesCreated.find(function (session) {
      return item.class_id == session.class.class_id;
    });
    if (newClassDeleted) {
      this.classesCreated = this.classesCreated.filter(
        (session) => item.class_id != session.class.class_id
      );
    } else {
      var classDeleted = this.classesEdited.find(function (session) {
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
    var $this = this;
    var successList = new Array();
    var errorList = new Array();
    var countTransacts =
      this.classesCreated.length +
      this.classesEdited.length +
      this.classesDeleted.length;

    this.classesCreated.forEach(function (item) {
      var addSuccess = function () {
        successList.push(new Object({ transcact: "creada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      var addError = function () {
        errorList.push(new Object({ transcact: "creada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      new ServicesProvider().createClass(item, addSuccess, addError);
    });

    this.classesEdited.forEach(function (item) {
      var addSuccess = function () {
        successList.push(new Object({ transcact: "editada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      var addError = function () {
        errorList.push(new Object({ transcact: "editada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      new ServicesProvider().updateClass(item, addSuccess, addError);
    });

    this.classesDeleted.forEach(function (item) {
      var addSuccess = function () {
        successList.push(new Object({ transcact: "eliminada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      var addError = function (data) {
        errorList.push(new Object({ transcact: "eliminada", class: item }));
        countTransacts--;
        if (countTransacts == 0)
          $this.alertChanges(successList, errorList, group_id);
      };
      new ServicesProvider().deleteClass(item, addSuccess, addError);
    });
  }

  alertChanges(successList, errorList, group_id) {
    if (errorList.length > 0) {
      var content =
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
      var content =
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
    var $this = this;
    var content = "";
    const weekdays = new Map([
      ["mon", "Lunes"],
      ["tue", "Martes"],
      ["wed", "Miércoles"],
      ["thu", "Jueves"],
      ["fri", "Viernes"],
      ["sat", "Sábado"],
      ["sun", "Domingo"],
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

    var idPrev = -1;
    classesSorted.forEach(function (item) {
      if (item.class.course_id != idPrev) {
        var courseName = $this.courses.find(function (course) {
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
    var $this = this;
    var flag = true;

    if (!isApprove) {
      new ServicesProvider().approveGroup(
        group_id,
        isApprove,
        function () {
          mkNoti("¡Bien Hecho!", "Horario desapobrado con éxito.", {
            status: "success",
            duration: 3000,
          });
          approved(false);
        },
        function () {
          mkNoti("¡Oh no!", "Ocurrió un error inesperado.", {
            status: "danger",
            duration: 4000,
          });
          approved(true);
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
        approved(false);
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
              approved(true);
            },
            function () {
              mkNoti("¡Oh no!", "Ocurrió un error inesperado.", {
                status: "danger",
                duration: 4000,
              });
              approved(false);
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
          approved(false);
        }
      }
    }
  }

  validateApproved(group_id) {
    for (let i = 0; i < this.courses.length; i++) {
      var course = this.courses[i];

      if (course.required_class_hours > this.calcAsigHours(course.classes)) {
        new ServicesProvider().approveGroup(
          group_id,
          false,
          function () {
            $.alert({
              title: "¡Oh no!",
              icon: "fa fa-exclamation-triangle",
              type: "red",
              content:
                "Al guardar sus nuevos cambios, algunas clases quedaron con horas faltantes." +
                "<br> Recuerde que necesita asignar todas las horas de las clases correspondientes para aprobar el grupo.",
            });
            approved(false);
          },
          function () {
            mkNoti("¡Oh no!", "Ocurrió un error inesperado.", {
              status: "danger",
              duration: 4000,
            });
            approved(false);
          }
        );
      }
    }
  }

  calcAsigHours(classes) {
    var hours = 0;
    classes.forEach((session) => {
      var timeStart = new Date("01/01/1999 " + session.start_hour);
      var timeEnd = new Date("01/01/1999 " + session.end_hour);
      hours += (timeEnd.getTime() - timeStart.getTime()) / 3600000; //3,600,000= hours(60)*minutes(60)*milliseconds(1000);
    });
    return hours;
  }
}
