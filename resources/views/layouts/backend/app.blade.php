<!DOCTYPE html>

<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="description" content="Line Notify Send Test">
    <meta name="author" content="Tong">
    <title>LINE Notify 機器人</title>
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">

    @yield('customized-head')

</head>

<body class="app header-fixed sidebar-fixed sidebar-lg-show">

    {{-- @include('layouts.admin.components.header') --}}

    <div class="app-body">
        {{-- @include('layouts.backend.components.sidebar') --}}

        <main class="main">
            @yield('content')
        </main>
    </div>

    {{-- @include('layouts.backend.components.footer') --}}

    <script src="{{ mix('js/manifest.js') }}"></script>
    <script src="{{ mix('js/vendor.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>
    @yield('customized-js')
</body>

</html>
