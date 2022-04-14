# weekly-calendar-card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

## under development!!
doesn't work.

## install 
HACS custom repository

## sample
![white](https://user-images.githubusercontent.com/2378302/163414823-1a7547b1-43de-48aa-8ca9-ae4de9f8330f.png)
![back](https://user-images.githubusercontent.com/2378302/163414835-08d91856-23dc-4f30-bd14-be58021c2350.png)

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
