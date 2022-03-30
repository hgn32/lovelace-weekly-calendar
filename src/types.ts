import {
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "custom-card-helpers";

export interface WeeklyCalendarConfig extends LovelaceCardConfig {
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
