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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->unsignedInteger('age')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->decimal('height', 5, 2)->nullable()->comment('cm');
            $table->decimal('weight', 5, 2)->nullable()->comment('kg');
            $table->enum('activity_level', ['sedentary', 'light', 'moderate', 'active', 'very_active'])->default('moderate');
            $table->unsignedInteger('calorie_goal')->default(2000);
            $table->boolean('dark_mode')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
