<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['message' => 'NutriTrackPro API', 'version' => env('APP_VERSION', '0.0.1')];
});
