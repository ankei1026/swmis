<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SMSController extends Controller
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.semaphore.api_key');
        $this->baseUrl = 'https://api.semaphore.co/api/v4/messages';
    }

    public function sendSms($number, $message)
    {
        try {
            $response = Http::post($this->baseUrl, [
                'apikey' => $this->apiKey,
                'number' => $number,
                'message' => $message,
            ]);

            if ($response->successful()) {
                Log::info('SMS sent successfully', [
                    'number' => $number,
                    'response' => $response->json()
                ]);
                return true;
            } else {
                Log::error('SMS sending failed', [
                    'number' => $number,
                    'response' => $response->body()
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('SMS service error: ' . $e->getMessage());
            return false;
        }
    }

    public function sendBulkSms($numbers, $message)
    {
        $successCount = 0;

        foreach ($numbers as $number) {
            if ($this->sendSms($number, $message)) {
                $successCount++;
            }
        }

        return $successCount;
    }
}
