# Docker コマンドで実行

GitHub Action を設定せずに、手元で画像を 1 枚だけ生成したいときに向いた方法です。

## 必要なもの

- [Docker](https://www.docker.com/)（新しめのバージョン）

## 実行する

action のオプションは、名前を大文字にして `INPUT_` を付けた環境変数として渡します（例: `user` → `INPUT_USER`、`plugin_languages` → `INPUT_PLUGIN_LANGUAGES`）。

生成された画像は、マウントした `/renders` ディレクトリに出力されます。

```shell
docker run --rm \
  --env INPUT_TOKEN=**** \
  --env INPUT_USER=<ユーザー名> \
  --env INPUT_PLUGIN_LANGUAGES=yes \
  --volume /tmp:/renders \
  ghcr.io/ruribou/portfolio-metrics:latest
```

上のコマンドなら `/tmp/github-metrics.svg` が生成されます。

`INPUT_TOKEN` には [Personal Access Token](https://github.com/settings/tokens) を指定します。タグは `latest` のほか、`@main` や `v1.1.1` のような特定バージョンも利用できます。

> 💡 Docker で実行する場合、出力はファイル生成のみ（`output_action` が自動的に `none`）になり、リポジトリへのコミットは行いません。
