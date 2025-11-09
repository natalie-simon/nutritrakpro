<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create user profile
        $profile = UserProfile::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'calorie_goal' => 2000,
            'activity_level' => 'moderate',
            'dark_mode' => false,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'profile' => $profile
                ],
                'token' => $token,
                'expires_in' => config('jwt.ttl') * 60
            ]
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = auth()->user();
        $profile = $user->profile;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'profile' => $profile
                ],
                'token' => $token,
                'expires_in' => config('jwt.ttl') * 60
            ]
        ]);
    }

    /**
     * Logout user (invalidate token)
     */
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Refresh JWT token
     */
    public function refresh()
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'expires_in' => config('jwt.ttl') * 60
            ]
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me()
    {
        $user = auth()->user();
        $profile = $user->profile;

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'email' => $user->email,
                'profile' => $profile
            ]
        ]);
    }

    /**
     * Redirect to OAuth provider
     */
    public function redirectToProvider($provider)
    {
        // Implementation for Laravel Socialite
        // TODO: Implement in Phase 3
        return response()->json([
            'success' => false,
            'message' => 'OAuth not yet implemented'
        ], 501);
    }

    /**
     * Handle OAuth callback
     */
    public function handleProviderCallback($provider)
    {
        // Implementation for Laravel Socialite
        // TODO: Implement in Phase 3
        return response()->json([
            'success' => false,
            'message' => 'OAuth not yet implemented'
        ], 501);
    }
}
