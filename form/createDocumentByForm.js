// アカウントの管理シート。Googleアカウント、姓、名、フォルダIDが記入されたもの
const accountSheet = SpreadsheetApp.openById("12Zu78RCyQjeonIjL8s-1mh9qkQ16S2TbAn90KnTWPaU");

// フォームの回答を転記するためのGoogle Documentのテンプレート
const formTemplate = DocumentApp.openById("1nJEjK2hJQOJtJt1K5omOu9nGC3YEPjIJW2gLfSEFfek")

// 個人フォルダを管理するためのルートディレクトリ
const rootDirectory = DriveApp.getFolderById("1JQLK9JN57ArbwYJ-6QuZIaLhyh-VZfCr");

// 出張者が実際に記入する提出フォーム
const form = FormApp.openById("1bLWDwBmFI46fB-7OET641sIpCMBlsIm4keCvIE6Sa2U");

function getLatestResponse() {
  // フォームの回答を全て取得する
  let formResponses = form.getResponses();

  let itemNumber = formResponses.length-1               // 最後の回答者の番号を取得する
  let formResponse = formResponses[itemNumber];         // 回答を取得する
  let itemResponses = formResponse.getItemResponses();  // 回答の質問項目を全て取得する
  let itemEmail = formResponse.getRespondentEmail()     // 回答者のメールアドレスを取得する（設定したいた場合）
  let itemTimeStamp = formResponse.getTimestamp()       // 回答のタイムスタンプを取得する

  // アカウントシートに記載された情報を使って個人フォルダのフォルダIDを取得する
  let dirPersonal = findPerson(itemEmail);

  // テンプレートを個人フォルダにコピーする
  let documentForm = copyTemplate(dirPersonal, itemTimeStamp);

  // テンプレートの所定欄をフォームの回答によって書き換える
  let submittedId = replaceByResponse(documentForm, itemResponses);
  let submittedURL = DriveApp.getFileById(submittedId).getUrl();

  // 提出された後のドキュメントのURLを確認用にメールで送ることなども可能。
  Logger.log(submittedURL);
}

function findPerson(account){
  // アカウント管理シートのデータを取得する
  let sheet = accountSheet.getSheetByName("シート1");

  // スプレッドシートのデータ範囲を取得する
  let range = sheet.getDataRange().getValues();

  // メールアドレスと一致するアカウントを見つけたら4列目に格納されたフォルダIDを返す。
  for(let row of range){
    if(account == row[0]){
      return(row[3]);
    }
  }
};

function copyTemplate(dirId, timestamp){
  // テンプレートのドキュメントIDを取得する
  let templateId = formTemplate.getId();

  // テンプレートのオブジェクトと個人ディレクトリのオブジェクトを取得する
  let template = DriveApp.getFileById(templateId)
  let destination = DriveApp.getFolderById(dirId);

  // テンプレートを個人ディレクトリにコピーする
  let document = template.makeCopy("出張報告_"+timestamp,destination);

  // 新しく作成したドキュメントのファイルIDを返す
  return(document.getId())
};

function replaceByResponse(docId, responses){
  let document = DocumentApp.openById(docId);   // 個人フォルダに複製されたテンプレートファイル
  let body = document.getBody();                // 複製されたテンプレートファイルのテキスト本文
  let date_from;                                // 日付計算のために用意する出発日の変数
  let date_to;                                  // 日付計算のために用意する帰着日の変数

  for (let i = 0; i < responses.length; i++) {
    let response = responses[i];                // j番目の質問項目を取得する
    let title = response.getItem().getTitle();  // 質問のタイトルを取得
    let entry = response.getResponse();         // 質問の回答を取得
    
    // フォームの項目タイトルを引数にしてテンプレートファイルの文字列を置換する
    switch(title){
      case "申請日":
        body.replaceText('{submission}', entry); 
        break;
      case "部署": 
        body.replaceText('{section}', entry); 
        break;
      case "氏名": 
        body.replaceText('{name}', entry); 
        break;
      case "予算種目": 
        body.replaceText('{category}', entry); 
        break;
      case "業務名": 
        body.replaceText('{title}', entry); 
        break;
      case "用務地": 
        body.replaceText('{address}', entry); 
        break;
      case "用務先": 
        body.replaceText('{place}', entry); 
        break;
      case "出発日": 
        // 日付計算を行うために出発日を日付型に変換して格納する
        date_from = Utilities.parseDate(entry,"JST","yyyy-MM-dd");
        body.replaceText('{date_from}', entry); 
        break;
      case "帰着日": 
      // 日付計算を行うために帰着日を日付型に変換して格納する
        date_to = Utilities.parseDate(entry,"JST","yyyy-MM-dd");
        body.replaceText('{date_to}', entry); 
        break;
      case "業務内容": 
        body.replaceText('{results}', entry); 
        break;
    };
  };
  // 日付型の出発日と帰着日を使って出張期間を計算する
  // 日付はミリ秒となっているので、最後に1000で割る
  let duration = ((date_to-date_from) / (60*60*24))/1000

  // 出張期間を計算する
  body.replaceText('{days}', duration); 

  return(docId);
};
