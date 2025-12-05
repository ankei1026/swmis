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
        Schema::table('schedules', function (Blueprint $table) {
            // Modify the status enum to add 'completed' option
            $table->enum('status', ['success', 'failed', 'pending', 'in_progress', 'completed'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            // Revert to original enum without 'completed'
            $table->enum('status', ['success', 'failed', 'pending', 'in_progress'])->change();
        });
    }
};
