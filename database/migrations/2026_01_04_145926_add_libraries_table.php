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
        Schema::create('libraries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();

            // File storage OR path to file
            $table->string('file_path')->nullable(); // Path to SQLite file on disk
            $table->string('stored_file')->nullable(); // Uploaded file stored in storage/app

            // Rekordbox folder access
            $table->boolean('is_rekordbox_folder')->default(false);

            // Encryption
            $table->text('password')->nullable(); // Encrypted storage for DB password

            $table->timestamps();
            $table->softDeletes();

            // Ensure exactly one of file_path or stored_file is set
            $table->index(['user_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('libraries');
    }
};
