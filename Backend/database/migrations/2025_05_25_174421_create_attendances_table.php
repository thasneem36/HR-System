<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id('Attendance_ID');
            $table->unsignedBigInteger('EMP_ID');
            $table->foreign('EMP_ID')->references('EMP_ID')->on('employees');
            $table->dateTime('Attend_Date');
            $table->dateTime('Process_Time');
            $table->dateTime('check_in')->nullable();
            $table->dateTime('check_out')->nullable();
            $table->unsignedBigInteger('Holiday_ID')->nullable();
            $table->foreign('Holiday_ID')->references('id')->on('holidays');
            $table->enum('status', ['present', 'absent', 'late', 'half_day', 'holiday'])->default('absent');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Add indexes for frequently queried columns
            $table->index('Attend_Date');
            $table->index(['EMP_ID', 'Attend_Date']);
            $table->index('status');
        });
    }

    public function down(): void {
        Schema::dropIfExists('attendances');
    }
};
