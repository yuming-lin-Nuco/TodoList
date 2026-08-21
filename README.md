# 🏗️ プロジェクト概要
練習するために作った TodoList
```
Todolist
├── client # フロントエンド
└── server # バックエンド
```

# ⚙️ 開発環境の構築

### 使用言語: TypeScript

### 必須ツール

#### 　共通 / 開発環境：

- **Git**：コードのバージョン管理
- **Node.js**：サーバーサイドの JavaScript 実行環境
- **prek**：Git Hooks 管理ツール（commit する時に、自動的に ESLint、Prettier、Vitest を実行する）

#### 　フロントエンド：

- **Next.js**：React に基づいた Web フレームワーク
- **Vitest**：テストのフレームワーク
- **ESLint**：コードの品質チェック・構文エラーの検知（潜在的なバグの防止）
- **Prettier**：コードの自動整形（チームのコーディングスタイルを統一）

#### 　バックエンド：

- **Express**：バックエンドや API を作るための　Web フレームワーク
- **Vitest**：テストのフレームワーク
- **Prisma**：ORM（Object-Relational Mapping）を用いて、TypeScriptでデータベースを操作する
- **ESLint**：コードの品質チェック・構文エラーの検知（潜在的なバグの防止）
- **Prettier**：コードの自動整形（チームのコーディングスタイルを統一）

<br>

## 📥 必須ツールのセットアップ

### 1. Git のインストール

[Git 公式サイト](https://git-scm.com/)からダウンロードしてインストールしてください。

インストール後、ターミナルで確認：

```bash
git --version
```

---

### 2. Node.js のインストール

[Node.js 公式サイト](https://nodejs.org/)から **LTS 版**をダウンロードしてください。

インストール後、ターミナルで確認：

```bash
node --version
npm --version
```

---

### 3. prek のインストール

macOS の場合は Homebrew でインストールしてください：

```bash
brew install prek
```

インストール後、ターミナルで確認：

```bash
prek --version
```


<br>

# 🌱 初回セットアップ

### 1. リポジトリのクローン

プロジェクトに参加する際、最初に一度だけリポジトリをローカルに clone します。

```bash
git clone https://github.com/yuming-lin-Nuco/TodoList.git
cd TodoList

# 初回のみ、ユーザー情報を設定：
git config --local user.name "あなたの名前"
git config --local user.email "あなたの GitHub メールアドレス"
```

### 2. Git Hooks の有効化

必須ツールを全てダウンロードしたら、プロジェクトにインストール
```bash
prek install
```

### 3. フロントエンドのセットアップ

```bash
cd client
npm i
```

### 4. バックエンドのセットアップ

```bash
cd ../server
npm i

# .env ファイルを作成し、DATABASE_URL(データベースの接続先)を設定
echo 'DATABASE_URL="file:./dev.db"' > .env

# 既存のマイグレーションを適用し、dev.db(SQLite データベース)を作成
npx prisma migrate deploy

# schema.prisma から TypeScript の型定義と Client を生成
npx prisma generate
```

<br>

# 🚀 アプリケーションの起動方法

### 1. バックエンド

```bash
npm run dev
```
💡 起動後、バックエンドサーバーは http://localhost:3001 で動作します。

### 2. フロントエンド

新しいターミナルを開き、client ディレクトリに移動して起動します
```bash
cd Todolist/client
npm run dev
```
💡 起動後、ブラウザで http://localhost:3000 にアクセスしてください。

## 🔄 データベースのスキーマを変更する場合

`prisma/schema.prisma` にカラムを追加・変更した際は、以下の手順で反映してください。

### 1. マイグレーションを作成・適用する

```bash
cd server
npx prisma migrate dev --name 変更内容がわかる名前
e.g. "npx prisma migrate dev --name change_dueDate_to_dueTime"
```

このコマンドは、以下を自動的に行います：

- `schema.prisma` の変更内容を検出
- migration ファイル（SQL）を生成し、`prisma/migrations/` に保存
- `dev.db` に変更を適用
- Prisma Client の型定義を再生成

### 2. schema.prisma の内容をもとに、TypeScript が理解できる型定義（Prisma Client）を再生成する

Prisma v7 以上の場合は、以下を単体で実行してください（データベースには影響しません）。

```bash
npx prisma generate
```