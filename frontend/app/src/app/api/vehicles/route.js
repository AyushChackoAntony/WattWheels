import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status'); // active, maintenance, inactive
    const type = searchParams.get('type'); // car, bike
    
    if (!ownerId) {
      return NextResponse.json(
        { error: "Owner ID is required" }, 
        { status: 400 }
      );
    }

    // Send request to Flask backend
    const flaskRes = await fetch(`http://localhost:5000/api/vehicles?ownerId=${ownerId}&status=${status || ''}&type=${type || ''}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if you have JWT tokens
        // "Authorization": `Bearer ${token}`
      },
    });

    if (!flaskRes.ok) {
      const errorData = await flaskRes.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch vehicles" }, 
        { status: flaskRes.status }
      );
    }

    const vehiclesData = await flaskRes.json();
    console.log("Vehicles fetched from Flask:", vehiclesData);

    return NextResponse.json(vehiclesData, { status: 200 });

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}