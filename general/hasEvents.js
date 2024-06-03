function checkConflict(calendarId, fromDate, toDate) {
  // カレンダーIDからカレンダーを取得する   
  let calendar = CalendarApp.getCalendarById(calendarId);

  // 与えられた期間の間のイベントを取得する
  let events = calendar.getEvents(fromDate, toDate);

  // 期間内に存在するイベントの数を返す
  return(events.length);
}
