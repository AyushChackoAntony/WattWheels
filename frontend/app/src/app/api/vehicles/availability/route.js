// frontend/app/src/app/api/vehicles/availability/route.js
import { NextResponse } from "next/server";

// Mock availability database
const mockAvailability = [
  {
    id: 1,
    vehicleId: 1,
    ownerId: 'owner123',
    startDate: '2025-01-10',
    endDate: '2025-01-14',
    isAvailable: true,
    reason: null,
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 2,
    vehicleId: 1,
    ownerId: 'owner123',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    isAvailable: false,
    reason: 'Maintenance',
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 3,
    vehicleId: 2,
    ownerId: 'owner123',
    startDate: '2025-01-10',
    endDate: '2025-01-31',
    isAvailable: true,
    reason: null,
    createdAt: '2025-01-01T10:00:00Z'
  }
];

// Mock vehicles for reference
const mockVehicles = [
  {
    id: 1,
    ownerId: 'owner123',
    name: 'Tesla Model 3',
    type: 'car',
    status: 'active',
    licensePlate: 'CH01EV1234'
  },
  {
    id: 2,
    ownerId: 'owner123',
    name: 'Ola S1 Pro',
    type: 'bike',
    status: 'active',
    licensePlate: 'CH01EV5678'
  }
];

