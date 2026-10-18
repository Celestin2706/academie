<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;

class AdminChatController extends Controller
{
    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()->role === 'admin', 403);
    }

    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        return Conversation::with('user:id,name,email')
            ->whereNotNull('last_message_at')
            ->withCount([
                'messages as unread_count' => fn ($query) => $query
                    ->whereNull('read_at')
                    ->whereColumn('messages.sender_id', 'conversations.user_id'),
            ])
            ->orderByDesc('last_message_at')
            ->get();
    }

    public function messages(Request $request, Conversation $conversation)
    {
        $this->authorizeAdmin($request);

        // Les messages de l'utilisateur sont marqués comme lus
        $conversation->messages()
            ->where('sender_id', $conversation->user_id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return [
            'user' => $conversation->user()->first(['id', 'name', 'email']),
            'messages' => $conversation->messages()
                ->orderBy('id')
                ->get(['id', 'sender_id', 'body', 'created_at']),
        ];
    }

    public function reply(Request $request, Conversation $conversation)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json($message, 201);
    }
}
