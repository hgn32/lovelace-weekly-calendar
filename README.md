# Weekly Calendar Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

## Under development!!
- TODO: show events
- TODO: auto update

## Install 
HACS custom repository

## Sample
![white](https://user-images.githubusercontent.com/2378302/163414823-1a7547b1-43de-48aa-8ca9-ae4de9f8330f.png)
![back](https://user-images.githubusercontent.com/2378302/163414835-08d91856-23dc-4f30-bd14-be58021c2350.png)

```yaml
- type: custom:weekly-calendar-card
  entity: calendar.myholiday
  show_last_weeks: 1
  show_follow_weeks: 3
  start_weekday: 0
  border_color: '#666666'
  today_background_color: '#68be8d'
  today_text_color: '#333333'
  weekday_background_color:
    - weekday: 0 //sun
      background_color: '#e597b2'
      text_color: '#333333'
    - weekday: 6 //sat
      background_color: '#a0d8ef'
      text_color: '#333333'
```
