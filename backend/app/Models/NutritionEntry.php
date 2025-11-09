<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NutritionEntry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'food_name',
        'barcode',
        'calories',
        'proteins',
        'carbs',
        'fats',
        'fiber',
        'serving_size',
        'serving_unit',
        'meal_type',
        'source',
        'photo_url',
        'consumed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'calories' => 'decimal:2',
            'proteins' => 'decimal:2',
            'carbs' => 'decimal:2',
            'fats' => 'decimal:2',
            'fiber' => 'decimal:2',
            'serving_size' => 'decimal:2',
            'consumed_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the nutrition entry.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
