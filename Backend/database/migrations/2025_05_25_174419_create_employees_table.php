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
        Schema::create('employees', function (Blueprint $table) {
            $table->id('EMP_ID'); // bigint unsigned and auto-increment

            $table->string('Name');
            $table->string('NIC')->unique();
            $table->date('DOB');
            $table->date('StartDate');

            // Foreign keys
            $table->unsignedBigInteger('Job_ID');
            $table->unsignedBigInteger('EmployeeType_ID');
            $table->unsignedBigInteger('Role_ID');
            $table->unsignedBigInteger('ReportManager')->nullable();

            $table->string('Status')->default('Active'); // e.g., Active, Inactive

            $table->timestamps();
            $table->softDeletes();

            // Foreign key constraints
            $table->foreign('Job_ID')->references('Job_ID')->on('jobs')->onDelete('restrict');
            $table->foreign('EmployeeType_ID')->references('EmployeeType_ID')->on('employee_types')->onDelete('restrict');
            $table->foreign('Role_ID')->references('Role_ID')->on('user_roles')->onDelete('restrict');
            $table->foreign('ReportManager')->references('EMP_ID')->on('employees')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
