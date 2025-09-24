// frontend/app/src/app/api/vehicles/route.js
import { NextResponse } from "next/server";

// Mock database - replace with your actual database calls
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

// GET - Fetch vehicles for an owner
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    if (!ownerId) {
      return NextResponse.json(
        { error: "Owner ID is required" }, 
        { status: 400 }
      );
    }

    // Filter vehicles by owner
    let filteredVehicles = mockVehicles.filter(vehicle => vehicle.ownerId === ownerId);

    // Apply status filter
    if (status && status !== 'all') {
      if (status === 'cars') {
        filteredVehicles = filteredVehicles.filter(v => v.type === 'car');
      } else if (status === 'bikes') {
        filteredVehicles = filteredVehicles.filter(v => v.type === 'bike');
      } else {
        filteredVehicles = filteredVehicles.filter(v => v.status === status);
      }
    }

    // Apply type filter
    if (type && type !== 'all') {
      filteredVehicles = filteredVehicles.filter(v => v.type === type);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVehicles = filteredVehicles.filter(v => 
        v.name.toLowerCase().includes(searchLower) || 
        v.licensePlate.toLowerCase().includes(searchLower)
      );
    }

    // Calculate summary statistics
    const totalVehicles = filteredVehicles.length;
    const activeVehicles = filteredVehicles.filter(v => v.status === 'active').length;
    const totalMonthlyEarnings = filteredVehicles.reduce((sum, v) => sum + v.monthlyEarnings, 0);
    const totalMonthlyBookings = filteredVehicles.reduce((sum, v) => sum + v.monthlyBookings, 0);

    return NextResponse.json({
      success: true,
      vehicles: filteredVehicles,
      summary: {
        totalVehicles,
        activeVehicles,
        totalMonthlyEarnings,
        totalMonthlyBookings
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

// POST - Add new vehicle
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['ownerId', 'name', 'type', 'year', 'color', 'licensePlate', 'batteryRange', 'acceleration', 'pricePerDay', 'location'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if license plate already exists
    const existingVehicle = mockVehicles.find(v => v.licensePlate === data.licensePlate);
    if (existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle with this license plate already exists" },
        { status: 409 }
      );
    }

    // Create new vehicle
    const newVehicle = {
      id: mockVehicles.length + 1,
      ownerId: data.ownerId,
      name: data.name,
      type: data.type,
      status: 'active',
      year: parseInt(data.year),
      color: data.color,
      licensePlate: data.licensePlate,
      batteryRange: data.batteryRange,
      acceleration: data.acceleration,
      pricePerDay: parseInt(data.pricePerDay),
      location: data.location,
      description: data.description || '',
      image: data.image || (data.type === 'car' ? '/images/ev-cars/tesla-model-3.svg' : '/images/ev-cars/ola-s1.svg'),
      totalEarnings: 0,
      monthlyEarnings: 0,
      totalBookings: 0,
      monthlyBookings: 0,
      rating: 0,
      availability: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock database
    mockVehicles.push(newVehicle);

    return NextResponse.json({
      success: true,
      message: "Vehicle added successfully",
      vehicle: newVehicle
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}