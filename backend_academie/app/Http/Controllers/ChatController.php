<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    private function conversationFor(Request $request): Conversation
    {
        return Conversation::firstOrCreate(['user_id' => $request->user()->id]);
    }

    public function index(Request $request)
    {
        $conversation = $this->conversationFor($request);

        // Les messages reçus de l'admin sont marqués comme lus
        $conversation->messages()
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $conversation->messages()
            ->orderBy('id')
            ->get(['id', 'sender_id', 'body', 'created_at']);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $conversation = $this->conversationFor($request);

        $message = $conversation->messages()->create([
            'sender_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json($message, 201);
    }
}
