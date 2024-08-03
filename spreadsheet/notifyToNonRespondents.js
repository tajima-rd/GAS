const group_email = ""               // 参照元となるGoogleグループのメールアドレス

const doc_id = "";                   // ここにお知らせメールの本文を書いたGoogle DocumentのIDを記述する。
const sender = "管理者";              // ここにお知らせメールの送信者の名前を記述する。
const title = "[自動送信]回答のお願い"  // ここにお知らせメールの件名を記述する。

const sheet_id = "";                 // ここにフォームの回答が記録されたスプレッドシートのIDを記述する。
const sheet_no = 0;                  // データが入力されているスプレッドシートのシート番号（通常1枚目なので0）
const col_email = 1;                 // スプレッドシートのメールアドレスの列番号（通常2列目なので1）

function sendEmailToNonRespondents() {
  // Google Form の回答が保存されたスプレッドシートを開き、データ領域を取得する。
  let sheet = SpreadsheetApp.openById(sheet_id);
  let responses = sheet.getSheets()[sheet_no];
  let data_range = responses.getDataRange().getValues();

  // Googleグループのメールアドレスを使ってメンバーの情報を取得する。
  let group_members = GroupsApp.getGroupByEmail(group_email).getUsers();
  
  // Google Form の回答で自動収集された「回答済み」のメールアドレスの一覧を取得する。
  let email_res = data_range.map(function(row) {
    return row[col_email];
  });

  // 取得したメールアドレスを文字列型の配列に変換する
  group_members = group_members.map(String);
  email_res = email_res.map(String);

  // Google Groupのメンバーを使って差分から「未回答者」の一覧を取得する。
  let email_non = group_members.filter(i => email_res.indexOf(i) == -1)

  // 出力の確認
  Logger.log("GROUP ADDRESSES: " + group_members);
  Logger.log("回答済: " + email_res);
  Logger.log("未回答: " + email_non);

  // 「未回答者」に対する処理。通常は督促メールを送るなどの機能を持たす。
  email_non.forEach(function(address) {
    // sendNotify(sender, address, title, doc_id); 
    Logger.log(address);
  });
};

function sendNotify(sender, sendTo, title, doc_id){
 // メールの件名
 let subject = title;

 // メールの本文作成する
 let template = DocumentApp.openById(doc_id);
 let body = template.getBody().getText();

 // 送信オプションを設定する
 let options = {
                 name: sender,
                 noReply: false
               };
 // 回答者にメールを送信する
 GmailApp.sendEmail(sendTo, subject, body, options);
}
