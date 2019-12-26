<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller as BaseController;
use Redirect;

class BackendController extends BaseController
{
    protected function redirectWith($route, $status = 'success', $message = '', $input = [])
    {
        if (!empty($input)) {
            return Redirect::to(route($route))->with($status, $message)->withInput($input);
        }
        return Redirect::to(route($route))->with($status, $message);
    }

    protected function responseJson($input = [], $message = [], $status = 200, $header = [])
    {
        $data = [];
        $data['status'] = $status;
        $data['data'] = $input;
        $data['message'] = $message;
        return response()->json($data, $status, $header);
    }
}
