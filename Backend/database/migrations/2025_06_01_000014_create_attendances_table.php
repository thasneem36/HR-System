<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees');
            $table->date('date');
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->string('status')->default('present'); // present | absent | late | half_day
            $table->string('notes')->nullable();
            $table->foreignId('holiday_id')->nullable()->constrained('holidays');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('attendances');
    }
}; 