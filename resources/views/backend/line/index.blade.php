@extends('layouts.backend.app')

@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card mt-5">
                    @include('layouts.backend.components.alert')
                    <div class="card-body">

                        {{--
                        <h1 class="card-title text-center">Line Setting</h1>
                        <form action="{{ route('backend.line.send-message') }}" method="POST">
                            @csrf
                            <div>
                                <label for="name">輸入名稱：</label>
                                <input class="form-control" name="name" id="name" type="text" />
                                <div class="text-danger">
                                    @error('name') {{ $message }} @enderror
                                </div>
                            </div>
                            <div>
                                <label for="message">輸入內容：</label>
                                <textarea class="form-control" name="message" id="message" cols="30" rows="10"></textarea>
                                <div class="text-danger">
                                    @error('message') {{ $message }} @enderror
                                </div>
                            </div>
                            <div>
                                <label for="status">是否開啟自動發送：</label>
                                <input class="" name="status" id="status" type="checkbox" />
                                <div class="text-danger">
                                    @error('status') {{ $message }} @enderror
                                </div>
                            </div>
                            <div>
                                <label for="is_not_reply">是否句尾自動夾帶「系統自動發送資訊，請勿回覆」：</label>
                                <input class="" name="is_not_reply" id="is_not_reply" type="checkbox" />
                                <div class="text-danger">
                                    @error('is_not_reply') {{ $message }} @enderror
                                </div>
                            </div>
                            <div>
                                <label for="intro">自動發送週期：</label>
                                <input class="form-control" name="cron" id="cron" type="text" />
                                <div class="text-danger">
                                    @error('cron') {{ $message }} @enderror
                                </div>
                                <div class="mt-2">
                                    <span class="text-danger">請按以下格式進行輸入：</span>
                                    <ul>
                                        <li>請遵造「分(0-59)、時(0-23)、日(0-29)、月(0-11)、週(0-7)」的格式進行輸入。<br>
                                            例如：每日下午三點三十分執行一次，輸入<span class="text-danger">30 15 * * *</span>
                                        </li>
                                        <li>輸入*號代表皆會執行</li>
                                        <li>注意:週0及7都視為禮拜日</li>
                                        <li>注意週及日不可同時存在，例如：<span class="text-danger">0 10 1 * 1</span>會造成每月一號以及每週一10:00分各執行一次</li>
                                    </ul>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-4">送出</button>
                        </form> --}}

                        <div id="line-setting"></div>

                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
