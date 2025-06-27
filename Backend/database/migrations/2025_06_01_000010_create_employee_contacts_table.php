<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('employee_contacts', function (Blueprint $table) {
            $table->id('Contact_ID');
            $table->foreignId('employee_id')->constrained('employees');
            $table->string('Type');
            $table->string('Value');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('employee_contacts');
    }
}; 