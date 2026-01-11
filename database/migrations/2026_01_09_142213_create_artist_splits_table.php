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
        Schema::create('artist_splits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('library_id')->index();
            $table->unsignedBigInteger('compound_artist_id'); // ID of "Artist Lorem, Artist Ipsum"
            $table->unsignedBigInteger('resolved_artist_id'); // ID of "Artist Lorem"
            $table->string('extracted_name'); // The name as it appeared in the compound
            $table->integer('position'); // Order in the compound name (0-indexed)
            $table->float('confidence')->default(1.0); // Match confidence score
            $table->boolean('is_verified')->default(false); // Manual verification flag
            $table->timestamps();

            $table->unique(['compound_artist_id', 'resolved_artist_id']);
            $table->index(['compound_artist_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artist_splits');
    }
};
