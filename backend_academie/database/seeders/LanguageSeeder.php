<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $js = Language::updateOrCreate(
            ['slug' => 'javascript'],
            ['name' => 'JavaScript', 'description' => 'Le langage du web, pour rendre les pages interactives.']
        );

        $js->lessons()->updateOrCreate(
            ['slug' => 'les-variables'],
            [
                'title' => 'Les variables',
                'level' => 'debutant',
                'position' => 1,
                'published' => true,
                'content' => "Une variable sert à stocker une valeur.\n\nEn JavaScript, on utilise `let` pour une valeur qui peut changer et `const` pour une valeur fixe.",
            ]
        );

        $py = Language::updateOrCreate(
            ['slug' => 'python'],
            ['name' => 'Python', 'description' => 'Un langage simple et lisible, idéal pour débuter.']
        );

        $py->lessons()->updateOrCreate(
            ['slug' => 'afficher-un-message'],
            [
                'title' => 'Afficher un message',
                'level' => 'debutant',
                'position' => 1,
                'published' => true,
                'content' => "En Python, la fonction `print()` affiche du texte à l'écran.\n\nExemple : `print(\"Bonjour\")`.",
            ]
        );
    }
}
