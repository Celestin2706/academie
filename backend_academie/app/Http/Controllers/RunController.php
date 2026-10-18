<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RunController extends Controller
{
    private const LANGUAGES = [
        'python' => 'python',
        'javascript' => 'javascript',
    ];

    public function run(Request $request)
    {
        $data = $request->validate([
            'language' => ['required', 'string', 'in:' . implode(',', array_keys(self::LANGUAGES))],
            'code' => ['required', 'string', 'max:20000'],
            'stdin' => ['nullable', 'string', 'max:5000'],
        ]);

        try {
            $response = Http::timeout(15)->post(config('services.piston.url') . '/api/v2/execute', [
                'language' => self::LANGUAGES[$data['language']],
                'version' => '*',
                'files' => [['content' => $data['code']]],
                'stdin' => $data['stdin'] ?? '',
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => "Le service d'exécution est indisponible."], 503);
        }

        if (! $response->successful()) {
            return response()->json([
                'message' => $response->json('message') ?? "Erreur du service d'exécution.",
            ], 502);
        }

        $result = $response->json();

        return response()->json([
            'compile' => $result['compile']['output'] ?? null,
            'output' => $result['run']['output'] ?? '',
            'exit_code' => $result['run']['code'] ?? null,
            'signal' => $result['run']['signal'] ?? null,
            'status' => $result['run']['status'] ?? null,
            'message' => $result['run']['message'] ?? null,
        ]);
    }
}
