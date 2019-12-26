<div class="sidebar">
    <nav class="sidebar-nav">
        <ul class="nav">
            <li class="nav-title">
                {{ (env('APP_ENV') == 'local') ? __('admin.local') :__('admin.production') }}
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="#">
                    <i class="nav-icon icon-speedometer"></i> 儀表板
                </a>
            </li>
        </ul>
    </nav>
    <button class="sidebar-minimizer brand-minimizer" type="button"></button>
</div>
