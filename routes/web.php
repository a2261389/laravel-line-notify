<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::group(['namespace' => 'Backend', 'prefix' => 'backend', 'as' => 'backend.'], function () {
    Route::resource('line', 'LineController');
    Route::get('/line-send', 'LineController@sendMessageIndex');

    Route::group(['as' => 'async.', 'prefix' => 'async'], function () {
        Route::post('line-send-message', 'LineController@sendMessage')->name('line-send-message');
        Route::get('line-list', 'LineController@getLineList')->name('line-list');
        Route::get('line-enable', 'LineController@enable')->name('line-enable');
    });
});
