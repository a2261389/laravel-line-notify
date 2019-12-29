<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\BackendController as BaseController;
use Illuminate\Http\Request;
use App\Services\Line\LineNotify;
use Illuminate\Support\Facades\Validator;
use App\Models\LineNotification;
use Illuminate\Support\Facades\Redirect;

class LineController extends BaseController
{
    protected $line_notify;

    public function __construct()
    {
        $this->line_notify = new LineNotify(
            env('LINE_CLIENT_ID'),
            env('LINE_CLIENT_SECRET'),
            env('LINE_CALLBACK_URL')
        );
    }

    public function index()
    {
        return view('backend.line.index');
    }

    public function show($id)
    {
        //
    }

    public function create()
    {
        return view('backend.line.create');
    }

    public function sendMessageIndex()
    {
        return view('backend.line.send');
    }

    public function store(Request $request)
    {
        info($request->all());

        $validator = Validator::make($request->all(), $this->validateRules(), $this->validateMessages());
        if ($validator->fails()) {
            return $this->responseJson($validator->errors(), 'failed', 422);
        }

        try {
            $cron = explode(' ', trim($request['cron']));
            if (count($cron) !== 5) {
                return $this->responseJson(['cron' => ['週期規則輸入錯誤 *']], '', 422);
            }

            $response = $this->line_notify->getToken($request['code']);
            if ($response["status"] != 200) {
                return $this->responseJson([], 'Failed: 無法獲取Line Notify Token，請重新操作。', 500);
            }
            $token = $response["access_token"];

            $line_notification = new LineNotification;
            if ($line_notification->where('token', $token)->first()) {
                return $this->responseJson([], 'Failed: 該Token已被使用。', 500);
            }

            $display_date = -1;
            $display_time = null;
            if (boolval($request['has_display_date']) && $request['display_date'] >= 0) {
                $display_date = $request['display_date'];
                $display_time = $request['display_time'] ?? $display_time;
            }

            $update = [
                'name' => $request['name'],
                'message' => $request['message'],
                'cron' => $request['cron'],
                'is_not_reply' => $request['is_not_reply'],
                'status' => $request['status'],
                'token' => $token,
                'display_date' => $display_date,
                'display_time' => $display_time,
            ];

            $line_notification->create($update);

            return $this->responseJson([], '操作成功', 200);
        } catch (\Throwable $th) {
            return $this->responseJson([], '操作失敗:' . $th->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        //
    }

    public function enable()
    {
        $lineNotify = new LineNotify(
            env('LINE_CLIENT_ID'),
            env('LINE_CLIENT_SECRET'),
            env('LINE_CALLBACK_URL')
        );
        return Redirect::to($lineNotify->authorization());
    }

    public function getLineList()
    {
        $notifications = LineNotification::select('id', 'name')->get();
        return $this->responseJson($notifications, '操作成功', 200);
    }



    /**
     * 送出Line Notify
     *
     * @param Illuminate\Http\Request  $request
     * @return Illuminate\Http\Response
     */
    public function sendMessage(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'notify_id' => 'bail|required|exists:line_notifications,id',
                'message' => 'bail|required',
            ], [
                'required' => '此為必填 *',
                'exists' => '沒有符合的Notify帳戶 *'
            ]);
            if ($validator->fails()) {
                return $this->responseJson($validator->errors(), 'failed', 422);
            }

            $notify = LineNotification::find($request['notify_id']);

            $data = [
                "message" => $request['message'],
                // "imageThumbnail" => "",
                // "imageFullsize" => "",
                // "imageFile" => "",
                // "stickerPackageId" => (int)1, // 表情符號
                // "stickerId" => (int)1, // 表情符號
            ];

            $response = $this->line_notify->sendNotify($notify->token, $data);
            if ($response["status"] != 200) {
                info($response);
                return $this->responseJson([], 'Failed: 無法獲取Line Notify Token，請重新操作。', 500);
            }

            return $this->responseJson([], '操作成功：已成功發出訊息。', 200);
        } catch (\Throwable $th) {
            return $this->responseJson([], '操作失敗:' . $th->getMessage(), 500);
        }
    }

    protected function validateRules($model = null)
    {
        $rules = [
            'message' => 'required|max:255',
            'name' => 'required|max:255',
            'cron' => 'required|max:255',
            'has_display_date' => 'required|boolean',
            'display_date' => 'required_if:has_display_date,true|integer|min:0',
            'display_time' => 'sometimes|max:255',
            'code' => 'required',
        ];

        return $rules;
    }

    protected function validateMessages()
    {
        $messages = [
            'required' => '此項目為必填 *',
            'display_date.required_if' => '請輸入天數 *',
            'display_time.required_if' => '請輸入文字 *',
            'inter' => '請輸入數字 *',
            'max' => '超過長度 :max *',
            'min' => '不可小於 :min',
        ];

        return $messages;
    }
}
