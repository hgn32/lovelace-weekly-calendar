// import { LovelaceCardConfig } from "custom-card-helpers";

export interface WeeklyCalendarCardConfig {
  type: string;
  //  entity: string;
  showLastWeekNum: number;
  showFollowWeekNum: number;
  startWeekday: number;
  todayBackgroundColor: string;
  weekdayBackgroundColor: weekdayBackgroundColorConfig[];
}

export interface weekdayBackgroundColorConfig {
  Weekday: number;
  BackgroundColor: string;
}
