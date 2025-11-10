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
        Schema::create('route_logs', function (Blueprint $table) {
            $table->id();

            $table->integer('current_station_index')->default(0);

            $table->foreignId('schedule_id')->constrained()->onDelete('cascade');
            $table->foreignId('station_route_id')->constrained()->onDelete('cascade');

            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->enum('action', ['departed', 'arrived', 'completed']);
            $table->text('notes')->nullable();
            $table->timestamp('log_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('route_logs');
    }
};
