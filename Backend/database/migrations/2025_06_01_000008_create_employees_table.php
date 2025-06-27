<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('nic')->unique();
            $table->date('date_of_birth');
            $table->date('hire_date');
            $table->foreignId('department_id')->constrained();
            $table->foreignId('job_id')->constrained();
            $table->unsignedBigInteger('employee_type_id');
            $table->foreign('employee_type_id')->references('EmployeeType_ID')->on('employee_types');
            $table->unsignedBigInteger('role_id');
            $table->foreign('role_id')->references('Role_ID')->on('user_roles');
            $table->string('status')->default('active');
            $table->text('address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void {
        Schema::dropIfExists('employees');
    }
}; 