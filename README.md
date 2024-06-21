## Google Form のための Google App Scripts
+ ### [Google Form の全ての回答を取得する](https://github.com/tajima-rd/GAS/blob/main/form/getAllResponses.js)
+ ### [Google Form の最後の回答を取得する](https://github.com/tajima-rd/GAS/blob/main/form/getLatestResponse.js)
+ ### [Google Form の回答後にメッセージを送信する](https://github.com/tajima-rd/GAS/blob/main/form/notifyByEmail.js)
+ ### [Google Form の回答結果を Google Document の個票に展開する](https://github.com/tajima-rd/GAS/blob/main/form/createDocumentByForm.js)

  このサンプルスクリプトでは、Google Form で得られた回答を Google Document の個票に展開します。このスクリプトでは Form からの回答を受け付けた際に、
  回答者のメールアドレスからアカウントシートに記載された個人フォルダIDし、その個人フォルダ内に Google Document のテンプレートをコピーした後にキーワードを置き換えます。

  なお、このスクリプトを使用し、フォーム提出後に自動的に実行させるためにはトリガーを設定する必要があります。Form のサンプル、Document のテンプレート、アカウントシートのサンプル
  のそれぞれについては以下のリンクからアクセスすることが可能です。テンプレートとアカウントシートについてえは閲覧権限となっていますが、メニューから「コピーを作成」をクリックすることで、
  ご自身の My Drive 内に複製を作成することができます。

    - [Google Form のサンプル](https://docs.google.com/forms/d/e/1FAIpQLSc5ka-HtvQGNhDdt19QTUl_15_Wp-RK_HTsmDoHaG2Rn7B6lQ/viewform)

    - [Google Document のテンプレート](https://docs.google.com/document/d/1nJEjK2hJQOJtJt1K5omOu9nGC3YEPjIJW2gLfSEFfek/edit?usp=drive_link)
  
    - [Google Spreadsheet のアカウントシート](https://docs.google.com/spreadsheets/d/12Zu78RCyQjeonIjL8s-1mh9qkQ16S2TbAn90KnTWPaU/edit?usp=drive_link)

## Google Spreadsheet のための Google App Scripts
+ ### [Google Spreadsheet に入力された場所名から緯度経度を取得する](spreadsheet/geocoding.js)

    - [Google Spreadsheet のサンプルシート](https://docs.google.com/spreadsheets/d/1tsrsAgiaHtalxcuTxeoY0E3JkmFhePIcn8bSDJUfoBY/edit?usp=sharing)
    
