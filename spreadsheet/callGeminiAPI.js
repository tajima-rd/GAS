/**
 * @fileoverview Google Apps Script を使って、指定された項目についてGeminiに解説文を生成させるためのコードです。
 * askToGemini関数がメインの処理を呼び出し、callGeminiAPI関数が実際にAPIとの通信を行います。
 * 
 * 事前準備:
 * 1. Google Cloud PlatformでGemini APIを有効にし、APIキーを取得してください。
 * 2. 以下のコードで `apiKey` をスクリプト内に定義してください。
 * 
 * 使用例：
 * =askToGemini(A1)  // A1のセルの値を使ってプロンプトを作り、生成文を受け取る
 */

const apiKey = "YOUR_GOOGLE_GEMINI_API_KEY";  // ここにAPIキーを入力

/**
 * 指定された項目(item)に関する質問を生成し、Gemini APIに問い合わせる関数。
 * @param {string} item Geminiに説明してほしい事柄（例: "光合成"）。
 * @returns {string} Geminiによって生成された説明文。失敗した場合はエラーメッセージを返す。
 */
function askGemini(item) {
 // itemが空、またはスペースのみの場合は処理を中断
 if (!item || item.toString().trim() === "") {
   return "入力がありません";
 }

 // キャッシュ機能の実装
 const cache = CacheService.getScriptCache();
 // 入力値からユニークなキャッシュキーを生成
 const cacheKey = "gemini_desc_" + item.toString().trim();

 // 1. まずキャッシュにデータがあるか確認する
 const cachedResult = cache.get(cacheKey);
 if (cachedResult != null) {
   Logger.log("キャッシュから結果を返しました: " + item);
   // あればAPIを呼ばずにキャッシュした値を返す
   return cachedResult;
 }

 // 生成AIのパラメータを設定する。
 const tempera = 0.5;   // 生成されるテキストの多様性を調整 (0.0〜1.0)
 const top_p = 0.95;     // トークン選択の範囲を調整 (0.0〜1.0)
 const max_token = 400; // 生成されるテキストの最大長

 // 引数 `item` を使って、Geminiに投げるためのプロンプト（指示文）を生成する。
 // テンプレートリテラル (`) を使うことで、文字列内に変数を埋め込みやすくなっている。
 const question = `
   あなたは、優秀な薬剤師です。薬の説明を誰でも分かるように説明するのが仕事です。
   ${item}に関する説明を中学生でも分かるように${max_token}字でまとめてください。
   説明文はスタイルを設定せず、一続きの文章としてください。
 `;

 // キャッシュがなければ、実際にAPIを呼び出す
 // 準備したプロンプトと設定値を引数にして、実際にAPIを呼び出す関数 `callGeminiAPI` を実行する。
 // tempera, top_p, max_token は、この関数の外で定義されているグローバル変数を想定している。
 Logger.log("APIにリクエストを送信します: " + item);
 const result = callGeminiAPI(question, tempera, top_p, max_token);

 // APIから正常な応答が得られた場合、結果をキャッシュに保存する
 if (result !== "解説の生成に失敗しました。") {
   // キャッシュに結果を保存 (有効期限: 21600秒 = 6時間)
   cache.put(cacheKey, result, 21600);
 }

 // 処理の出力結果をGoogle Apps Scriptのログとして出力する。
 // [実行ログ]から確認でき、デバッグに役立つ。
 Logger.log(result);

 // APIから受け取った処理結果（説明文）を、この関数の戻り値として返す。
 return result;
}

/**
 * Gemini APIにリクエストを送信し、応答を取得する関数。
 * @param {string} prompt Geminiに送るプロンプト（指示文）。
 * @param {number} tempera 生成のランダム性を制御する値 (0.0〜1.0)。高いほど創造的になる。
 * @param {number} top_p 生成時に考慮する単語の範囲を制御する値 (0.0〜1.0)。通常は1.0で問題ない。
 * @param {number} max_token 生成されるテキストの最大トークン数（単語数や文字数に近いもの）。
 * @returns {string} APIから返されたテキスト部分。取得に失敗した場合はエラーメッセージを返す。
 */
function callGeminiAPI(prompt, tempera, top_p, max_token) {
  // Gemini APIのエンドポイントURLを定義する。
  // `apiKey` はスクリプトのプロパティやグローバル変数として事前に設定しておく必要がある。
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

  // APIに送信するリクエストの本体（ペイロード）をオブジェクトとして定義する。
  const payload = {
    // `contents` にユーザーからのプロンプト（指示文）を設定する。
    contents: [{ parts: [{ text: prompt }] }],
    // `generationConfig` で、文章生成時の挙動を細かく設定する。
    generationConfig: {
      temperature: tempera,       // 文章の多様性・ランダム性を設定
      topP: top_p,                // 次の単語を選ぶ際の選択肢の広さを設定
      maxOutputTokens: max_token  // 出力される文章の最大長を設定
    }
  };

  // Google Apps Scriptの `UrlFetchApp.fetch` メソッドで使用するオプションを設定する。
  const options = {
    method: "post",                   // HTTPメソッドをPOSTに指定
    contentType: "application/json",   // 送信するデータ形式をJSONに指定
    // payloadオブジェクトをJSON形式の文字列に変換して設定する。
    payload: JSON.stringify(payload),
    muteHttpExceptions: true          // APIからのエラー応答時に例外でスクリプトを停止させない
  };

  // `UrlFetchApp.fetch` を使って、指定したURLにリクエストを送信し、APIからの応答（レスポンス）を受け取る。
  const response = UrlFetchApp.fetch(url, options);

  // レスポンスボディをテキストとして取得し、JSONオブジェクトに変換（パース）する。
  const json = JSON.parse(response.getContentText());

  // JSONオブジェクトの中から、生成されたテキスト部分を取り出す。
  // `?.` (オプショナルチェイニング) は、途中のプロパティが存在しなくてもエラーにならず `undefined` を返す。
  // これにより、期待通りの形式で応答が返ってこなかった場合でも、スクリプトが停止するのを防ぐ。
  // テキストが取得できた場合はそのテキストを、できなかった場合は右辺のメッセージを返す。
  return json.candidates?.[0]?.content?.parts?.[0]?.text || "解説の生成に失敗しました。";
}
