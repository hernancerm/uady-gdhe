export default class CardClassVisualizer {
  render(collegeClasses) {
    collegeClasses.forEach((weekdayColumn) => {
      const htmlWeekdayColumn = $(
        `.ccv-day.${weekdayColumn.weekday} .ccv-column`
      );
      htmlWeekdayColumn.empty();

      weekdayColumn.classes.forEach((collegeClass) => {
        const newClass = this.createClassFromTemplate(
          collegeClass.subject_name,
          collegeClass.classroom,
          collegeClass.start_hour,
          collegeClass.end_hour
        );

        newClass.hide().appendTo(htmlWeekdayColumn).fadeIn("normal");
      });
    });
  }

  createClassFromTemplate(subjectName, classroom, startHour, endHour) {
    return $(`<div class="cc">
        <div class="cc-subject">${subjectName}</div>
        <div class="cc-footer">
            <div class="cc-footer__classroom">${classroom}</div>
            <div class="cc-footer__time">${startHour} - ${endHour}</div>
        </div>
    </div>`);
  }
}
