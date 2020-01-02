<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Schema;
use App\Models\LineNotification;
use App\Services\Line\LineNotify;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();


        if (Schema::hasTable('line_notifications')) {
            $notifications = LineNotification::where('status', 1)->get();
            if ($notifications->count() > 0) {
                $line_notify = new LineNotify(
                    env('LINE_CLIENT_ID'),
                    env('LINE_CLIENT_SECRET'),
                    env('LINE_CALLBACK_URL')
                );
                foreach ($notifications as $notification) {
                    $schedule->call(function () use ($notification, &$line_notify) {

                        $message = "\r\n" . $notification->message;
                        $displayText = '';
                        if ($notification->display_date != -1) {
                            $timestamps = strtotime("+{$notification->display_date} days");
                            $date = date('Y/m/d', $timestamps);
                            $week = ['日', '一', '二', '三', '四', '五', '六'][date('w', $timestamps)];

                            $displayText = "{$date}({$week}) " . $notification->display_time;
                            $message = $message . "\r\n\r\n" . "時間：" . $displayText;
                        }

                        if ($notification->is_not_reply) {
                            $message = $message . "\r\n\r\n***此訊息為系統自動發出，請勿回覆***";
                        }
                        $data = [
                            'message' => $message,
                        ];
                        $line_notify->sendNotify($notification->token, $data);
                    })->cron($notification->cron);
                }
            }
        }
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
