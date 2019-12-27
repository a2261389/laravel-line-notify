<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLineNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('line_notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->boolean('status')->comment('狀態:開啟/停用')->default(true);
            $table->string('name');
            $table->string('token');
            $table->string('cron')->nullable()->comment('訊息發送排程');
            $table->tinyInteger('display_date')->default(-1)->comment('內容加上顯示特定日期-1:無/0:發送當日/1:發送日+1,以此類推');
            $table->string('display_time')->nullable()->comment('特定日期後加上時間文字,如13:00~13:30');
            $table->text('message');
            $table->boolean('is_not_reply')->default(true)->comment('是否開啟系統訊息請勿回復');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('line_notifications');
    }
}
