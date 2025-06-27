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
        Schema::create('employee_histories', function (Blueprint $table) {
            $table->id('History_ID');
            $table->unsignedBigInteger('EMP_ID');
            $table->unsignedBigInteger('Job_ID');
            $table->unsignedBigInteger('Role_ID');
            $table->date('StartDate');
            $table->date('EndDate')->nullable();
            $table->string('Remarks')->nullable();
            $table->string('Contect')->nullable();
            $table->timestamp('created_at')->useCurrent();
        
            $table->foreign('EMP_ID')->references('EMP_ID')->on('employees');
            $table->foreign('Job_ID')->references('Job_ID')->on('jobs');
            $table->foreign('Role_ID')->references('Role_ID')->on('user_roles');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_histories');
    }
};
