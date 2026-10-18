<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\RunController;
use App\Http\Controllers\AdminChatController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AdminLessonController;
use App\Http\Controllers\LessonProgressController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/run', [RunController::class, 'run'])->middleware('throttle:20,1');
    Route::get('/chat/messages', [ChatController::class, 'index']);
    Route::post('/chat/messages', [ChatController::class, 'store'])->middleware('throttle:30,1');

    Route::get('/admin/conversations', [AdminChatController::class, 'index']);
    Route::get('/admin/conversations/{conversation}/messages', [AdminChatController::class, 'messages']);
    Route::post('/admin/conversations/{conversation}/messages', [AdminChatController::class, 'reply'])->middleware('throttle:60,1');

    Route::get('/admin/lessons', [AdminLessonController::class, 'index']);
    Route::post('/admin/lessons', [AdminLessonController::class, 'store']);
    Route::get('/admin/lessons/{lesson}', [AdminLessonController::class, 'show']);
    Route::put('/admin/lessons/{lesson}', [AdminLessonController::class, 'update']);
    Route::delete('/admin/lessons/{lesson}', [AdminLessonController::class, 'destroy']);
    Route::get('/progress', [LessonProgressController::class, 'index']);
    Route::post('/lessons/{lesson}/complete', [LessonProgressController::class, 'complete']);
    Route::post('/lessons/{lesson}/check', [LessonProgressController::class, 'check'])->middleware('throttle:20,1');
});

Route::get('/languages', [LanguageController::class, 'index']);
Route::get('/languages/{language:slug}', [LanguageController::class, 'show']);
Route::get('/languages/{language:slug}/lessons/{lesson:slug}', [LessonController::class, 'show']);

