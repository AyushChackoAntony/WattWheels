import { NextResponse } from "next/server";
// export async function GET(){
//     return NextResponse.json({
//         hello : "world",
//     });
// }

export async function POST(request){
    try{
        const data = await request.json()
        return NextResponse.json({
            data,
        });

        // const flaskRes = await fetch("http://localhost:5000/customerSignup", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(data)
        // });

        // const flaskData = await flaskRes.json();

        // return NextResponse.json(flaskData, { status: flaskRes.status });
    } catch(error){
        return NextResponse.json(
            { error: "API route main kuch locha ho gya" },
            { status: 500 },
        );
    }
}