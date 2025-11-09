<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NutritionEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatsController extends Controller
{
    /**
     * Get daily nutrition statistics
     */
    public function daily(Request $request)
    {
        $date = $request->get('date', now()->format('Y-m-d'));
        $userId = auth()->id();
        $user = auth()->user();

        $entries = NutritionEntry::where('user_id', $userId)
            ->whereDate('consumed_at', $date)
            ->get();

        $totals = [
            'calories' => $entries->sum('calories'),
            'proteins' => $entries->sum('proteins'),
            'carbs' => $entries->sum('carbs'),
            'fats' => $entries->sum('fats'),
            'fiber' => $entries->sum('fiber'),
        ];

        $calorieGoal = $user->profile->calorie_goal ?? 2000;

        $byMeal = $entries->groupBy('meal_type')->map(function ($mealEntries) {
            return [
                'calories' => $mealEntries->sum('calories'),
                'count' => $mealEntries->count()
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $date,
                'totals' => $totals,
                'goal' => [
                    'calories' => $calorieGoal,
                    'percentage' => $calorieGoal > 0 ? round(($totals['calories'] / $calorieGoal) * 100, 2) : 0
                ],
                'by_meal' => $byMeal
            ]
        ]);
    }

    /**
     * Get weekly nutrition statistics (last 7 days)
     */
    public function weekly()
    {
        $userId = auth()->id();
        $endDate = now();
        $startDate = now()->subDays(6);

        $dailyStats = NutritionEntry::where('user_id', $userId)
            ->whereBetween('consumed_at', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(consumed_at) as date'),
                DB::raw('SUM(calories) as calories'),
                DB::raw('SUM(proteins) as proteins'),
                DB::raw('SUM(carbs) as carbs'),
                DB::raw('SUM(fats) as fats')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $averages = [
            'calories' => round($dailyStats->avg('calories'), 2),
            'proteins' => round($dailyStats->avg('proteins'), 2),
            'carbs' => round($dailyStats->avg('carbs'), 2),
            'fats' => round($dailyStats->avg('fats'), 2),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'period' => [
                    'start' => $startDate->format('Y-m-d'),
                    'end' => $endDate->format('Y-m-d')
                ],
                'daily' => $dailyStats,
                'averages' => $averages
            ]
        ]);
    }

    /**
     * Get monthly nutrition statistics
     */
    public function monthly(Request $request)
    {
        $userId = auth()->id();
        $month = $request->get('month', now()->format('Y-m'));
        $startDate = Carbon::parse($month)->startOfMonth();
        $endDate = Carbon::parse($month)->endOfMonth();

        $dailyStats = NutritionEntry::where('user_id', $userId)
            ->whereBetween('consumed_at', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(consumed_at) as date'),
                DB::raw('SUM(calories) as calories'),
                DB::raw('SUM(proteins) as proteins'),
                DB::raw('SUM(carbs) as carbs'),
                DB::raw('SUM(fats) as fats')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $totals = [
            'calories' => $dailyStats->sum('calories'),
            'proteins' => $dailyStats->sum('proteins'),
            'carbs' => $dailyStats->sum('carbs'),
            'fats' => $dailyStats->sum('fats'),
        ];

        $averages = [
            'calories' => round($dailyStats->avg('calories'), 2),
            'proteins' => round($dailyStats->avg('proteins'), 2),
            'carbs' => round($dailyStats->avg('carbs'), 2),
            'fats' => round($dailyStats->avg('fats'), 2),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'month' => $month,
                'period' => [
                    'start' => $startDate->format('Y-m-d'),
                    'end' => $endDate->format('Y-m-d')
                ],
                'daily' => $dailyStats,
                'totals' => $totals,
                'averages' => $averages
            ]
        ]);
    }
}
