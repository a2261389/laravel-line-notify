@extends('layouts.backend.app')

@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card mt-5">
                    @include('layouts.backend.components.alert')
                    <div class="card-body">
                        <h1 class="card-title text-center">Line 啟用Notify</h1>
                        <form action="{{ route('backend.async.line-enable') }}" method="GET">
                            <div class="text-center">
                                <button class="btn btn-success mt-4 btn-lg">點擊導向LINE Notify</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
