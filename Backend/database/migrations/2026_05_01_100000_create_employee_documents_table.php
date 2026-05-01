<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->constrained('users');
            $table->string('title');
            $table->enum('category', ['contract', 'id_document', 'certificate', 'medical', 'other'])->default('other');
            $table->string('file_name');          // original filename shown to users
            $table->string('file_path');          // path inside storage/app/private/
            $table->unsignedBigInteger('file_size');  // bytes
            $table->string('mime_type', 100);
            $table->date('expiry_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('employee_id');
            $table->index('expiry_date');         // fast expiry-alert queries
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_documents');
    }
};
