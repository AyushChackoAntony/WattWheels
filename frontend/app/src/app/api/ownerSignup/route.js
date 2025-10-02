import { NextResponse } from "next/server";

export async function POST(request){
  try{
    const data = await request.json();
    console.log("Received from frontend", data);

    // test to check if data is being sent from frontend
    // return NextResponse.json(
    //   { success: true, receivedData: data },
    //   { status: 200 }
    // );

    // Sending data to flask 
    const flaskRes = await fetch("http://127.0.0.1:5000/api/auth/signup/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const flaskData = await flaskRes.json();

    return NextResponse.json(flaskData, { status: flaskRes.status });
  } catch(error){
    console.log("Api route ki error aa gyi", error);

    return NextResponse.json(
      { error: "API route main kuch locha ho gya" },
      { status: 500 },
    );
  }
}