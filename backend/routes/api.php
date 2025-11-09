<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NutritionController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StatsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| All routes are prefixed with /api
|
*/

// Version endpoint (public)
Route::get('/version', function () {
    return response()->json([
        'success' => true,
        'data' => [
            'version' => env('APP_VERSION', '0.0.1'),
            'environment' => env('APP_ENV', 'production'),
            'api_name' => 'ScanAssiette API'
        ]
    ]);
});

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // OAuth routes
    Route::get('/oauth/{provider}', [AuthController::class, 'redirectToProvider']);
    Route::get('/oauth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);
});

// Protected routes (JWT authentication required)
Route::middleware('auth:api')->group(function () {

    // Authentication
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Nutrition Entries
    Route::prefix('nutrition')->group(function () {
        Route::get('/', [NutritionController::class, 'index']);
        Route::post('/', [NutritionController::class, 'store']);
        Route::get('/{id}', [NutritionController::class, 'show']);
        Route::put('/{id}', [NutritionController::class, 'update']);
        Route::delete('/{id}', [NutritionController::class, 'destroy']);
    });

    // Statistics
    Route::prefix('stats')->group(function () {
        Route::get('/daily', [StatsController::class, 'daily']);
        Route::get('/weekly', [StatsController::class, 'weekly']);
        Route::get('/monthly', [StatsController::class, 'monthly']);
    });

    // User Profile
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/export', [ProfileController::class, 'exportData']);
    });
});
