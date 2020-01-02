@extends('layouts.backend.app')

@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card mt-5">
                    @include('layouts.backend.components.alert')
                    <div id="line-list"></div>
                </div>
            </div>
        </div>
    </div>

@endsection
