<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LessonProgressController extends Controller
{
    private const LANGUAGES = [
        'python' => 'python',
        'javascript' => 'javascript',
    ];

    public function index(Request $request)
    {
        return $request->user()->completedLessons()->pluck('lessons.id');
    }

    public function complete(Request $request, Lesson $lesson)
    {
        abort_unless($lesson->published, 404);

        // Une leçon avec exercice se valide uniquement en le réussissant
        abort_if($lesson->exercise_expected !== null, 403, "Cette leçon se valide en réussissant l'exercice.");

        $request->user()->completedLessons()->syncWithoutDetaching([$lesson->id]);

        return response()->json(['completed' => true]);
    }

    public function check(Request $request, Lesson $lesson)
    {
        abort_unless($lesson->published, 404);
        abort_if($lesson->exercise_expected === null, 404);

        $data = $request->validate([
            'code' => ['required', 'string', 'max:20000'],
        ]);

        $language = self::LANGUAGES[$lesson->language->slug] ?? null;
        abort_if($language === null, 422, "Langage non pris en charge pour l'exercice.");

        try {
            $response = Http::timeout(15)->post(config('services.piston.url') . '/api/v2/execute', [
                'language' => $language,
                'version' => '*',
                'files' => [['content' => $data['code']]],
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => "Le service d'exécution est indisponible."], 503);
        }

        if (! $response->successful()) {
            return response()->json(['message' => "Erreur du service d'exécution."], 502);
        }

        $result = $response->json();
        $output = $result['run']['output'] ?? '';
        $exitCode = $result['run']['code'] ?? 1;

        $passed = $exitCode === 0
            && $this->normalize($output) === $this->normalize($lesson->exercise_expected);

        if ($passed) {
            $request->user()->completedLessons()->syncWithoutDetaching([$lesson->id]);
        }

        return response()->json(['passed' => $passed, 'output' => $output]);
    }

    private function normalize(string $text): string
    {
        return trim(str_replace("\r\n", "\n", $text));
    }
}
