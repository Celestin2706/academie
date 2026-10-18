<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminLessonController extends Controller
{
    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()->role === 'admin', 403);
    }

    private function rules(): array
    {
        return [
            'language_id' => ['required', 'exists:languages,id'],
            'title' => ['required', 'string', 'max:255'],
            'level' => ['required', Rule::in(['debutant', 'intermediaire', 'avance'])],
            'content' => ['required', 'string'],
            'position' => ['required', 'integer', 'min:0'],
            'published' => ['required', 'boolean'],
            'exercise_prompt' => ['nullable', 'string'],
            'exercise_starter' => ['nullable', 'string'],
            'exercise_expected' => ['nullable', 'required_with:exercise_prompt', 'string'],
        ];
    }

    private function uniqueSlug(string $title, int $languageId): string
    {
        $base = Str::slug($title) ?: 'lecon';
        $slug = $base;
        $i = 2;

        while (Lesson::where('language_id', $languageId)->where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }

    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        return Lesson::with('language:id,name,slug')
            ->orderBy('language_id')
            ->orderBy('position')
            ->get(['id', 'language_id', 'title', 'slug', 'level', 'position', 'published']);
    }

    public function show(Request $request, Lesson $lesson)
    {
        $this->authorizeAdmin($request);

        return $lesson;
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate($this->rules());
        $data['slug'] = $this->uniqueSlug($data['title'], (int) $data['language_id']);

        return response()->json(Lesson::create($data), 201);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $this->authorizeAdmin($request);

        // Le slug ne change pas, pour que les liens existants restent valides
        $lesson->update($request->validate($this->rules()));

        return $lesson;
    }

    public function destroy(Request $request, Lesson $lesson)
    {
        $this->authorizeAdmin($request);

        $lesson->delete();

        return response()->noContent();
    }
}
