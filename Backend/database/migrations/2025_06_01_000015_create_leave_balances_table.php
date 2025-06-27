<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id('Balance_ID');
            $table->foreignId('employee_id')->constrained('employees');
            $table->unsignedBigInteger('LeaveType_ID');
            $table->integer('remaining_leaves');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('LeaveType_ID')->references('LeaveType_ID')->on('leave_types');
        });
    }
    public function down(): void {
        Schema::dropIfExists('leave_balances');
    }
}; 