// ******************************************
// 管理者に回答の通知を送信する場合
// ******************************************
function sendResponseTo(timestamp,email, message){
 // 送信先のリスト
 let toList = [
       "cc_receiver_a@sample.com",
       "cc_receiver_b@sample.com"
 ];

 // メールの件名
 let subject = "[自動メッセージ]フォームに回答がありました"

 // メールの本文を整形して作成する
 let body = "回答日時:" + timestamp + "\n回答者：" + email + "\n\n" + message;

 // 送信先のリストに順次メールを送信する
 for(let to of toList){
   GmailApp.sendEmail(to, subject, body);
 }
};

// ******************************************
// 回答者にありがとうメールを送信する場合
// ******************************************
function sendThankYouMail(sendTo){
 // メールの件名
 let subject = "[自動メッセージ]フォームの回答を確認しました";

 // メールの本文作成する
 let body = "回答ありがとうございました。"

 // 送信オプションを設定する
 let options = {
                 name: 'システム担当',
                 noReply: true,
               };
 // 回答者にメールを送信する
 GmailApp.sendEmail(sendTo, subject, body, options);
}
