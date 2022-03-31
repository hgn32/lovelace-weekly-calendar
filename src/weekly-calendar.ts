import { customElement, LitElement, state } from "lit-element";
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
  getLovelace,
} from "custom-card-helpers";
import { WeeklyCalendarCardConfig } from "./types";

class WeeklyCalendarCard extends LitElement implements LovelaceCard {
  @property() public hass!: HomeAssistant;
  @state() private config!: WeeklyCalendarCardConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement("weekly-calendar-card");
  }

  public static getStubConfig(hass: HomeAssistant, entities: string[]): object {
    const entity = entities.find((item) => item.startsWith("light")) || "";
    const dummy = hass;
    return {
      entity: entity,
      show_name: true,
      show_state: true,
      compact: false,
    };
  }
  public getCardSize(): number {
    return 0;
  }

  public setConfig(config: WeeklyCalendarCardConfig): void {
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
}

customElements.define("weekly-calendar-card", WeeklyCalendarCard);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "weekly-calendar-card",
  name: "Weekly Calendar Card",
  preview: false,
  description: "weekly calendar card",
});
