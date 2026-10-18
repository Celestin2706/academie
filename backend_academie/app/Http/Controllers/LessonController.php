<?php

namespace App\Http\Controllers;

use App\Models\Language;
use App\Models\Lesson;

class LessonController extends Controller
{
    public function show(Language $language, Lesson $lesson)
    {
        abort_unless($lesson->published, 404);

        $lesson->makeHidden('exercise_expected');

        return $lesson;
    }
}
