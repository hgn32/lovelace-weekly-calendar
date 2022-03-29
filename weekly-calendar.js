class WeeklyCalendar extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement("ha-card");
      card.header = "";
      this.content = document.createElement("div");
      this.content.style.padding = "0px";
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const today = new Date();
    const startDay =
      today -
      today.getDay() +
      this.config.startWeekday -
      7 * this.config.showLastWeekNum;
    const endDay =
      startDay +
      7 * (this.config.showLastWeekNum + this.config.showLastWeekNum + 1);

    this.content.innerHTML = `<div class="weekly-calendar">`;
    for (
      var currentDay = startDay;
      currentDay <= endDay;
      currentDay.setDate(currentDay.getDate() + 1)
    ) {
      isToday = currentDay.getTime() === today.getTime() ? true : false;
      this.content.innerHTML += `
          <div class="day weekday${currentDay.getDay()}">
            <div class="date ${
              isToday ? "today" : ""
            }">${currentDay.getDate()}</div>
          </div>
        `;
    }
    this.content.innerHTML = `
        </div>
      </div>
      <style>
          .day{
          }
          .date{
          }
          .today{
            background-color:${this.config.todayBackgroundColor}
          }
          `;

    for (var weekday = 0; weekday <= 6; weekday++) {
      let style = this.config.weekdayBackgroundColor.find(
        (el) => el.Weekday == weekday
      );

      this.content.innerHTML = `
        .weekday${weekday}{
          background-color:${style.BackgroundColor}
        }`;
    }
    this.content.innerHTML = `
        </style>
      `;
  }

  setConfig(config) {
    // if (!config.entity) {
    //   throw new Error("You need to define an entity");
    // }
    this.config.showLastWeekNum = 1;
    this.config.showFollowWeekNum = 2;
    this.config.startWeekday = 0;
    this.config.todayBackgroundColor = "#ff0000";
    this.config.weekdayBackgroundColor = [
      {
        //Sun
        Weekday: 0,
        BackgroundColor: "#ff0000",
      },
      {
        //Sat
        Weekday: 6,
        BackgroundColor: "#ff0000",
      },
    ];
  }
}

customElements.define("weekly-calendar", WeeklyCalendar);
