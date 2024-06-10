function run(){
  let parent = "";            // 親ディレクトリのフォルダID
  let dirName = "new folder"  // 作成するフォルダの名前
  let editors = [];           // 編集者のアカウントを配列で渡す
  let viewers = [];           // 閲覧者のアカウントを配列で渡す

  // スクリプトを実行する
  let newid = createDirectory(parent, dirName, editors, viewers);

  // 新しく作成したフォルダのフォルダIDをログとして出力する
  Logger.log(newid);
}

function createDirectory(parent, dirName, editors, viewers){
  // 親ディレクトリをフォルダIDを使って開く
  let rootDirectory = DriveApp.getFolderById(parent);
  
  // 親ディレクトリの直下に与えられた名前でフォルダを作成する
  let newFolder = rootDirectory.createFolder(dirName);

  // 作成したフォルダの共有設定を追加する
  newFolder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.FILE_ORGANIZER);

  // 作成したフォルダに編集権限を与える
  if(editors.length > 0){newFolder.addEditors(editors)};

  // 作成したフォルダに閲覧権限を与える
  if(viewers.length > 0){newFolder.addViewers(viewers)};
  
  // // アクセスのプロパティ
  // DriveApp.Access.ANYONE             // インターネット上の誰でも検索してアクセスできます。ログインは不要です。
  // DriveApp.Access.ANYONE_WITH_LINK   // リンクを知っている全員がアクセスできます。ログインは不要です。
  // DriveApp.Access.DOMAIN             // ドメイン内のユーザーが検索してアクセスできます。ログインが必要です。
  // DriveApp.Access.DOMAIN_WITH_LINK   // リンクを知っているドメイン内のユーザーがアクセスできます。ログインが必要です。
  // DriveApp.Access.PRIVATE            // 明示的に権限を付与されたユーザーのみがアクセスできます。ログインが必要です。

  // // 権限のプロパティ
  // DriveApp.Permission.VIEW           // 表示とコピーのみ可能。
  // DriveApp.Permission.COMMENT        // そのファイルやフォルダを編集可能。
  // DriveApp.Permission.EDIT           // 表示、コピー、コメントのみを行うことが可能。 
  // DriveApp.Permission.OWNER          // ファイルやフォルダのオーナー。
  // DriveApp.Permission.ORGANIZER      // 共有ドライブ内のファイルとフォルダを整理できるユーザー。
  // DriveApp.Permission.FILE_ORGANIZER // 共有ドライブ内でコンテンツを編集、ゴミ箱に入れ、移動できるユーザー
  // DriveApp.Permission.NONE           // ユーザーにファイルやフォルダに対する権限がありません

  return(newFolder.getId());
};
