<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'itdev1@navkarservices.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Sample Tenant Users
        User::create([
            'name' => 'John Tenant',
            'email' => 'test@example.com',
            'password' => Hash::make('12345678'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('12345678'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // Create Sample Properties
        Property::create([
            'name' => 'Sunset Apartments - Unit 101',
            'address' => '123 Sunset Blvd, Los Angeles, CA 90001',
        ]);

        Property::create([
            'name' => 'Oakwood Heights - Unit 205',
            'address' => '456 Oak Street, San Francisco, CA 94102',
        ]);

        Property::create([
            'name' => 'Riverside Complex - Unit 309',
            'address' => '789 River Road, Chicago, IL 60601',
        ]);
    }
}