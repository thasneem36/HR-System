<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id('Attendance_ID');
            $table->foreignId('employee_id')->constrained('employees');
            $table->dateTime('Attend_Date');
            $table->dateTime('Process_Time');
            $table->dateTime('check_in')->nullable();
            $table->dateTime('check_out')->nullable();
            $table->unsignedBigInteger('Holiday_ID')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('Holiday_ID')->references('id')->on('holidays');
        });
    }
    public function down(): void {
        Schema::dropIfExists('attendances');
    }
}; 