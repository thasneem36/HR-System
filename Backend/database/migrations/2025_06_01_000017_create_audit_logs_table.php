<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id('Log_ID');
            $table->string('TableName');
            $table->unsignedBigInteger('Record_ID');
            $table->string('Field');
            $table->string('OldValue')->nullable();
            $table->string('NewValue')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->timestamp('changed_at')->useCurrent();
        });
    }
    public function down(): void {
        Schema::dropIfExists('audit_logs');
    }
}; 