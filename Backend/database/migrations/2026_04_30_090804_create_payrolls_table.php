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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->unsignedTinyInteger('month');          // 1–12
            $table->unsignedSmallInteger('year');
            $table->decimal('basic_salary',  10, 2)->default(0);
            $table->json('allowances')->nullable();        // [{name, amount}, …]
            $table->json('deductions')->nullable();        // [{name, amount}, …]
            $table->decimal('gross_salary',  10, 2)->default(0);  // basic + Σallowances
            $table->decimal('net_salary',    10, 2)->default(0);  // gross  − Σdeductions
            $table->enum('status', ['draft', 'approved', 'paid'])->default('draft');
            $table->text('notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'month', 'year']);
            $table->index(['month', 'year', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
