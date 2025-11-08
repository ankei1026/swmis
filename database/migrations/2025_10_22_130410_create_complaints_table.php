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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('resident_id');
            $table->foreign('resident_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('photo')->nullable();
            $table->enum('type', [
                'garbage',
                'road',
                'sewage',
                'public_safety',
            ]);

            $table->string('barangay');
            $table->string('description')->nullable();
            $table->enum('status', ['pending', 'resolve'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
