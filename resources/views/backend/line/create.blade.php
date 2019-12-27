@extends('layouts.backend.app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card mt-5">
                @include('layouts.backend.components.alert')
                <div class="card-body">
                    <div id="line-setting"></div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection
