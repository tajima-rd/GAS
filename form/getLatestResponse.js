const form = FormApp.openByUrl('https://docs.google.com/forms/d/1879K76ItBk3HP0ts3Yxqc56v81zNNQR9Y8GNSUIfr-A/edit');

function getLatestResponse() {
 // フォームの回答を全て取得する
 let formResponses = form.getResponses();


 let itemNumber = formResponses.length-1               // 最後の回答者の番号を取得する
 let formResponse = formResponses[itemNumber];         // 回答を取得する
 let itemResponses = formResponse.getItemResponses();  // 回答の質問項目を全て取得する
 let itemEmail = formResponse.getRespondentEmail()     // 回答者のメールアドレスを取得する（設定したいた場合）
 let itemTimeStamp = formResponse.getTimestamp()       // 回答のタイムスタンプを取得する
 let textResponses = "";                               // 出力結果を格納するための空のテキストを用意する


 for (let i = 0; i < itemResponses.length; i++) {
   let itemResponse = itemResponses[i];                // j番目の質問項目を取得する
   let entryTitle = itemResponse.getItem().getTitle(); // 質問のタイトルを取得
   let entryResponse = itemResponse.getResponse();     // 質問の回答を取得


   // 出力用のテキストを順次追記しながら作成する。
   textResponses = textResponses + '質問「' + entryTitle + '」に「' + entryResponse + '」と回答しました\n'
 }
 Logger.log(textResponses);
}
