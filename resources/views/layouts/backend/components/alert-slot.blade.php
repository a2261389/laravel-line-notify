
<div class="alert {{ $className }} alert-dismissible fade show" role="alert">
    <h4 class="alert-heading">
        {{ $title }}
    </h4>
    {{ $slot }}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
