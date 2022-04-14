# weekly-calendar-card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

## under development!!
doesn't work.

## install 
HACS custom repository

## sample

```yaml
- type: custom:weekly-calendar-card
  entity: calendar.myholiday
  show_last_weeks: 1
  show_follow_weeks: 3
  start_weekday: 0
  today_background_color: '#68be8d'
  today_text_color: '#333333'
  weekday_background_color:
    - weekday: 0
      background_color: '#e597b2'
      text_color: '#333333'
    - weekday: 6
      background_color: '#a0d8ef'
      text_color: '#333333'
```
