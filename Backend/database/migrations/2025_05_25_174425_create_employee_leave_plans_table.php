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
        Schema::create('employee_leave_plans', function (Blueprint $table) {
            $table->id('ELP_ID');
            $table->unsignedBigInteger('EmployeeType_ID');
            $table->unsignedBigInteger('LeaveType_ID');
            $table->integer('leave_quota');
            $table->string('status');
            $table->timestamps();
            $table->softDeletes();
        
            $table->foreign('EmployeeType_ID')->references('EmployeeType_ID')->on('employee_types');
            $table->foreign('LeaveType_ID')->references('LeaveType_ID')->on('leave_types');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_leave_plans');
    }
};
