
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('leaves', function (Blueprint $table) {
            $table->id('Leave_ID');
            $table->unsignedBigInteger('EMP_ID');
            $table->unsignedBigInteger('ELP_ID');
            $table->unsignedBigInteger('ApprovedBy')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedBigInteger('Leave_Status');
            $table->text('Reason')->nullable();
            $table->string('Cover_up')->nullable();
            $table->string('AttachmentForLeave')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('EMP_ID')->references('EMP_ID')->on('employees');
            $table->foreign('ELP_ID')->references('ELP_ID')->on('employee_leave_plans');
            $table->foreign('Leave_Status')->references('Status_ID')->on('leave_statuses');
        });
    }

    public function down(): void {
        Schema::dropIfExists('leaves');
    }
};
