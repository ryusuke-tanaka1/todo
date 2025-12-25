# Todo アプリ

初心者向けのTodoアプリケーションです。React Router、Prisma、PostgreSQLを使用して構築されています。

## 📋 必要なもの

このアプリを動かすために、以下のソフトウェアが必要です：

1. **Node.js** (バージョン 20.19以上 または 22.12以上)
2. **npm** (Node.jsと一緒にインストールされます)
3. **PostgreSQL** (バージョン 14以上)

## 🚀 セットアップ手順

**重要**: 以下の手順で`npm`や`npx prisma`などのコマンドを実行する場合は、**プロジェクトのルートディレクトリ**（`package.json`がある場所）で実行してください。

### ステップ 1: Node.js と npm の確認

まず、Node.jsとnpmがインストールされているか確認します。コマンドプロンプトまたはPowerShellを開いて以下を実行してください：

```bash
node --version
npm --version
```

両方のコマンドでバージョン番号が表示されればOKです。

**もし表示されない場合**:

- [Node.jsの公式サイト](https://nodejs.org/ja/)からインストールしてください
- 推奨版（LTS版）をダウンロードしてインストールします
- インストール後、コマンドプロンプトを再起動してください

**バージョン確認**:

- Node.jsは20.19以上、または22.12以上が必要です
- バージョンが足りない場合は、最新版にアップデートしてください

### ステップ 2: PostgreSQL のインストールとセットアップ

#### 2-1. PostgreSQL のインストール確認

まず、PostgreSQLがインストールされているか確認します：

```bash
psql --version
```

バージョン番号が表示されればOKです。

**もし表示されない場合**:

**Ubuntu/Debian (WSL含む)**:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS**:

```bash
brew install postgresql@16
```

**Windows**:

- [PostgreSQL公式サイト](https://www.postgresql.org/download/windows/)からインストーラーをダウンロード
- インストーラーを実行してインストール
- **重要**: インストール中に`postgres`ユーザーのパスワードを設定する画面が表示されます
  - このパスワードは後で`.env`ファイルで使用するので、忘れないようにメモしておいてください
  - パスワードは後から変更も可能ですが、設定したパスワードを覚えておくことをおすすめします

#### 2-2. PostgreSQL サービスの起動

PostgreSQLサービスが起動しているか確認します：

**Ubuntu/Debian (WSL含む)**:

```bash
sudo service postgresql status
```

起動していない場合は：

```bash
sudo service postgresql start
```

**macOS**:

```bash
brew services start postgresql@16
```

**Windows**:

- インストール時に自動起動設定を選択していれば、すでに起動しています
- 起動していない場合は、WindowsのサービスからPostgreSQLを起動してください

#### 2-3. データベースの作成

PostgreSQLに接続して、`todo`データベースを作成します：

**Windows**:

```bash
psql -U postgres
```

パスワードを求められたら、インストール時に設定した`postgres`ユーザーのパスワードを入力してください。

PostgreSQLのプロンプト（`postgres=#`）が表示されたら、以下を実行：

```sql
CREATE DATABASE todo;
```

作成確認：

```sql
\l
```

`todo`が表示されれば成功です。PostgreSQLを終了：

```sql
\q
```

**注意**: もし`psql`コマンドが見つからない場合は、PostgreSQLのインストール時に「コマンドラインツールをPATHに追加する」オプションを選択していない可能性があります。その場合は、PostgreSQLのインストールフォルダ（通常は`C:\Program Files\PostgreSQL\16\bin`）に直接移動して実行するか、環境変数PATHに追加してください。

### ステップ 3: 環境変数の設定

1. プロジェクトのルートフォルダに `.env` という名前のファイルを作成します
2. 以下の内容を `.env` ファイルに記入します：

```env
DATABASE_URL="postgresql://postgres:パスワード@localhost:5432/todo?schema=public"
```

**パスワードについて**:

- PostgreSQLの`postgres`ユーザーのパスワードは、**インストール時に設定したパスワード**を使用します
- インストール時に設定したパスワードを`DATABASE_URL`の`パスワード`部分に入力してください
- 例：インストール時に`mypassword123`と設定した場合：
  ```env
  DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/todo?schema=public"
  ```

**パスワードを忘れた場合や変更したい場合**:

```bash
psql -U postgres
```

PostgreSQLプロンプトで：

```sql
ALTER USER postgres WITH PASSWORD '新しいパスワード';
\q
```

その後、`.env`ファイルの`DATABASE_URL`も新しいパスワードに更新してください。

**注意**: `.env` ファイルはプロジェクトのルートフォルダ（`package.json` がある場所）に作成してください。

### ステップ 4: 依存関係のインストール

プロジェクトに必要なパッケージをインストールします：

```bash
npm install
```

このコマンドは数分かかる場合があります。完了するまで待ちましょう。

### ステップ 5: データベースのセットアップ

Prismaを使ってデータベースのテーブルを作成します：

```bash
npx prisma migrate dev
```

このコマンドで、データベースに`lists`と`items`テーブルが作成されます。

### ステップ 6: 開発サーバーの起動

以下のコマンドで開発サーバーを起動します：

```bash
npm run dev
```

数秒待つと、以下のようなメッセージが表示されます：

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### ステップ 7: ブラウザで確認

ブラウザを開いて、以下のURLにアクセスします：

```
http://localhost:5173
```

Todoアプリが表示されれば成功です！

## 🛠️ よくある問題と解決方法

### 問題1: `node: command not found` と表示される

**原因**: Node.jsがインストールされていないか、パスが通っていません。

**解決方法**:

- Node.jsをインストールしてください（ステップ1を参照）
- インストール後、ターミナルを再起動してください

### 問題2: `psql: command not found` と表示される

**原因**: PostgreSQLがインストールされていないか、パスが通っていません。

**解決方法**:

- PostgreSQLをインストールしてください（ステップ2-1を参照）
- インストール後、ターミナルを再起動してください

### 問題3: PostgreSQLサービスが起動しない

**原因**: PostgreSQLサービスが起動していない可能性があります。

**解決方法**:

1. Windowsキー + R を押して「ファイル名を指定して実行」を開く
2. `services.msc`と入力してEnterキーを押す
3. 「サービス」ウィンドウで「postgresql」を検索
4. 「postgresql」サービスを右クリック → 「開始」を選択

**または、コマンドプロンプトから起動**:

```bash
net start postgresql-x64-16
```

（バージョンによって`postgresql-x64-16`の部分が異なる場合があります）

### 問題4: `npm install` でエラーが出る

**原因**: ネットワークの問題や、Node.jsのバージョンが古い可能性があります。

**解決方法**:

- Node.jsのバージョンを確認してください（`node --version`）
- バージョン20.19以上、または22.12以上であることを確認してください
- インターネット接続を確認してください

### 問題5: `DATABASE_URL` が見つからないというエラー

**原因**: `.env` ファイルが作成されていないか、間違った場所にあります。

**解決方法**:

- プロジェクトのルートフォルダに `.env` ファイルがあるか確認してください
- `.env` ファイルの中身が正しいか確認してください（ステップ3を参照）

### 問題6: データベースに接続できない

**原因**: PostgreSQLサービスが起動していないか、パスワードが間違っている可能性があります。

**解決方法**:

1. PostgreSQLサービスが起動しているか確認（問題3を参照）
2. 接続確認：

```bash
psql -U postgres -d todo -h localhost
```

パスワードを求められた場合は、インストール時に設定したパスワードを入力してください。3. `.env`ファイルの`DATABASE_URL`に設定したパスワードが正しいか確認してください

### 問題7: ポート5173が既に使用されている

**原因**: 他のアプリケーションが同じポートを使用しています。

**解決方法**:

- 既に起動している開発サーバーを停止してください（Ctrl + C）
- または、他のアプリケーションを停止してください

## 📝 開発時のコマンド一覧

| コマンド                      | 説明                                       |
| ----------------------------- | ------------------------------------------ |
| `npm run dev`                 | 開発サーバーを起動します                   |
| `npm run build`               | 本番用にビルドします                       |
| `npm run start`               | ビルドしたアプリを起動します               |
| `npm run typecheck`           | TypeScriptの型チェックを実行します         |
| `npx prisma migrate dev`      | データベースのマイグレーションを実行します |
| `npx prisma studio`           | データベースの中身をブラウザで確認できます |
| `net start postgresql-x64-16` | PostgreSQLを起動します（管理者権限が必要） |
| `net stop postgresql-x64-16`  | PostgreSQLを停止します（管理者権限が必要） |

## 🗄️ データベースの操作

### データベースの中身を確認する

以下のコマンドで、ブラウザからデータベースの中身を確認できます：

```bash
npx prisma studio
```

ブラウザが自動的に開き、データベースの内容を確認・編集できます。

### データベースをリセットする

データベースを最初からやり直したい場合：

```bash
# PostgreSQLに接続
psql -U postgres

# データベースを削除（注意：すべてのデータが消えます）
DROP DATABASE todo;

# データベースを再作成
CREATE DATABASE todo;

# PostgreSQLを終了
\q

# マイグレーションを実行
npx prisma migrate dev
```

## 📚 学習リソース

このプロジェクトで使用している技術の学習リソース：

- [React Router 公式ドキュメント](https://reactrouter.com/)
- [Prisma 公式ドキュメント](https://www.prisma.io/docs)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/ja/docs/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)

## 🆘 困ったときは

1. エラーメッセージをよく読んでください
2. 上記の「よくある問題と解決方法」を確認してください
3. Node.jsとnpmのバージョンを確認してください
4. PostgreSQLサービスが起動しているか確認してください
5. `.env`ファイルの`DATABASE_URL`が正しいか確認してください
6. ターミナルを再起動してみてください

## 📚 開発ガイド

アプリを起動できたら、次は開発を始めましょう！

**👉 [開発ガイド](./docs/開発ガイド.md) を読んで、どのファイルを編集すればいいか学びましょう**

開発ガイドでは以下の内容を説明しています：

- 基礎知識（npm、package.json、UIライブラリなど）
- プロジェクトの構造
- よく編集するファイルとディレクトリ
- 開発の流れ
- 初心者へのアドバイス

**データベースについて詳しく知りたい場合**：

**👉 [データベース基礎知識](./docs/データベース基礎知識.md) を読んで、データベースとは何か、どうやって使うのかを学びましょう**

**Cursorの拡張機能を設定したい場合**：

**👉 [Cursor拡張機能の推奨設定](./docs/Cursor拡張機能の推奨設定.md) を読んで、開発に便利な拡張機能をインストールしましょう**

---

Happy Coding! 🎉
