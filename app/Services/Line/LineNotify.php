<?php

namespace App\Services\Line;

use Exception;

class LineNotify
{
    private $clientId;
    private $clientSecret;
    private $callback;
    function __construct($clientId, $clientSecret, $callback)
    {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
        $this->callback = $callback;
    }
    /**
     * 傳送notify
     * @param string $token
     * @param array $data
     */
    function sendNotify($token, $data)
    {
        $url = "https://notify-api.line.me/api/notify";
        $type = "POST";
        $header = [
            "Authorization: Bearer " . $token,
            "Content-Type: multipart/form-data"
        ];
        if (!empty($data["imageFile"])) {
            $data["imageFile"] = curl_file_create($data["imageFile"], 'image/jpeg', 'test_name');
        }
        $response = $this->curl($url, $type, $data, [], $header);
        $response = json_decode($response, true);
        return $response;
    }

    /**
     * 取得OAuth2
     */
    function authorization()
    {
        $url = "https://notify-bot.line.me/oauth/authorize";
        $data = [
            "response_type" => "code",
            "client_id" => $this->clientId,
            "redirect_uri" => $this->callback,
            "scope" => "notify",
            "state" => "csrf_token"
        ];
        $url = $url . "?" . http_build_query($data);
        return $url;
    }

    /**
     * 使用OAuth2的code 取得token
     * @param string $code
     */
    function getToken($code)
    {
        $url = "https://notify-bot.line.me/oauth/token";
        $type = "POST";
        $data = [
            "grant_type" => "authorization_code",
            "code" => $code,
            "redirect_uri" => $this->callback,
            "client_id" => $this->clientId,
            "client_secret" => $this->clientSecret,
        ];
        $header = [
            "Content-Type: application/x-www-form-urlencoded"
        ];
        $response = $this->curl($url, $type, $data, [], $header);
        $response = json_decode($response, true);
        return $response;
    }
    /**
     * 連動解除
     * @param string $token
     */
    function rmToken($token)
    {
        $url = "https://notify-api.line.me/api/revoke";
        $type = "POST";
        $header = [
            "Authorization: Bearer " . $token,
            "Content-Type: application/x-www-form-urlencoded"
        ];
        $response = $this->curl($url, $type, [], [], $header);
        $response = json_decode($response, true);
        return $response;
    }

    /**
     * curl
     * @param string $url 網址
     * @param string $type GET or POST
     * @param array $data 資料
     * @param array $options curl 設定
     * @param array $header header
     */
    private function curl($url, $type = "GET", $data = [], $options = [], $header = [])
    {
        $ch = curl_init();
        if (strtoupper($type) == "GET") {
            $url = $url . "?" . http_build_query($data);
        } else { //POST
            if (in_array("Content-Type: multipart/form-data", $header)) {
                $options = [
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => $data
                ];
            } else {
                $options = [
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => http_build_query($data)
                ];
            }
        }
        $defaultOptions = [
            CURLOPT_URL => $url,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_RETURNTRANSFER => true, // 不直接出現回傳值
            CURLOPT_SSL_VERIFYPEER => false, // ssl
            CURLOPT_SSL_VERIFYHOST => false, // ssl
            CURLOPT_HEADER => true //取得header
        ];
        $options = $options + $defaultOptions;
        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $header = substr($response, 0, $headerSize);
        $response = substr($response, $headerSize);
        curl_close($ch);
        return $response;
    }
}
