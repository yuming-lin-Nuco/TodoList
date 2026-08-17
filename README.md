# 🏗️ プロジェクト概要
練習するために作った TodoList
```
todolist
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

インストール後、ターミナルで確認：

```bash
brew install prek
```

<br>

# 🌱 初回セットアップ

### 1. リポジトリのクローン

プロジェクトに参加する際、最初に一度だけリポジトリをローカルに clone します。

```bash
git clone https://github.com/yuming-lin-Nuco/TodoList.git

# 初回のみ、ユーザー情報を設定：
cd TodoList
git config --local user.name "あなたの名前"
git config --local user.email "あなたの GitHub メールアドレス"
```

### 2. 共通ツールの初期設定

必須ツールを全てダウンロードしたら、プロジェクトにインストール
```bash
prek install
```

### 3. フロントエンドの環境構築

```bash
cd client

#主要フレームワークのインストール

npm install next react react-dom

#開発およびテストツールのインストール

npm install -D vitest eslint prettier eslint-config-next 

#`-D`（または `--save-dev`）オプションは、開発環境のみで必要なパッケージとしてインストールすることを意味します
```

### 4. バックエンドの環境構築

```bash
cd ../server

# 主要パッケージのインストール
npm install express @prisma/client

# 開発およびテストツールのインストール
npm install -D vitest eslint prettier prisma typescript @types/node @types/express ts-node

# Prisma の初期化（初回のみ実行）
npx prisma init
```

<br>