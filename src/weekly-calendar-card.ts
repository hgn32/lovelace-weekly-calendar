import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult,
  css,
  CSSResult,
  PropertyValues,
  unsafeCSS,
} from 'lit-element';
import { HomeAssistant } from 'custom-card-helpers';

import { WeeklyCalendarCardConfig } from './types';

@customElement('weekly-calendar-card')
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
      today_background_color: config_org.today_background_color ? config_org.today_background_color : '#ff0000',
      today_text_color: config_org.today_text_color ? config_org.today_text_color : '#000000',
      weekday_background_color: config_org.weekday_background_color
        ? config_org.weekday_background_color
        : [
            {
              //Sun
              weekday: 0,
              background_color: '#ff0000',
              text_color: '#000000',
            },
            {
              //Sat
              weekday: 6,
              background_color: '#0000ff',
              text_color: '#000000',
            },
          ],
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
      console.log(this._config);
      console.log(this.hass);
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

    const today = new Date();
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

    const days: TemplateResult[] = [];
    for (let currentDay = startDay; currentDay <= endDay; currentDay.setDate(currentDay.getDate() + 1)) {
      const isToday = currentDay.getTime() === today.getTime() ? true : false;
      const tomorrow = new Date(currentDay.getDate() + 1);
      const isStartOfWeek = currentDay.getDay() === this._config.start_weekday ? true : false;
      const isEndOfWeek = tomorrow.getDay() === this._config.start_weekday ? true : false;
      // prettier-ignore
      days.push(html`
        ${isStartOfWeek ? html`<tr class="week">` : html``}
        <td class="day weekday${currentDay.getDay()}" ${isToday ? 'today' : ''}>
          <div>${currentDay.getDate()}</div>
        </td>
        ${isEndOfWeek ? html`</tr>` : html``}
      `);
    }

    const style_today = css`
      .today {
        background-color: ${unsafeCSS(this._config.today_background_color)};
        color: ${unsafeCSS(this._config.today_text_color)};
      }
    `;
    const style_weekdays = this._config.weekday_background_color.map(
      (week) =>
        css`
          .weekday {
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
        <table calss="calendar">
          ${days}
        </table>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        padding: 16px;
      }
      .warning {
        display: block;
        color: black;
        background-color: #fce588;
        padding: 8px;
      }
      .calendar {
      }
      .week {
      }
      .day {
        text-align: center;
        vertical-align: middle;
        padding: 8px;
        font-size: 150%;
      }
    `;
  }
}
if (!customElements.get('weekly-calendar-card')) customElements.define('weekly-calendar-card', WeeklyCalendarCard);
