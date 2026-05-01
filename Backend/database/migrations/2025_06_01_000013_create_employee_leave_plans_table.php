<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('employee_leave_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_type_id')->constrained('employee_types');
            $table->foreignId('leave_type_id')->constrained('leave_types');
            $table->integer('leave_quota');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('employee_leave_plans');
    }
}; 