# ローカル開発環境のセットアップ

この fork のソースを手元で動かし、変更やテストを行うための手順です。

## 必要なもの

- [Node.js](https://nodejs.org)（新しめのバージョン）

## セットアップ

リポジトリを clone して依存関係をインストールします。

```shell
git clone https://github.com/ruribou/portfolio-metrics.git
cd portfolio-metrics
npm install
```

## テスト・チェック

テストは [vitest](https://vitest.dev/) で実行します。外部 API を消費しないよう、データは mock 化されています。

```shell
npm test           # テストを実行
npm run typecheck  # 型チェック
npm run lint       # Lint
```

## プラグイン / テンプレートの雛形を作る

新しいプラグインやテンプレートのひな形を生成できます。

```shell
npm run quickstart -- plugin <name>
npm run quickstart -- template <name>
```

## 画像生成を手元で試す

レンダリングを 1 枚だけ試したい場合は、[Docker コマンドで実行](/.github/readme/partials/documentation/setup/docker.md)が手軽です。
