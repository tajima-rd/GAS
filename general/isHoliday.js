const holidayCalendarId = 'ja.japanese#holiday@group.v.calendar.google.com';  // 日本の祝日カレンダーの ID を定義
const calendar = CalendarApp.getCalendarById(holidayCalendarId);              // カレンダー ID を使用してカレンダーを取得

function isHoliday(targetDate) {
  // ターゲットの日付のイベント（祝日）を取得
  let holiday = calendar.getEventsForDay(targetDate);
  
  // イベントが存在するかどうかをチェック（存在すれば祝日、存在しなければ非祝日）
  if(holiday.length > 0){
    return(true);    // イベントが存在する場合Trueを返す
  } else {
    return(false);   // イベントが存在しない場合はFlaseを返す
  }
}
