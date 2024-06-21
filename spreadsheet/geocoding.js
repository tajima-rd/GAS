// 処理対象のシート名
const sheet_name = 'POI';

// これから処理するためのスプレッドシートを選択する
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);

// これから処理する列の番号を決めてやる
const col_id = 1;             // IDを入力するカラム
const col_res_latitude = 2;   // 緯度がある列（これから処理して入れる列）
const col_res_longitude = 3;  // 経度がある列（これから処理して入れる列）
const col_res_address = 4;    // 正式住所がある列（これから処理して入れる列）
const col_prefecture = 5;     // 検索対象の場所が所在する都道府県名
const col_city = 6;           // 検索対象の場所が所在する市町村名
const col_place = 7;          // 検索対象の場所が所在する市町村名
const col_category = 8;       // 検索対象の場所のカテゴリ

function geoCoding() {
  // 現在のデータが入っている最終行の番号を取得する
  // 処理の終了地点を知るために必要な情報となる。
  let lastrow = sheet.getLastRow();

  // Google Map が公開している機能を呼び出すための呪文を唱える。
  let geocoder = Maps.newGeocoder();

  //日本の住所に設定
  geocoder.setLanguage('ja'); 
  
  // 実際の処理を一行ずつ実行していく
  for (let i=2; i < lastrow + 1; i++) {
    // すでに、情報が入っているかもしれないので、確認できるように値を参照する。
    let latitude = sheet.getRange(i,col_res_longitude).getValue(); //緯度
    let longitude = sheet.getRange(i,col_res_latitude).getValue(); //経度
    
    // 参照元となるセルに値が入っていない場合と緯度経度情報を取得済みの場合にはパスする
    if(latitude !== '' && longitude !== '' ){
      continue;
    };

    // ジオコーディングを実行する
    // Google のサービスを使って位置情報を取得する
    let prefecture = sheet.getRange(i,col_prefecture).getValue(); // 都道府県名
    let city = sheet.getRange(i,col_city).getValue();             // 市町村名
    let place = sheet.getRange(i,col_place).getValue();           // 場所名

    // 検索したい場所の地名の前に都道府県名と市町村名を加えてジオコーディングを行う
    let search = prefecture + city + place;
    let response = geocoder.geocode(search); 
    let result = response.results[0]

    // 検索結果をシートの指定されたカラムに縫う力する
    sheet.getRange(i,col_res_latitude).setValue(result.geometry.location.lat);  //緯度
    sheet.getRange(i,col_res_longitude).setValue(result.geometry.location.lng); //経度
    sheet.getRange(i,col_res_address).setValue(result.formatted_address);      //正式住所
  };
};
