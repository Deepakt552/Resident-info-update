<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of properties with search/filter.
     */
    public function index(Request $request)
    {
        $query = Property::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Filter by name
        if ($request->filled('name')) {
            $query->where('name', 'like', "%{$request->name}%");
        }

        // Filter by address
        if ($request->filled('address')) {
            $query->where('address', 'like', "%{$request->address}%");
        }

        // Sorting
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $properties = $query->paginate(10)->withQueryString();

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
            'filters' => $request->only(['search', 'name', 'address', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new property.
     */
    public function create()
    {
        return Inertia::render('Properties/Create');
    }

    /**
     * Store a newly created property in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ]);

        Property::create($validated);

        return redirect()->route('properties.index')
            ->with('success', 'Property created successfully.');
    }

    /**
     * Display the specified property.
     */
    public function show(Property $property)
    {
        return Inertia::render('Properties/Show', [
            'property' => $property,
        ]);
    }

    /**
     * Show the form for editing the specified property.
     */
    public function edit(Property $property)
    {
        return Inertia::render('Properties/Edit', [
            'property' => $property,
        ]);
    }

    /**
     * Update the specified property in storage.
     */
    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ]);

        $property->update($validated);

        return redirect()->route('properties.index')
            ->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified property from storage.
     */
    public function destroy(Property $property)
    {
        $property->delete();

        return redirect()->route('properties.index')
            ->with('success', 'Property deleted successfully.');
    }
}