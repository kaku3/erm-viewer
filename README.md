# erm-viewer
**インタラクティブ** ER図 / テーブル定義書です。

[demo](https://kaku3.github.io/erm-viewer/dist)
(ER Master で作成された erm ファイルを指定してください)

ER図やスキーマ作成は[ER Master](http://ermaster.sourceforge.net/index_ja.html) を用いて行うとよいのですが、png 出力されたER図や、Excel の大量のシートに定義されたテーブル定義から目的のテーブルやカラムを見つけるのは大変だったので、検索機能や参照機能に特化したビュワーを作成しました。

## 使用上の注意

手持ちの erm ファイルから ER Master のデータ構造を想定で作っていますので表示できないファイルもあるかもしれません。
ErmMixin.js などを修正すると動作するようになるかもしれません。


## 環境要件

```
node 16.13.2
yarn 1.22.4
```

## 実行

```
# インストール
yarn install
# 実行
yarn dev
```

http://localhost:3000 にアクセス


## コンセプト

- 検索機能
  - 論理名/物理名/説明でフィルタ
- ページ遷移なしでテーブルのカラム確認
  - テーブル一覧の任意のテーブルの拡張アイコンクリックでテーブルのカラムの表示/非表示切り替え
- ページ遷移なしでER図確認
  - テーブル一覧の任意のテーブルクリックでER図をオーバーレイ表示
- リレーション確認
  - ER図のリレーションを持つ項目クリックでリレーション一覧表示
  - リレーション一覧の任意のリレーションクリックで、対象項目を含むテーブルをスクロール表示

