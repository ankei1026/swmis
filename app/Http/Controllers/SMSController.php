<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class SMSController extends Controller
{
    protected $apiKey;
    protected $smsBaseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.philsms.api_key');
        $this->smsBaseUrl = 'https://dashboard.philsms.com/api/v3/sms/send';
    }

    /**
     * Send SMS to a single or multiple numbers.
     *
     * @param string|array $numbers Single number or array of numbers
     * @param string $message
     */
    public function sendSms($numbers, string $message)
    {
        if (is_array($numbers)) {
            $numbers = implode(',', $numbers);
        }

        try {
            $response = Http::withOptions(['verify' => false])
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($this->smsBaseUrl, [
                    'recipient' => $numbers,
                    'sender_id' => 'PhilSMS',
                    'type' => 'plain',
                    'message' => $message,
                ]);

            if ($response->successful()) {
                Log::info("✅ SMS sent to {$numbers}: " . $response->body());
            } else {
                Log::warning("⚠️ SMS failed for {$numbers}: " . $response->body());
            }

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("❌ SMS sending error to {$numbers}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send SMS to all users with phone numbers.
     */
    public function sendToAllUsers(string $message)
    {
        $users = User::whereNotNull('phone_number')->pluck('phone_number')->toArray();
        return $this->sendSms($users, $message);
    }

    /**
     * API endpoint to send message via request
     */
    public function send(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $message = $request->message;
        $success = $this->sendToAllUsers($message);

        return response()->json([
            'message' => $success ? 'SMS successfully sent.' : 'SMS failed to send.',
        ]);
    }
}
