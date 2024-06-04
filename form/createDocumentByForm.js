// アカウントの管理シート。Googleアカウント、姓、名、フォルダIDが記入されたもの
const accountSheet = SpreadsheetApp.openById("1Sbq8BUCsVxUZUffw8lroQWq4VOAHdo37CiM9Z5Y-AzM");
const sheetName = "account_list";

// フォームの回答を転記するためのGoogle Documentのテンプレート
const formTemplate = DocumentApp.openById("1_re4wObJ7EsyJqk0K-U3Ayir5xAz7FUW4NxIp0aWmjM")

// 個人フォルダを管理するためのルートディレクトリ
const rootDirectory = DriveApp.getFolderById("1GBSExxF64luV5iH-rd-IQvhJn1neStQs");

// 出張者が実際に記入する提出フォーム
const form = FormApp.openById("1-8D5xbRiqsor2fFGePP225po9RmFe0kc0M_pLl4Q7OU");

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
  let sheet = accountSheet.getSheetByName(sheetName);

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
      case "添付資料":
        let attachmentList = {};    // 添付資料のファイル名をキーとするURLの連想配列
        let attachmentText = "";    // テンプレートを置き換えるためのテキスト用の変数
        let count = 1;              // 添付資料の番号を入れるためのカウンター

        for(let attachmentId of entry){
          // アップロードされた添付ファイルのドキュメントIDを取得する
          let attachment = DriveApp.getFileById(attachmentId);

          let attachmentName = attachment.getName();     // アップロードされたドキュメントの名前
          let attachmentUrl = attachment.getUrl();       // アップロードされたドキュメントのURL

          // 連想配列にファイル名をキー、URLを値として入れておく
          attachmentList[attachmentName] = attachmentUrl;

          // テンプレートに流し込むためのテキストを生成させておく
          attachmentText = attachmentText + "・添付資料" + count + "：\t" + attachmentName +"\n" 

          // カウンターの値をインクリメントして更新する
          count += 1;
        }
        // テンプレートの文字列をアップロードされた添付ファイル名で置き換える
        body.replaceText('{attachments}', attachmentText);

        // 添付ファイル名をリンク付きのテキストに変換する
        insertUrlLink(body, attachmentList)
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

function insertUrlLink(body, linkList){
  // 引数として与えられたリンクリストからキーとなるファイル名のリストを取り出す
  let keys = Object.keys(linkList);

  for(let key of keys){
    let search = key;         // 取り出したファイル名を検索文字列に指定する
    let link = linkList[key]  // 値として格納されているURLを取り出す

    // テキスト文字列から段落（パラグラフ）を取り出す
    let paragraphs = body.getParagraphs();

    for(let paragraph of paragraphs){
      let text = paragraph.getText();   // 取り出した段落の文字列だけを抽出する
      let match = text.match(search);   // 取り出した段落からテキストの一致部分を検索する

      // 一致する段落とテキストが見つかった場合、リンクを挿入する
      if(match){
        let index = match.index        // 検索文字列の最初の位置文字目の位置を取得する
        let linkLen = search.length - 1 // 検索文字列の長さを取得する

        //リンク付きにする
        paragraph.editAsText().setLinkUrl(index, index + linkLen, link)
      };
    };
  };
};
