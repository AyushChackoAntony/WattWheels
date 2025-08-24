import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json(); // Get data from frontend
    console.log("Received from frontend:", data);

    return NextResponse.json( { message: "Data received successfully", receivedData: data }, { status: 200 } );

    // Send data to Flask backend
    // const flaskRes = await fetch("http://localhost:3000/customerLogin", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });

    // // Get response from Flask
    // const flaskData = await flaskRes.json();
    // console.log("Response from Flask:", flaskData);

    // // Send Flask's response back to frontend
    // return NextResponse.json(flaskData, { status: flaskRes.status });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Error in API route" }, { status: 500 });
  }
}
