const sheet_id = "";  // ここにフォームの回答が記録されたスプレッドシートのIDを記述する。
const sheet_no = 0;   // データが入力されているスプレッドシートのシート番号（通常1枚目なので0）
const col_email = 1;  // スプレッドシートのメールアドレスの列番号（通常2列目なので1）

function sendEmailToNonRespondents() {
  // Google Form の回答が保存されたスプレッドシートを開き、データ領域を取得する。
  let sheet = SpreadsheetApp.openById(sheet_id);
  let responses = sheet.getSheets()[sheet_no];
  let data_range = responses.getDataRange().getValues();

  // Googleグループのメールアドレスを使ってメンバーの情報を取得する。
  let group_email = 'cat_staff@stdat.at-hyogo.ac.jp';
  let group_members = GroupsApp.getGroupByEmail(group_email).getUsers();
  
  // Google Form の回答で自動収集された「回答済み」のメールアドレスの一覧を取得する。
  let email_res = data_range.map(function(row) {
    return row[col_email];
  });
  
  // Google Groupのメンバーを使って差分から「未回答者」の一覧を取得する。
  let email_non = group_members.filter(function(address) {
    return email_res.indexOf(address) === -1;
  });

  // 「未回答者」に対する処理。通常は督促メールを送るなどの機能を持たす。
  email_non.forEach(function(address) {
    // MailApp.sendEmail(member.email, subject, body);
    Logger.log(address);
  });
};
