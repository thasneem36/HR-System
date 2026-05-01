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
            $table->date('date_of_birth')->nullable();
            $table->date('hire_date');
            $table->foreignId('department_id')->constrained('departments');
            $table->foreignId('job_id')->constrained('jobs');
            $table->foreignId('employee_type_id')->constrained('employee_types');
            $table->foreignId('role_id')->constrained('user_roles');
            $table->unsignedBigInteger('report_manager_id')->nullable();
            $table->foreign('report_manager_id')->references('id')->on('employees');
            $table->decimal('salary', 10, 2)->nullable();
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
