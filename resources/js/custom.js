import NProgress from 'nprogress';

;$(document).ready(function () {
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    $(window).on('load', function () {
        NProgress.done();
    });
    $(window).ajaxStart(function () {
        NProgress.start();
    });
    $(window).ajaxStop(function () {
        NProgress.done();
    });

});
