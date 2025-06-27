<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('date');
            $table->string('description')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('holidays');
    }
}; 