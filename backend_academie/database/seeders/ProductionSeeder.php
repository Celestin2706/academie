<?php

namespace Database\Seeders;

use App\Models\Language;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        // Les langages de départ ne sont créés que si la base est vide,
        // pour ne jamais écraser les leçons que tu modifies en ligne
        if (Language::count() === 0) {
            $this->call(LanguageSeeder::class);
        }

        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            return;
        }

        $admin = User::firstOrNew(['email' => $email]);

        if (! $admin->exists) {
            $admin->name = 'Administrateur';
            $admin->password = Hash::make($password);
        }

        $admin->role = 'admin';
        $admin->save();
    }
}
