function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getLday(d) {
  var day = +Intl.DateTimeFormat("ja-JP", { day: "numeric" })
    .format(d)
    .match(/\d+/)[0];
  return day;
}

class WeeklyCalendar extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement("ha-card");
      card.header = "";
      this.content = document.createElement("div");
      this.content.style.padding = "0px";
      card.appendChild(this.content);
      this.appendChild(card);
    }

    //const entityId = this.config.entity;
    //const state = hass.states[entityId];
    //const stateStr = state ? state.state : 'unavailable';
    const date = new Date();
    var act = date.getDay();
    if (act == 0) act = 7;
    else act = act;

    var today = Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(date);
    var m = "";
    var currdate = new Date().toLocaleDateString("ja-JP"),
      m = +Intl.DateTimeFormat("zh-TW-u-ca-chinese", {
        month: "numeric",
      }).format(date),
      d = +Intl.DateTimeFormat("zh-TW-u-ca-chinese", { day: "numeric" })
        .format(date)
        .match(/\d+/)[0];

    this.content.innerHTML = `
        <div class="ldate">
          <div class="day">
            ${today}
          </div>
          <div class="date">
            <div class="date1">${currdate}</div>
            <div class="date2">${d}.${m} ${y}</div>
          </div>
          <div class="week">
            <div class="we">
              <div class="we0">TH 2</div>
              <div class="we1">${day[0]}</div>
              <div class="we2">${lday[0]}</div>
            </div>
            <div class="we">
              <div class="we0">TH 3</div>
              <div class="we1">${day[1]}</div>
              <div class="we2">${lday[1]}</div>
            </div>
            <div class="we act">
              <div class="we0">TH 4</div>
              <div class="we1">${day[2]}</div>
              <div class="we2">${lday[2]}</div>
            </div>
            <div class="we">
              <div class="we0">TH 5</div>
              <div class="we1">${day[3]}</div>
              <div class="we2">${lday[3]}</div>
            </div>
            <div class="we">
              <div class="we0">TH 6</div>
              <div class="we1">${day[4]}</div>
              <div class="we2">${lday[4]}</div>
            </div>
            <div class="we">
              <div class="we0">TH 7</div>
              <div class="we1">${day[5]}</div>
              <div class="we2">${lday[5]}</div>
            </div>
            <div class="we red">
              <div class="we0">CN</div>
              <div class="we1">${day[6]}</div>
              <div class="we2">${lday[6]}</div>
            </div>
  
          </div>
        </div>
              <style>
          body{
            font-family: arial;
          }
          .ldate{
            margin: auto;
            position: relative;
          }
          .ldate .day{
            font-size:3em;
            line-height: 70px;
            padding-left:10px;
          }
          .ldate .date{
            position: absolute;
                right: 10px;
      top: 12px;
            text-align: right;
          }
          .ldate .date .date1{
            font-size: 1.5em;
          }
          .ldate .date .date2{
            color:#A2A2A2;
          }
          .ldate .week{
            box-shadow: 0 0 20px 11px #00000008;
          }
          .ldate .week:after{
            content: ' ';
            display: block;
            clear: both;
          }
          .ldate .week .we{
            width:14.28%;
            float: left;
            text-align: center;
          }
          .ldate .week .we0{
            font-size: 0.8em;
            padding: 10px 0 10px;
            color:#A2A2A2;
          }
          .ldate .week .we.red .we0{
            color:#F05A5A;
          }
          .ldate .week .we1{
            font-size: 1.5em;
          }
          .ldate .week .we2{
            font-size: 0.8em;
            padding:5px 0 10px;
            color:#A2A2A2;
          }
  
          .ldate .week .we:nth-child(${act}){
            background-color: #639FED;
            color:#fff;
          }
          .ldate .week .we:nth-child(${act}),
          .ldate .week .we:nth-child(${act}).red .we0,
          .ldate .week .we:nth-child(${act}) .we0,
          .ldate .week .we:nth-child(${act}) .we2{
            color:#fff;
          }
        </style>
      `;
  }

  setConfig(config) {
    // if (!config.entity) {
    //   throw new Error("You need to define an entity");
    // }
    this.config.showLasyWeekNum = 1;
    this.config.showFollowWeekNum = 4;
    this.config.currentDayBackgroundColor = "#ff0000";
    this.config.WeekdayBackgroundColor = [
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
    ];
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define("weekly-calendar", WeeklyCalendar);
