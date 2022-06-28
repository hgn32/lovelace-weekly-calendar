import { LitElement, html, property, TemplateResult, css, PropertyValues, unsafeCSS } from 'lit-element';
import { HomeAssistant } from 'custom-card-helpers';
import { CalendarConfig, WeeklyCalendarCardConfig } from './types';
import dayjs from 'dayjs';

class WeeklyCalendarCard extends LitElement {
    @property() public hass?: HomeAssistant;
    @property() private _config?: WeeklyCalendarCardConfig;

    public setConfig(config_org: Readonly<WeeklyCalendarCardConfig>): void {
        const config: WeeklyCalendarCardConfig = {
            type: config_org.type,
            calendars: config_org.calendars ? config_org.calendars : [],
            show_last_weeks: config_org.show_last_weeks ? config_org.show_last_weeks : 1,
            show_follow_weeks: config_org.show_follow_weeks ? config_org.show_follow_weeks : 2,
            start_weekday: config_org.start_weekday ? config_org.start_weekday : 0,
            today_background_color: config_org.today_background_color
                ? config_org.today_background_color
                : 'var(--label-badge-background-color)',
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

        // if (this.hass && this._config) {
        // const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

        //   if (oldHass) {
        //     return oldHass.states[this._config.entity] !== this.hass.states[this._config.entity];
        //   }
        // }

        return true;
    }

    protected async getAllEvents(
        startDay: dayjs.Dayjs,
        endDay: dayjs.Dayjs,
        config: WeeklyCalendarCardConfig,
    ): Promise<any> {
        const calendarEntityPromises: Promise<any>[] = [];
        const allEvents: any[] = [];
        const failedEvents: any[] = [];

        if (!config.calendars) return null;

        config.calendars.map((calendar) => {
            const calendarEntity = calendar;
            const url: string = `calendars/${calendar.entity}?start=${startDay.format(
                'YYYY-MM-DDTHH:mm:ss',
            )}Z&end=${endDay.format('YYYY-MM-DDTHH:mm:ss')}Z`;
            if (!this.hass) return;
            calendarEntityPromises.push(
                this.hass
                    .callApi('GET', url)
                    .then((rawEvents: any) => {
                        rawEvents.map((event) => {
                            if (!this.hass) return;
                            event.entity = calendar;
                            event.calendarEntity = calendarEntity;
                        });
                        return rawEvents;
                    })
                    .then((events) => {
                        allEvents.push(...events);
                    })
                    .catch((error) => {
                        failedEvents.push({
                            name: calendarEntity,
                            error,
                        });
                    }),
            );
        });
        await Promise.all(calendarEntityPromises);
        return { failedEvents, events: this.processEvents(allEvents, config) };
    }

    protected processEvents(allEvents: any[], config: WeeklyCalendarCardConfig) {
        const newEvents = allEvents.filter((newEvent) => {
            newEvent.originCalendar = config.entities.find((entity) => entity.entity === newEvent.entity.entity);
            const eventEntity: any = newEvent.entity;
            const calendarEntity: CalendarConfig = newEvent.calendarEntity;

            if (calendarEntity.match_title.length > 0) {
                const regex = new RegExp(calendarEntity.match_title, 'i');
                if (!regex.test(eventEntity.summary)) return false;
            }

            return newEvent;
        }, []);

        return newEvents;
    }
    protected async render(): Promise<TemplateResult | void> {
        if (!this._config || !this.hass) {
            return html`
                <ha-card>
                    <div class="warning">Setup is not completed.</div>
                </ha-card>
            `;
        }

        if (this._config.calendars && this.hass) {
            const invalidEntities = this._config.calendars.filter((calendar: CalendarConfig) => {
                const stateObj = this.hass?.states[calendar.entity];
                if (!stateObj) {
                    return calendar.entity;
                }
                return false;
            });
            if (invalidEntities.length > 0) {
                return html`
                    <ha-card>
                        <div class="warning">Entity not available: ${invalidEntities.join(', ')}</div>
                    </ha-card>
                `;
            }
        }
        const now = dayjs();
        const today = dayjs(now.format('YYYY-MM-DD'));
        const startDay = dayjs(
            today.unix() -
                (today.day() -
                    this._config.start_weekday +
                    (today.day() >= this._config.start_weekday ? 0 : 7) +
                    7 * this._config.show_last_weeks) *
                    24 *
                    60 *
                    60 *
                    1000,
        );
        const endDay = dayjs(
            startDay.unix() +
                (this._config.show_last_weeks + this._config.show_follow_weeks + 1) * 7 * 24 * 60 * 60 * 1000 -
                24 * 60 * 60 * 1000,
        );
        const lastDayMonth = today.endOf('month');
        const weekday_view = ['日', '月', '火', '水', '木', '金', '土'];

        // const events = await this.getAllEvents(startDay, endDay, this._config);

        const headers: TemplateResult[] = [];
        const days: TemplateResult[] = [];
        let count = 0;
        for (let currentDay = startDay; currentDay <= endDay; currentDay = currentDay.add(1, 'day')) {
            const class_list = ['day', 'day_base'];
            class_list.push('weekday' + String(currentDay.day()));
            if (currentDay.date() + 7 - currentDay.day() > lastDayMonth.date()) class_list.push('lastweek_of_month');
            if (currentDay.date() - currentDay.day() < 0) class_list.push('firstweek_of_month');
            if (currentDay.format('YYY-MM-DD') === today.format('YYY-MM-DD')) class_list.push('today');
            if (currentDay.date() === 1) class_list.push('firstday_of_month');
            if (
                !class_list.includes('firstday_of_month') &&
                !class_list.includes('firstweek_of_month') &&
                !class_list.includes('lastweek_of_month')
            )
                class_list.push('border_base');
            if (count++ < 7) {
                // prettier-ignore
                headers.push(html`
          <div class="header day_base border_base">
            <div>${weekday_view[currentDay.day()]}</div>
          </div>
        `);
            }
            // prettier-ignore
            days.push(html`
        <div class="${class_list.join(" ")}">
          <div>${currentDay.date()}</div>
        </div>
      `);
        }

        const style_today = css`
            .lastweek_of_month {
                border-top: 1px solid ${unsafeCSS(this._config.border_color)};
                border-right: 1px solid ${unsafeCSS(this._config.border_color)};
                border-bottom: 2px solid ${unsafeCSS(this._config.border_color)};
                border-left: 1px solid ${unsafeCSS(this._config.border_color)};
            }
            .firstweek_of_month {
                border-top: 2px solid ${unsafeCSS(this._config.border_color)};
                border-right: 1px solid ${unsafeCSS(this._config.border_color)};
                border-bottom: 1px solid ${unsafeCSS(this._config.border_color)};
                border-left: 1px solid ${unsafeCSS(this._config.border_color)};
            }
            .firstday_of_month {
                border-top: 1px solid ${unsafeCSS(this._config.border_color)};
                border-right: 1px solid ${unsafeCSS(this._config.border_color)};
                border-bottom: 1px solid ${unsafeCSS(this._config.border_color)};
                border-left: 1px solid ${unsafeCSS(this._config.border_color)};
            }
            .border_base {
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
                <div class="calendar">${headers} ${days}</div>
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
            .day_base {
                width: calc((100% / 7) - 22px);
                text-align: center;
                vertical-align: middle;
                margin: 0;
            }
            .header {
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
