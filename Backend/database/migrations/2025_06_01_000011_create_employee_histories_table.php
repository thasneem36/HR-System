<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('employee_histories', function (Blueprint $table) {
            $table->id('History_ID');
            $table->foreignId('employee_id')->constrained('employees');
            $table->foreignId('job_id')->constrained('jobs');
            $table->unsignedBigInteger('role_id');
            $table->date('StartDate');
            $table->date('EndDate')->nullable();
            $table->string('Remarks')->nullable();
            $table->integer('Contect')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('role_id')->references('Role_ID')->on('user_roles');
        });
    }
    public function down(): void {
        Schema::dropIfExists('employee_histories');
    }
}; 