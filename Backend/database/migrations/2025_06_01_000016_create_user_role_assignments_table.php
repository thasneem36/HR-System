<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('user_role_assignments', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users');
            $table->unsignedBigInteger('role_id');
            $table->foreign('role_id')->references('Role_ID')->on('user_roles');
            $table->timestamp('assigned_at')->useCurrent();
        });
    }
    public function down(): void {
        Schema::dropIfExists('user_role_assignments');
    }
}; 