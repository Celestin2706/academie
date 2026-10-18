<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Language extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }
}
