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
        Schema::create('employee_contacts', function (Blueprint $table) {
            $table->id('Contact_ID');
            $table->unsignedBigInteger('EMP_ID');
            $table->string('Type'); // e.g., Mobile, Email
            $table->string('Value');
            $table->timestamps();
        
            $table->foreign('EMP_ID')->references('EMP_ID')->on('employees');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_contacts');
    }
};
