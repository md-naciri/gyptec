<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('code_client')->nullable()->after('id');
            $table->string('complement_ident')->nullable()->after('nom');
        });

        // Generate codes for existing clients
        $clients = DB::table('clients')->orderBy('id')->get();
        foreach ($clients as $client) {
            $code = 'C-' . str_pad($client->id, 4, '0', STR_PAD_LEFT);
            DB::table('clients')->where('id', $client->id)->update(['code_client' => $code]);
        }

        Schema::table('clients', function (Blueprint $table) {
            $table->string('code_client')->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['code_client', 'complement_ident']);
        });
    }
};
