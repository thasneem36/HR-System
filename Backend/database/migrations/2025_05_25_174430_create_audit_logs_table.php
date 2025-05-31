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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id('Log_ID');
            $table->string('TableName');
            $table->unsignedBigInteger('Record_ID');
            $table->string('Field');
            $table->text('OldValue')->nullable();
            $table->text('NewValue')->nullable();
            $table->unsignedBigInteger('ChangedBy');
            $table->timestamp('changed_at')->useCurrent();
        
            $table->foreign('ChangedBy')->references('User_ID')->on('users');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
