<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_verifications', function (Blueprint $table) {
            $table->id();
            
            // Resident relationship
            $table->unsignedBigInteger('resident_id');
            $table->foreign('resident_id')->references('id')->on('users')->onDelete('cascade');
            
            // Document type
            $table->enum('type', ['valid_id', 'birth_certificate', 'barangay_certificate']);
            
            // File storage (path to the uploaded file)
            $table->string('photo');
            
            // Verification status for this specific document
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            
            // Admin feedback if rejected
            $table->text('admin_feedback')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Ensure one document of each type per resident
            $table->unique(['resident_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_verifications');
    }
};