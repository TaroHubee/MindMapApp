# MindMap アプリケーション - ローカル開発環境

## 技術スタック

### Frontend

- React 18 + TypeScript + Vite
- ReactFlow (マインドマップUI)
- Yjs (CRDT同期)
- Zustand (状態管理)
- Tailwind CSS

### Backend

- Node.js + Express + TypeScript
- SQLite (ローカルDB)
- WebSocket + Yjs
- Redis (Pub/Sub, プレゼンス管理)
- JWT認証

## プロジェクト構造

```
mindmap_local/
├── frontend/                 # React アプリケーション
├── services/
│   ├── auth-service/        # 認証サービス (Port 3001)
│   ├── api-gateway/         # APIゲートウェイ (Port 3000)
│   ├── mindmap-service/     # マインドマップCRUD (Port 3002)
│   └── websocket-service/   # WebSocket + Yjs (Port 3003)
├── shared/                  # 共通型定義
└── data/                    # SQLiteファイル
```

## スプリント計画 (7週間)

### Sprint 0: Auth Service基盤 (1-2日)

**目標**: 認証APIの最小実装

- [ ] ディレクトリ作成
- [ ] Express + TypeScript セットアップ
- [ ] SQLite ユーザーテーブル
- [ ] POST /register (bcrypt)
- [ ] POST /login (JWT発行)
- [ ] GET /health

### Sprint 1: Frontend認証 (3-4日)

- [ ] Vite + React + TypeScript
- [ ] ログイン/登録画面
- [ ] JWT保存 (localStorage)
- [ ] axios interceptor
- [ ] ルーティング (react-router-dom)

### Sprint 2: API Gateway (2-3日)

- [ ] Express Gateway (Port 3000)
- [ ] JWT検証ミドルウェア
- [ ] リバースプロキシ
- [ ] CORS設定

### Sprint 3: MindMap CRUD (3-4日)

- [ ] MindMap Service
- [ ] SQLite mindmaps/nodes/edges テーブル
- [ ] CRUD エンドポイント
- [ ] 権限チェック (owner/editor/viewer)

### Sprint 4: ReactFlow統合 (2-3日)

- [ ] ReactFlow インストール
- [ ] ノード/エッジ描画
- [ ] ドラッグ&ドロップ
- [ ] ツールバー (追加/削除)

### Sprint 5: WebSocket + Yjs (4-5日)

- [ ] WebSocket Service
- [ ] Yjs セットアップ (y-websocket)
- [ ] Redis Pub/Sub
- [ ] リアルタイム同期テスト

### Sprint 6: プレゼンス機能 (2-3日)

- [ ] アクティブユーザー表示
- [ ] カーソル位置共有 (Redis)
- [ ] アバター表示

### Sprint 7: 最適化 (2-3日)

- [ ] IndexedDB永続化 (y-indexeddb)
- [ ] エラーハンドリング
- [ ] ローディング状態
- [ ] レスポンシブ対応

### Sprint 8: Docker化 (1-2日)

- [ ] Dockerfile 各サービス
- [ ] docker-compose.yml
- [ ] Redis コンテナ
- [ ] ボリューム設定

## 開発開始コマンド (Sprint 0)

```bash
cd services/auth-service
npm init -y
npm install express cors dotenv bcrypt jsonwebtoken better-sqlite3
npm install -D typescript @types/node @types/express @types/bcrypt @types/jsonwebtoken ts-node nodemon
npx tsc --init
```

## 実行方法

```bash
# Auth Service
cd services/auth-service
npm run dev

# 他のサービスも同様
```

## 開発方針

1. **サービス優先**: 動くコードを1つずつ作成
2. **Docker は最後**: Sprint 8 でコンテナ化
3. **テスト駆動**: 各スプリント終了時に動作確認
4. **段階的実装**: 最小機能から追加
