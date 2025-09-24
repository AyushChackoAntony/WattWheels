// frontend/app/src/app/api/vehicles/[id]/route.js
import { NextResponse } from "next/server";

// Mock database - same as above (in production, import from a shared module)
const mockVehicles = [
  {
    id: 1,
    ownerId: 'owner123',
    name: 'Tesla Model 3',
    type: 'car',
    status: 'active',
    year: 2023,
    color: 'White',
    licensePlate: 'CH01EV1234',
    batteryRange: '350km',
    acceleration: '0-60 in 3.1s',
    pricePerDay: 2500,
    location: 'Chandigarh',
    description: 'Premium electric sedan with autopilot features',
    image: '/images/ev-cars/tesla-model-3.svg',
    totalEarnings: 45800,
    monthlyEarnings: 8500,
    totalBookings: 256,
    monthlyBookings: 12,
    rating: 4.9,
    availability: 85,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2025-01-10T14:22:00Z'
  },
  {
    id: 2,
    ownerId: 'owner123',
    name: 'Ola S1 Pro',
    type: 'bike',
    status: 'active',
    year: 2023,
    color: 'Blue',
    licensePlate: 'CH01EV5678',
    batteryRange: '180km',
    acceleration: '0-40 in 3.0s',
    pricePerDay: 800,
    location: 'Chandigarh',
    description: 'High-performance electric scooter',
    image: '/images/ev-cars/ola-s1.svg',
    totalEarnings: 24500,
    monthlyEarnings: 4200,
    totalBookings: 158,
    monthlyBookings: 8,
    rating: 4.8,
    availability: 90,
    createdAt: '2023-02-20T12:15:00Z',
    updatedAt: '2025-01-10T16:45:00Z'
  }
];

// GET - Fetch single vehicle by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to view this vehicle
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    
    if (ownerId && vehicle.ownerId !== ownerId) {
      return NextResponse.json(
        { error: "Unauthorized to view this vehicle" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update vehicle
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    const data = await request.json();
    
    const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId);
    
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    const vehicle = mockVehicles[vehicleIndex];
    
    // Check ownership
    if (data.ownerId && vehicle.ownerId !== data.ownerId) {
      return NextResponse.json(
        { error: "Unauthorized to update this vehicle" },
        { status: 403 }
      );
    }

    // Validate license plate uniqueness if being updated
    if (data.licensePlate && data.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = mockVehicles.find(v => 
        v.licensePlate === data.licensePlate && v.id !== vehicleId
      );
      if (existingVehicle) {
        return NextResponse.json(
          { error: "Vehicle with this license plate already exists" },
          { status: 409 }
        );
      }
    }

    // Update vehicle fields
    const updatedVehicle = {
      ...vehicle,
      ...data,
      id: vehicleId, // Ensure ID doesn't change
      ownerId: vehicle.ownerId, // Ensure ownerId doesn't change
      updatedAt: new Date().toISOString()
    };

    // Update in mock database
    mockVehicles[vehicleIndex] = updatedVehicle;

    return NextResponse.json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update vehicle status
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    const { status, ownerId } = await request.json();
    
    const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId);
    
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    const vehicle = mockVehicles[vehicleIndex];
    
    // Check ownership
    if (ownerId && vehicle.ownerId !== ownerId) {
      return NextResponse.json(
        { error: "Unauthorized to update this vehicle" },
        { status: 403 }
      );
    }

    // Validate status
    const validStatuses = ['active', 'maintenance', 'inactive'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: active, maintenance, inactive" },
        { status: 400 }
      );
    }

    // Update status
    mockVehicles[vehicleIndex] = {
      ...vehicle,
      status,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "Vehicle status updated successfully",
      vehicle: mockVehicles[vehicleIndex]
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating vehicle status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete vehicle
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    
    const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId);
    
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    const vehicle = mockVehicles[vehicleIndex];
    
    // Check ownership
    if (ownerId && vehicle.ownerId !== ownerId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this vehicle" },
        { status: 403 }
      );
    }

    // Check if vehicle has active bookings (in production, check your bookings table)
    const hasActiveBookings = false; // Replace with actual check
    if (hasActiveBookings) {
      return NextResponse.json(
        { error: "Cannot delete vehicle with active bookings" },
        { status: 400 }
      );
    }

    // Remove from mock database
    mockVehicles.splice(vehicleIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Vehicle deleted successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}