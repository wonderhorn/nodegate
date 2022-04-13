# nodegate
Node.jsで書いた簡易リバースプロキシ

## 使い方
node.js v8.10.0にて動作確認
```
npm install
node server.js
```

その後`localhost/` `localhost/gate` `localhost/ipaddress`にアクセスするとそれぞれ
リクエストが別サーバに振り分けられていることが確認できる
