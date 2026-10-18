<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'language_id',
        'title',
        'slug',
        'level',
        'content',
        'position',
        'published',
        'exercise_prompt',
        'exercise_starter',
        'exercise_expected',
    ];

    protected $casts = [
        'published' => 'boolean',
    ];

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }
}
