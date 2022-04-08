// import { LovelaceCardConfig } from "custom-card-helpers";

export interface WeeklyCalendarCardConfig {
  type: string;
  entity: string;
  show_last_weeks: number;
  show_follow_weeks: number;
  start_weekday: number;
  today_background_color: string;
  today_text_color: string;
  weekday_background_color: WeekdayBackgroundColorConfig[];
}

export interface WeekdayBackgroundColorConfig {
  weekday: number;
  background_color: string;
  text_color: string;
}
