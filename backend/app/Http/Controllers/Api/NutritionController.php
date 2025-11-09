<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NutritionEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NutritionController extends Controller
{
    /**
     * Get all nutrition entries for authenticated user
     */
    public function index(Request $request)
    {
        $query = NutritionEntry::where('user_id', auth()->id());

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('consumed_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('consumed_at', '<=', $request->end_date);
        }

        // Filter by meal type
        if ($request->has('meal_type')) {
            $query->where('meal_type', $request->meal_type);
        }

        // Pagination
        $perPage = $request->get('per_page', 50);
        $entries = $query->orderBy('consumed_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'entries' => $entries->items(),
                'pagination' => [
                    'total' => $entries->total(),
                    'current_page' => $entries->currentPage(),
                    'per_page' => $entries->perPage(),
                    'last_page' => $entries->lastPage()
                ]
            ]
        ]);
    }

    /**
     * Create new nutrition entry
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'food_name' => 'required|string|max:255',
            'calories' => 'required|numeric|min:0',
            'proteins' => 'nullable|numeric|min:0',
            'carbs' => 'nullable|numeric|min:0',
            'fats' => 'nullable|numeric|min:0',
            'fiber' => 'nullable|numeric|min:0',
            'serving_size' => 'nullable|numeric|min:0',
            'serving_unit' => 'nullable|string|max:50',
            'meal_type' => 'nullable|in:breakfast,lunch,dinner,snack',
            'source' => 'required|in:barcode,photo,manual',
            'barcode' => 'nullable|string|max:50',
            'photo_url' => 'nullable|url|max:500',
            'consumed_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $entry = NutritionEntry::create([
            'user_id' => auth()->id(),
            'food_name' => $request->food_name,
            'calories' => $request->calories,
            'proteins' => $request->proteins ?? 0,
            'carbs' => $request->carbs ?? 0,
            'fats' => $request->fats ?? 0,
            'fiber' => $request->fiber ?? 0,
            'serving_size' => $request->serving_size ?? 100,
            'serving_unit' => $request->serving_unit ?? 'g',
            'meal_type' => $request->meal_type,
            'source' => $request->source,
            'barcode' => $request->barcode,
            'photo_url' => $request->photo_url,
            'consumed_at' => $request->consumed_at ?? now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Nutrition entry created successfully',
            'data' => [
                'entry' => $entry
            ]
        ], 201);
    }

    /**
     * Get single nutrition entry
     */
    public function show($id)
    {
        $entry = NutritionEntry::where('user_id', auth()->id())->find($id);

        if (!$entry) {
            return response()->json([
                'success' => false,
                'message' => 'Entry not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'entry' => $entry
            ]
        ]);
    }

    /**
     * Update nutrition entry
     */
    public function update(Request $request, $id)
    {
        $entry = NutritionEntry::where('user_id', auth()->id())->find($id);

        if (!$entry) {
            return response()->json([
                'success' => false,
                'message' => 'Entry not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'food_name' => 'sometimes|string|max:255',
            'calories' => 'sometimes|numeric|min:0',
            'proteins' => 'nullable|numeric|min:0',
            'carbs' => 'nullable|numeric|min:0',
            'fats' => 'nullable|numeric|min:0',
            'fiber' => 'nullable|numeric|min:0',
            'serving_size' => 'nullable|numeric|min:0',
            'serving_unit' => 'nullable|string|max:50',
            'meal_type' => 'nullable|in:breakfast,lunch,dinner,snack',
            'consumed_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $entry->update($request->only([
            'food_name', 'calories', 'proteins', 'carbs', 'fats', 'fiber',
            'serving_size', 'serving_unit', 'meal_type', 'consumed_at'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Nutrition entry updated successfully',
            'data' => [
                'entry' => $entry
            ]
        ]);
    }

    /**
     * Delete nutrition entry
     */
    public function destroy($id)
    {
        $entry = NutritionEntry::where('user_id', auth()->id())->find($id);

        if (!$entry) {
            return response()->json([
                'success' => false,
                'message' => 'Entry not found'
            ], 404);
        }

        $entry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Nutrition entry deleted successfully'
        ]);
    }
}
