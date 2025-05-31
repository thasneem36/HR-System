<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('User_ID'); 
            $table->foreignId('EMP_ID')
                ->constrained('employees', 'EMP_ID')
                ->onDelete('cascade');

            $table->string('email')->unique();
            $table->string('password');
            $table->string('status')->default('active'); 

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
