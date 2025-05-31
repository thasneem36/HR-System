<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('employees', function (Blueprint $table) {
            $table->id('EMP_ID');
            $table->string('Name');
            $table->string('NIC')->unique();
            $table->date('DOB');
            $table->date('StartDate');
            $table->string('Email')->unique();
            $table->string('Phone', 20)->nullable();
            $table->text('Address')->nullable();
            $table->string('EmergencyContact')->nullable();
            $table->string('EmergencyPhone', 20)->nullable();
            $table->foreignId('Job_ID')->constrained('jobs');
            $table->foreignId('EmployeeType_ID')->constrained('employee_types');
            $table->foreignId('Role_ID')->constrained('user_roles');
            $table->unsignedBigInteger('ReportManager')->nullable();
            $table->enum('Status', ['active', 'inactive', 'on_leave', 'terminated'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ReportManager')
                  ->references('EMP_ID')
                  ->on('employees')
                  ->nullOnDelete();

            // Add indexes for frequently queried columns
            $table->index('Status');
            $table->index('StartDate');
            $table->index(['Name', 'Email']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('employees');
    }
}; 