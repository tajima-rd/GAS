function isWeekend(targetDate) {
  // 0 (日曜日) ～ 6 (土曜日)
  const day = targetDate.getDay();
  // 土日の場合「true」を返す
  return (day === 0 || day === 6);
}
