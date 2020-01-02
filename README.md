# Laravel LINE Notify Demo
使用ReactJS + Material UI + Laravel 搭載的LINE Notify Demo

## 安裝

1. 安裝 Composer 套件
```
composer install
```

---

2. 安裝 NPM 套件
```
npm install
```

---

3. 編譯 NPM 套件
```
npm run dev
```

---

4. 資料庫遷移
```
php artisan migrate
```
---

5. 設定LINE Notify
前往``https://notify-bot.line.me/zh_TW/``進行相關設定。

在專案.env檔案內新增以下LINE Notify設定
LINE_CLIENT_ID={您的Client ID}
LINE_CLIENT_SECRET={您的Secret}
LINE_CALLBACK_URL={您的Callback url}

---

安裝成功！
現在可以在網址列上輸入``http://{your project}/line``查看。
