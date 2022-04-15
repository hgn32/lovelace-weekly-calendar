import {
  LitElement,
  html,
  property,
  TemplateResult,
  css,
  PropertyValues,
  unsafeCSS,
} from 'lit-element';
import { HomeAssistant } from 'custom-card-helpers';

import { WeeklyCalendarCardConfig } from './types';

class WeeklyCalendarCard extends LitElement {
  @property() public hass?: HomeAssistant;
  @property() private _config?: WeeklyCalendarCardConfig;

  public setConfig(config_org: Readonly<WeeklyCalendarCardConfig>): void {
    if (!config_org.entity) {
      throw new Error(`There is no cards parameter defined`);
    }
    const config: WeeklyCalendarCardConfig = {
      type: config_org.type,
      entity: config_org.entity,
      show_last_weeks: config_org.show_last_weeks ? config_org.show_last_weeks : 1,
      show_follow_weeks: config_org.show_follow_weeks ? config_org.show_follow_weeks : 2,
      start_weekday: config_org.start_weekday ? config_org.start_weekday : 0,
      today_background_color: config_org.today_background_color ? config_org.today_background_color : 'var(--label-badge-background-color)',
      border_color: config_org.border_color ? config_org.border_color : 'var(--primary-text-color)',
      today_text_color: config_org.today_text_color ? config_org.today_text_color : 'var(--primary-text-color)',
      weekday_background_color: config_org.weekday_background_color ? config_org.weekday_background_color : [],
    };
    this._config = config;
  }

  public getCardSize(): number {
    return 1;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config')) {
      return true;
    }

    if (this.hass && this._config) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

      if (oldHass) {
        return oldHass.states[this._config.entity] !== this.hass.states[this._config.entity];
      }
    }

    return true;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html`
        <ha-card>
          <div class="warning">Setup is not completed.</div>
        </ha-card>
      `;
    }
    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return html`
        <ha-card>
          <div class="warning">Entity not available: ${this._config.entity}</div>
        </ha-card>
      `;
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDay = new Date(
      today.getTime() -
        (today.getDay() -
          this._config.start_weekday +
          (today.getDay() >= this._config.start_weekday ? 0 : 7) +
          7 * this._config.show_last_weeks) *
          24 *
          60 *
          60 *
          1000,
    );
    const endDay = new Date(
      startDay.getTime() +
        (this._config.show_last_weeks + this._config.show_follow_weeks + 1) * 7 * 24 * 60 * 60 * 1000 -
        24 * 60 * 60 * 1000,
    );
    const lastDayMonth = new Date(now.getFullYear(), now.getMonth()+1, 0);
    const weekday_view = ["日", "月", "火", "水", "木", "金", "土"];

    const headers: TemplateResult[] = [];
    const days: TemplateResult[] = [];
    let count = 0;
    for (let currentDay = startDay; currentDay <= endDay; currentDay.setDate(currentDay.getDate() + 1)) {
      const class_list = ["day", "day_base"];
      class_list.push("weekday" + String(currentDay.getDay()));
      if(currentDay.getDate() + 7 - currentDay.getDay() > lastDayMonth.getDate()) class_list.push("lastweek_of_month");
      if(currentDay.getDate() - currentDay.getDay() < 0)  class_list.push("firstweek_of_month");
      if(currentDay.getTime() === today.getTime()) class_list.push("today");
      if(currentDay.getDate() === 1) class_list.push("firstday_of_month");
      if(!class_list.includes("firstday_of_month") && !class_list.includes("firstweek_of_month") && !class_list.includes("lastweek_of_month"))
          class_list.push("border_base");
      if(count++ < 7){
        // prettier-ignore
        headers.push(html`
          <div class="header day_base border_base">
            <div>${weekday_view[currentDay.getDay()]}</div>
          </div>
        `);
      }
      // prettier-ignore
      days.push(html`
        <div class="${class_list.join(" ")}">
          <div>${currentDay.getDate()}</div>
        </div>
      `);
    }

    const style_today = css`    
      .lastweek_of_month{
        border-top:    1px solid ${unsafeCSS(this._config.border_color)};
        border-right:  1px solid ${unsafeCSS(this._config.border_color)};
        border-bottom: 2px solid ${unsafeCSS(this._config.border_color)};
        border-left:   1px solid ${unsafeCSS(this._config.border_color)};
      }
      .firstweek_of_month{
        border-top:    2px solid ${unsafeCSS(this._config.border_color)};
        border-right:  1px solid ${unsafeCSS(this._config.border_color)};
        border-bottom: 1px solid ${unsafeCSS(this._config.border_color)};
        border-left:   1px solid ${unsafeCSS(this._config.border_color)};
      }
      .firstday_of_month{
        border-top:    1px solid ${unsafeCSS(this._config.border_color)};
        border-right:  1px solid ${unsafeCSS(this._config.border_color)};
        border-bottom: 1px solid ${unsafeCSS(this._config.border_color)};
        border-left:   1px solid ${unsafeCSS(this._config.border_color)};
      }
      .border_base{
        border: 1px solid ${unsafeCSS(this._config.border_color)};
      }
      .today {
        background-color: ${unsafeCSS(this._config.today_background_color)};
        color: ${unsafeCSS(this._config.today_text_color)};
      }
    `;
    const style_weekdays = this._config.weekday_background_color.map(
      (week) =>
        css`
          .weekday${week.weekday} {
            background-color: ${unsafeCSS(week.background_color)};
            color: ${unsafeCSS(week.text_color)};
          }
        `,
    );

    return html`
      <ha-card>
        <style>
          ${style_today}
          ${style_weekdays}
        </style>
        <div class="calendar">
          ${headers}
          ${days}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        padding: 4px;
      }
      .warning {
        display: block;
        color: black;
        background-color: #fce588;
        padding: 8px;
      }
      .calendar {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: center;
      }
      .day_base{
      	width: calc((100% / 7) - 22px);
        text-align: center;
        vertical-align: middle;
        margin: 0;
      }
      .header{
        padding: 4px 10px;
        font-size: 100%;
      }
      .day {
        padding: 15px 10px;
        font-size: 250%;
      }
    `;
  }
}
if (!customElements.get('weekly-calendar-card')) customElements.define('weekly-calendar-card', WeeklyCalendarCard);
