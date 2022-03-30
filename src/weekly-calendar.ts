import { customElement, LitElement, state } from "lit-element";
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  LovelaceCardEditor,
  getLovelace,
} from "custom-card-helpers";
import { WeeklyCalendarConfig } from "./types";

class WeeklyCalendar extends LitElement {
  private config: WeeklyCalendarConfig;

  public set hass(hass: HomeAssistant) {
    const today = new Date();
    const startDay = new Date(
      today.setDate(
        today.getDate() -
          today.getDay() +
          (this.config.startWeekday - 7 * this.config.showLastWeekNum)
      )
    );
    const endDay = new Date(
      startDay.getDate() +
        7 * (this.config.showLastWeekNum + this.config.showLastWeekNum + 1)
    );

    // this.content.innerHTML = `<div class="weekly-calendar">`;
    // for (
    //   var currentDay = startDay;
    //   currentDay <= endDay;
    //   currentDay.setDate(currentDay.getDate() + 1)
    // ) {
    //   isToday = currentDay.getTime() === today.getTime() ? true : false;
    //   this.content.innerHTML += `
    //       <div class="day weekday${currentDay.getDay()}">
    //         <div class="date ${
    //           isToday ? "today" : ""
    //         }">${currentDay.getDate()}</div>
    //       </div>
    //     `;
    // }
    // this.content.innerHTML = `
    //     </div>
    //   </div>
    //   <style>
    //       .day{
    //       }
    //       .date{
    //       }
    //       .today{
    //         background-color:${this.config.todayBackgroundColor}
    //       }
    //       `;

    // for (var weekday = 0; weekday <= 6; weekday++) {
    //   let style = this.config.weekdayBackgroundColor.find(
    //     (el) => el.Weekday == weekday
    //   );

    //   this.content.innerHTML = `
    //     .weekday${weekday}{
    //       background-color:${style.BackgroundColor}
    //     }`;
    // }
    // this.content.innerHTML = `
    //     </style>
    //   `;
  }

  public getCardSize() {
    return 1;
  }
  public setConfig(config: WeeklyCalendarConfig): void {
    if (!config) {
      throw new Error("common.invalid_configuration");
    }
    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }
    if (!config.entity) {
      throw new Error("Please define an entity");
    }
    const cardConfig = Object.assign({}, config);
    if (!cardConfig.entity) cardConfig.entity = [];
    if (!cardConfig.showLastWeekNum) cardConfig.showLastWeekNum = 1;
    if (!cardConfig.showFollowWeekNum) cardConfig.showFollowWeekNum = 2;
    if (!cardConfig.startWeekday) cardConfig.startWeekday = 0;
    if (!cardConfig.todayBackgroundColor)
      cardConfig.todayBackgroundColor = "#ff0000";
    if (!cardConfig.weekdayBackgroundColor)
      cardConfig.weekdayBackgroundColor = [
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
    this.config = cardConfig;
  }
}

customElements.define("weekly-calendar", WeeklyCalendar);

// // Configure the preview in the Lovelace card picker
// window.customCards = window.customCards || [];
// window.customCards.push({
//   type: "weekly-calendar",
//   name: "weekly calendar",
//   preview: false,
//   description: "weekly calendar.",
// });
