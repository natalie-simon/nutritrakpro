<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nutrition_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('food_name');
            $table->string('barcode', 50)->nullable();
            $table->decimal('calories', 8, 2);
            $table->decimal('proteins', 8, 2)->default(0);
            $table->decimal('carbs', 8, 2)->default(0);
            $table->decimal('fats', 8, 2)->default(0);
            $table->decimal('fiber', 8, 2)->default(0);
            $table->decimal('serving_size', 8, 2)->default(100);
            $table->string('serving_unit', 50)->default('g');
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack'])->nullable();
            $table->enum('source', ['barcode', 'photo', 'manual']);
            $table->string('photo_url', 500)->nullable();
            $table->timestamp('consumed_at')->useCurrent();
            $table->timestamps();

            $table->index(['user_id', 'consumed_at']);
            $table->index('meal_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nutrition_entries');
    }
};
