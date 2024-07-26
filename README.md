# GPT Text Advisor

## これはなに
指定したテキストファイルを監視し，保存が入るたびにファイル内容をGPT APIに投げ，修正点を提示してくれるツール

## 導入

```
$ npm install
$ cp .env.sample .env
$ vi .env
# Open API Key，Organizationを指定する
$ tsc
$ node --env-file=.en index.js
```

## ToDo
- 監視対象のファイルパスを別途指定できるようにする
- 諸々の設定をGUIでやれるようにする
- 応答のフォーマットを統一するように