<?php

namespace App\Http\Controllers;

use App\Models\Language;

class LanguageController extends Controller
{
    public function index()
    {
        return Language::withCount([
            'lessons' => fn ($query) => $query->where('published', true),
        ])->orderBy('name')->get();
    }

    public function show(Language $language)
    {
        return [
            'language' => $language,
            'lessons' => $language->lessons()
                ->where('published', true)
                ->orderBy('position')
                ->get(['id', 'title', 'slug', 'level', 'position']),
        ];
    }
}
