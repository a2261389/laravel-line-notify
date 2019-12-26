
@if(session()->has('success'))
    @component('layouts.backend.components.alert-slot')
        @slot('className') alert-success @endslot
        @slot('title') 操作成功！ @endslot
        {{ session()->get('success') }}
    @endcomponent

@elseif(session()->has('danger'))
    @component('layouts.backend.components.alert-slot')
        @slot('className') alert-danger @endslot
        @slot('title') 操作失敗！ @endslot
        {{ session()->get('danger') }}
    @endcomponent

@elseif(session()->has('warning'))
    @component('layouts.backend.components.alert-slot')
        @slot('className') alert-warning @endslot
        @slot('title') 警告！ @endslot
        {{ session()->get('warning') }}
    @endcomponent

@elseif(session()->has('info'))
    @component('layouts.backend.components.alert-slot')
        @slot('className') alert-info @endslot
        @slot('title') 資訊 @endslot
        {{ session()->get('info') }}
    @endcomponent
@endif
