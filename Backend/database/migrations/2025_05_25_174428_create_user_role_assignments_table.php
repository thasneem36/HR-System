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
        Schema::create('user_role_assignments', function (Blueprint $table) {
            $table->unsignedBigInteger('User_ID');
            $table->unsignedBigInteger('Role_ID');
            $table->timestamp('assigned_at')->useCurrent();
        
            $table->foreign('User_ID')->references('User_ID')->on('users');
            $table->foreign('Role_ID')->references('Role_ID')->on('user_roles');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_role_assignments');
    }
};
