const form = FormApp.openByUrl('https://docs.google.com/forms/d/1879K76ItBk3HP0ts3Yxqc56v81zNNQR9Y8GNSUIfr-A/edit');

function getAllResponses(){
 // フォームの回答を全て取得する
 let formResponses = form.getResponses();

 // 全ての回答について順次処理を行う
 for (let i = 0; i < formResponses.length; i++) {
   let formResponse = formResponses[i];                  // i番目の回答を取得する
   let itemResponses = formResponse.getItemResponses();  // i番目の回答の質問項目を全て取得する
   let itemNumber = (i + 1).toString()                   // 回答者番号をテキストに変換
   let textResponses = '回答番号：' + itemNumber + '\n';   // 出力結果を格納するための空のテキストを用意する
  
   // 全ての質問項目について順次処理を行う
   for (let j = 0; j < itemResponses.length; j++) {
     let itemResponse = itemResponses[j];                // j番目の質問項目を取得する
     let entryTitle = itemResponse.getItem().getTitle(); // 質問のタイトルを取得
     let entryResponse = itemResponse.getResponse();     // 質問の回答を取得

     // 出力用のテキストを順次追記しながら作成する。
     textResponses = textResponses + '質問「' + entryTitle + '」に「' + entryResponse + '」と回答しました\n'
   }
   Logger.log(textResponses + '\n');
 }
}
