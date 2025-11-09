<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NutritionEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Get user profile
     */
    public function show()
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
     * Update user profile
     */
    public function update(Request $request)
    {
        $profile = auth()->user()->profile;

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'age' => 'nullable|integer|min:1|max:150',
            'gender' => 'nullable|in:male,female,other',
            'height' => 'nullable|numeric|min:0|max:300',
            'weight' => 'nullable|numeric|min:0|max:500',
            'activity_level' => 'nullable|in:sedentary,light,moderate,active,very_active',
            'calorie_goal' => 'nullable|integer|min:500|max:10000',
            'dark_mode' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $profile->update($request->only([
            'name', 'age', 'gender', 'height', 'weight',
            'activity_level', 'calorie_goal', 'dark_mode'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'profile' => $profile
            ]
        ]);
    }

    /**
     * Export user nutrition data to CSV
     */
    public function exportData(Request $request)
    {
        $query = NutritionEntry::where('user_id', auth()->id());

        if ($request->has('start_date')) {
            $query->where('consumed_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('consumed_at', '<=', $request->end_date);
        }

        $entries = $query->orderBy('consumed_at', 'desc')->get();

        $csv = "Date,Food,Calories,Proteins,Carbs,Fats,Fiber,Meal\n";

        foreach ($entries as $entry) {
            $csv .= sprintf(
                "%s,%s,%.2f,%.2f,%.2f,%.2f,%.2f,%s\n",
                $entry->consumed_at->format('Y-m-d H:i'),
                str_replace(',', ';', $entry->food_name),
                $entry->calories,
                $entry->proteins,
                $entry->carbs,
                $entry->fats,
                $entry->fiber,
                $entry->meal_type ?? 'N/A'
            );
        }

        $filename = 'nutrition_export_' . now()->format('Y-m-d') . '.csv';

        return response($csv, 200)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
