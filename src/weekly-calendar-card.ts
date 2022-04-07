import {
  LitElement,
  property,
  css,
  CSSResult,
  html,
  TemplateResult,
} from "lit-element";
import {
  HomeAssistant,
  LovelaceCard,
  createThing,
  LovelaceCardConfig,
} from "custom-card-helpers";
import { WeeklyCalendarCardConfig } from "./types";

class WeeklyCalendarCard extends LitElement implements LovelaceCard {
  protected _card?: LovelaceCard;
  private _config?: WeeklyCalendarCardConfig;

  private _hass?: HomeAssistant;
  private _cardPromise: Promise<LovelaceCard> | undefined;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (this._card) {
      this._card.hass = hass;
    }
  }

  static get styles(): CSSResult {
    return css`
      ha-card {
        overflow: hidden;
      }
    `;
  }

  public setConfig(config: WeeklyCalendarCardConfig): void {
    if (!config) {
      throw new Error(`There is no cards parameter defined`);
    }
    this._config = {
      // entity: [],
      type: "",
      showLastWeekNum: 1,
      showFollowWeekNum: 2,
      startWeekday: 0,
      todayBackgroundColor: "#ff0000",
      weekdayBackgroundColor: [
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
      ],
    };
    this._createStack();
  }

  private async _createStack() {
    this._cardPromise = this._createCard({
      type: `weekly-calendar-card`,
    });
    this._card = await this._cardPromise;
  }

  protected render(): TemplateResult {
    if (!this._hass || !this._config) {
      return html``;
    }

    return html`
      <ha-card header="weekly-calendar-card">
        <div>${this._card}</div>
      </ha-card>
    `;
  }
  public async getCardSize(): Promise<number> {
    await this._cardPromise;
    if (!this._card) {
      return 0;
    }
    return 1;
  }

  private async _createCard(config: LovelaceCardConfig): Promise<LovelaceCard> {
    let element: LovelaceCard;
    if (HELPERS) {
      element = (await HELPERS).createCardElement(config);
    } else {
      element = createThing(config);
    }
    if (this._hass) {
      element.hass = this._hass;
    }
    // if (element) {
    //   element.addEventListener(
    //     "ll-rebuild",
    //     (ev) => {
    //       ev.stopPropagation();
    //       this._rebuildCard(element, config);
    //     },
    //     { once: true }
    //   );
    // }
    const today = new Date();
    const startDay = new Date(
      today.setDate(
        today.getDate() -
          today.getDay() +
          (this._config!.startWeekday - 7 * this._config!.showLastWeekNum)
      )
    );
    const endDay = new Date(
      startDay.getDate() +
        7 * (this._config!.showLastWeekNum + this._config!.showLastWeekNum + 1)
    );
    return element;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HELPERS = (window as any).loadCardHelpers
  ? (window as any).loadCardHelpers()
  : undefined;
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "weekly-calendar-card",
  name: "Weekly Calendar Card",
  preview: false,
  description: "weekly calendar card",
});
