# Portfolio Metrics

GitHub アカウントの統計を SVG / PNG / Markdown / PDF / JSON として生成し、プロフィール README などどこにでも埋め込めるインフォグラフィック生成ツールです。

[lowlighter/metrics](https://github.com/lowlighter/metrics) の fork で、ビルドを高速化し、いくつかの不具合を修正しています。

このドキュメントは日本語版です。網羅的な英語ドキュメントは [lowlighter/metrics](https://github.com/lowlighter/metrics) を参照してください。

## これは何？

コミット数・使用言語・各種アクティビティといった GitHub の統計を、多数のプラグインとオプションで自由にカスタマイズして画像化できるツールです。生成した画像はプロフィール README をはじめ、ブログや Web ページなどどこにでも埋め込めます。

## この fork の特徴

本家からの主な変更点は次のとおりです。

- 軽量な Docker イメージ。本家のビルド済みイメージの上に、この fork の `source/` だけを重ねる構成です。Chrome・deno・ruby を含むフルビルドを回避し、数秒でビルドが完了します。
- ビルド済みイメージの自動公開。`main` への push 時に fork の GHCR（`ghcr.io/ruribou/portfolio-metrics`）へイメージを公開します。Action 実行時はこれを優先して pull するため高速です。
- 不具合の修正。廃止された GitHub Projects (classic) や、空の PushEvents でも落ちないよう `achievements` / `habits` プラグインを修正しています。
- CI の整理。fork では通過できない upstream 専用ワークフローを削除しています。

## 使い方

プロフィール用リポジトリ（`<ユーザー名>/<ユーザー名>`）で GitHub Action として実行するのが、最も機能が揃った方法です。次の 3 ステップで始められます。

### 1. トークンを作成する

[Personal Access Token](https://github.com/settings/tokens) を作成し、リポジトリの Settings → Secrets and variables → Actions に `METRICS_TOKEN` という名前で登録します。

まずは `public_repo` スコープがあれば動きます。プライベートリポジトリの統計も含めたい場合は `repo` スコープを付与してください。

### 2. ワークフローを作成する

`.github/workflows/metrics.yml` を作成します。

```yaml
name: Metrics
on:
  # 毎日 0:00 (UTC) に更新
  schedule:
    - cron: "0 0 * * *"
  # 手動実行も可能にする
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  github-metrics:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: ruribou/portfolio-metrics@v1
        with:
          token: ${{ secrets.METRICS_TOKEN }}
          user: ruribou            # 自分の GitHub ユーザー名に変更
          template: classic
          base: header, activity, community, repositories, metadata
          # 使いたいプラグインを有効化（例）
          plugin_languages: yes
          plugin_isocalendar: yes
```

`@v1` は最新の v1 系を指す移動タグです。特定のバージョンに固定したい場合は `@v1.1.1` のようにパッチまで指定できます。最新の main を直接使いたい場合は `@main` も利用できます。

`use_prebuilt_image`（既定で有効）により、fork の GHCR に公開されたビルド済みイメージを pull します。pull に失敗した場合のみローカルでビルドします。

### 3. 生成された画像を埋め込む

ワークフローを実行すると、リポジトリのルートに `github-metrics.svg` が生成・コミットされます。プロフィール README に次のように埋め込みます。

```markdown
![Metrics](https://raw.githubusercontent.com/<ユーザー名>/<ユーザー名>/main/github-metrics.svg)
```

## よく使うオプション

| オプション | 説明 | 例 |
| --- | --- | --- |
| `token` | GitHub トークン（必須） | `${{ secrets.METRICS_TOKEN }}` |
| `user` | 対象ユーザー / 組織名 | `ruribou` |
| `template` | 見た目のテンプレート | `classic` / `terminal` / `markdown` |
| `base` | 表示する基本セクション | `header, activity, repositories` |
| `filename` | 出力ファイル名 | `github-metrics.svg` |
| `config_output` | 出力形式 | `svg` / `png` / `json` |
| `config_timezone` | タイムゾーン | `Asia/Tokyo` |
| `plugin_<name>` | プラグインの有効化 | `plugin_languages: yes` |

オプションは 300 以上あります。全一覧は [action.yml](/action.yml) または[本家ドキュメント](https://github.com/lowlighter/metrics)を参照してください。

## テンプレート

見た目の全体的な雰囲気を切り替えられます。

| テンプレート | 指定値 |
| --- | --- |
| [Classic](/source/templates/classic/README.md) | `classic` |
| [Repository](/source/templates/repository/README.md) | `repository` |
| [Terminal](/source/templates/terminal/README.md) | `terminal` |
| [Markdown](/source/templates/markdown/README.md) | `markdown` |
| [Community](/source/templates/community/README.md) | `community` |

## プラグイン

プラグインで表示内容を追加・カスタマイズできます。代表的なものを抜粋して掲載します（各リンクで設定方法を確認できます）。

<details>
<summary>GitHub 系プラグイン一覧を開く</summary>

- [Achievements <sub>`achievements`</sub>](/source/plugins/achievements/README.md)
- [Recent activity <sub>`activity`</sub>](/source/plugins/activity/README.md)
- [Commit calendar <sub>`calendar`</sub>](/source/plugins/calendar/README.md)
- [Repository contributors <sub>`contributors`</sub>](/source/plugins/contributors/README.md)
- [Follow-up of issues / PRs <sub>`followup`</sub>](/source/plugins/followup/README.md)
- [Coding habits <sub>`habits`</sub>](/source/plugins/habits/README.md)
- [Introduction <sub>`introduction`</sub>](/source/plugins/introduction/README.md)
- [Isometric commit calendar <sub>`isocalendar`</sub>](/source/plugins/isocalendar/README.md)
- [Languages activity <sub>`languages`</sub>](/source/plugins/languages/README.md)
- [Lines of code changed <sub>`lines`</sub>](/source/plugins/lines/README.md)
- [Featured repositories <sub>`repositories`</sub>](/source/plugins/repositories/README.md)
- [Stargazers <sub>`stargazers`</sub>](/source/plugins/stargazers/README.md)
- [Repositories traffic <sub>`traffic`</sub>](/source/plugins/traffic/README.md)

</details>

<details>
<summary>外部サービス連携プラグイン一覧を開く</summary>

- [Anilist <sub>`anilist`</sub>](/source/plugins/anilist/README.md)
- [Leetcode <sub>`leetcode`</sub>](/source/plugins/leetcode/README.md)
- [Music <sub>`music`</sub>](/source/plugins/music/README.md)
- [Google PageSpeed <sub>`pagespeed`</sub>](/source/plugins/pagespeed/README.md)
- [Recent posts <sub>`posts`</sub>](/source/plugins/posts/README.md)
- [RSS feed <sub>`rss`</sub>](/source/plugins/rss/README.md)
- [Stack Overflow <sub>`stackoverflow`</sub>](/source/plugins/stackoverflow/README.md)
- [Steam <sub>`steam`</sub>](/source/plugins/steam/README.md)
- [WakaTime <sub>`wakatime`</sub>](/source/plugins/wakatime/README.md)

</details>

全プラグイン（47 種）とコミュニティプラグインの一覧は [source/plugins/](/source/plugins/) を参照してください。

## その他のセットアップ方法

GitHub Action 以外にも、用途に応じて複数の方法があります。

- [Docker コマンドで実行（一回限りのレンダリング向け）](/.github/readme/partials/documentation/setup/docker.md)
- [共有インスタンスを使う（最も手軽）](/.github/readme/partials/documentation/setup/shared.md)
- [Web インスタンスをデプロイする](/.github/readme/partials/documentation/setup/web.md)
- [ローカル開発環境のセットアップ](/.github/readme/partials/documentation/setup/local.md)

## ライセンス

```
MIT License
Copyright (c) 2020-present lowlighter
```

本リポジトリは [lowlighter/metrics](https://github.com/lowlighter/metrics) の fork です。元の作者と全コントリビューターに感謝します。
