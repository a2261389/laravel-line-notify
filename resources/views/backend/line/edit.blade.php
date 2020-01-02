@extends('layouts.backend.app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card mt-5">
                @include('layouts.backend.components.alert')
                <div id="line-detail" data-id="{{ $id }}"></div>
        </div>
    </div>
</div>
</div>

@endsection