// GET - Fetch availability for vehicles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!ownerId) {
      return NextResponse.json(
        { error: "Owner ID is required" },
        { status: 400 }
      );
    }

    // Filter availability records
    let filteredAvailability = mockAvailability.filter(
      availability => availability.ownerId === ownerId
    );

    if (vehicleId) {
      filteredAvailability = filteredAvailability.filter(
        availability => availability.vehicleId === parseInt(vehicleId)
      );
    }

    if (startDate && endDate) {
      filteredAvailability = filteredAvailability.filter(availability => {
        // Check if the availability period overlaps with requested period
        return !(availability.endDate < startDate || availability.startDate > endDate);
      });
    }

    // Group availability by vehicle and format the response
    const vehicleAvailability = {};
    
    // Get owner's vehicles
    const ownerVehicles = mockVehicles.filter(v => v.ownerId === ownerId);
    
    ownerVehicles.forEach(vehicle => {
      const availability = filteredAvailability.filter(a => a.vehicleId === vehicle.id);
      
      const availableDates = availability
        .filter(a => a.isAvailable)
        .map(a => ({
          start: a.startDate,
          end: a.endDate
        }));
      
      const blockedDates = availability
        .filter(a => !a.isAvailable)
        .map(a => ({
          start: a.startDate,
          end: a.endDate,
          reason: a.reason || 'Blocked'
        }));

      vehicleAvailability[vehicle.id] = {
        vehicle: {
          id: vehicle.id,
          name: vehicle.name,
          type: vehicle.type,
          licensePlate: vehicle.licensePlate,
          status: vehicle.status
        },
        availableDates,
        blockedDates,
        upcomingBookings: 0, // This would come from bookings table
        currentAvailability: Math.round((availableDates.length / (availableDates.length + blockedDates.length)) * 100) || 100
      };
    });

    return NextResponse.json({
      success: true,
      availability: vehicleAvailability,
      totalVehicles: ownerVehicles.length,
      availableVehicles: ownerVehicles.filter(v => v.status === 'active').length
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Set vehicle availability
export async function POST(request) {
  try {
    const data = await request.json();
    const { ownerId, vehicleId, startDate, endDate, isAvailable, reason } = data;

    // Validate required fields
    if (!ownerId || !vehicleId || !startDate || !endDate || isAvailable === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: ownerId, vehicleId, startDate, endDate, isAvailable" },
        { status: 400 }
      );
    }

    // Validate vehicle ownership
    const vehicle = mockVehicles.find(v => v.id === vehicleId && v.ownerId === ownerId);
    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found or unauthorized" },
        { status: 404 }
      );
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: "Start date cannot be after end date" },
        { status: 400 }
      );
    }

    // Check for overlapping availability entries
    const overlapping = mockAvailability.find(availability => 
      availability.vehicleId === vehicleId &&
      !(availability.endDate < startDate || availability.startDate > endDate)
    );

    if (overlapping) {
      return NextResponse.json(
        { error: "Overlapping availability period found. Please remove existing entries first." },
        { status: 409 }
      );
    }

    // Create new availability entry
    const newAvailability = {
      id: mockAvailability.length + 1,
      vehicleId: parseInt(vehicleId),
      ownerId,
      startDate,
      endDate,
      isAvailable,
      reason: isAvailable ? null : (reason || 'Blocked by owner'),
      createdAt: new Date().toISOString()
    };

    mockAvailability.push(newAvailability);

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
      availability: newAvailability
    }, { status: 201 });

  } catch (error) {
    console.error("Error setting availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Bulk update availability
export async function PUT(request) {
  try {
    const data = await request.json();
    const { ownerId, vehicleIds, startDate, endDate, isAvailable, reason } = data;

    // Validate required fields
    if (!ownerId || !vehicleIds || !Array.isArray(vehicleIds) || !startDate || !endDate || isAvailable === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: ownerId, vehicleIds (array), startDate, endDate, isAvailable" },
        { status: 400 }
      );
    }

    // Validate vehicle ownership for all vehicles
    const vehicles = mockVehicles.filter(v => 
      vehicleIds.includes(v.id) && v.ownerId === ownerId
    );

    if (vehicles.length !== vehicleIds.length) {
      return NextResponse.json(
        { error: "Some vehicles not found or unauthorized" },
        { status: 404 }
      );
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: "Start date cannot be after end date" },
        { status: 400 }
      );
    }

    const updatedAvailability = [];

    // Process each vehicle
    for (const vehicleId of vehicleIds) {
      // Remove overlapping entries for this vehicle and date range
      const overlappingIndices = [];
      mockAvailability.forEach((availability, index) => {
        if (availability.vehicleId === vehicleId &&
            !(availability.endDate < startDate || availability.startDate > endDate)) {
          overlappingIndices.push(index);
        }
      });

      // Remove overlapping entries (in reverse order to maintain indices)
      overlappingIndices.reverse().forEach(index => {
        mockAvailability.splice(index, 1);
      });

      // Add new availability entry
      const newAvailability = {
        id: mockAvailability.length + updatedAvailability.length + 1,
        vehicleId,
        ownerId,
        startDate,
        endDate,
        isAvailable,
        reason: isAvailable ? null : (reason || 'Blocked by owner'),
        createdAt: new Date().toISOString()
      };

      mockAvailability.push(newAvailability);
      updatedAvailability.push(newAvailability);
    }

    return NextResponse.json({
      success: true,
      message: `Availability updated for ${vehicleIds.length} vehicles`,
      updated: updatedAvailability.length,
      availability: updatedAvailability
    }, { status: 200 });

  } catch (error) {
    console.error("Error bulk updating availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove availability entry
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const availabilityId = searchParams.get('availabilityId');
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!ownerId) {
      return NextResponse.json(
        { error: "Owner ID is required" },
        { status: 400 }
      );
    }

    let entryIndex = -1;

    if (availabilityId) {
      // Delete by availability ID
      entryIndex = mockAvailability.findIndex(
        a => a.id === parseInt(availabilityId) && a.ownerId === ownerId
      );
    } else if (vehicleId && startDate && endDate) {
      // Delete by vehicle and date range
      entryIndex = mockAvailability.findIndex(
        a => a.vehicleId === parseInt(vehicleId) && 
             a.ownerId === ownerId && 
             a.startDate === startDate && 
             a.endDate === endDate
      );
    } else {
      return NextResponse.json(
        { error: "Either availabilityId or (vehicleId, startDate, endDate) required" },
        { status: 400 }
      );
    }

    if (entryIndex === -1) {
      return NextResponse.json(
        { error: "Availability entry not found" },
        { status: 404 }
      );
    }

    // Remove the entry
    const deletedEntry = mockAvailability.splice(entryIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: "Availability entry removed successfully",
      deleted: deletedEntry
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}