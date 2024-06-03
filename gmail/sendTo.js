function sendMail(sendTo){
  // メールの件名
  let subject = "[自動メッセージ]通知メールです";

  // メールの本文作成する
  let body = "回答ありがとうございました。"

  // 添付ファイルが存在する場合
  let attachments_a = DriveApp.getFileById('XXXXXXXXXXXXXXX');
  let attachments_b = DriveApp.getFileById('YYYYYYYYYYYYYYY');

  // 送信オプションの設定
  let options = {
                  from: 'sender@sample.com',
                  name: 'システム担当',
                  noReply: true,
                  replyTo: 'info@sample.com',
                  cc: 'cc_receiver_a@sample.com,cc_receiver_b@sample.com',
                  bcc: 'bcc_receiver_a@sample.com,bcc_receiver_b@sample.com', 
                  attachments: [attachments_a, attachments_b]
                };

  // 回答者にメールを送信する
  GmailApp.sendEmail(sendTo, subject, body, options);
}
