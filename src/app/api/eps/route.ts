import { PersonData } from "@/app/eps-dashboard/form";
import { getToken, storeToken } from "@/app/util/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const personData = await req.json()

        const baseUrl = process.env.EPS_URL || "https://apitest.microbilt.com/EnhancedPeopleSearch"
        
        const response = await apiSearchFunction(baseUrl, personData)
        const data = await response.json()
        
        if (!response.ok){
            if (data.fault?.faultstring?.toLowerCase().includes("access token")){
                await createToken()
                const response = await apiSearchFunction(baseUrl, personData)
                const data = await response.json()

                if (response.ok){
                    return NextResponse.json({ message: data }, { status: 200 })
                } else {
                    return NextResponse.json({ message: "There was an error"}, { status: 400 })
                }
            }
            
            return NextResponse.json({ message: "There was an error"}, { status: 400 })
        } 

        return NextResponse.json({ message: data }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed "}, { status: 500 })
    }    
}

const apiSearchFunction = async (baseUrl: string, personInfo: PersonData) => {
    const response = await fetch(`${baseUrl}/GetReport`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${(await getToken()).accessToken}`
        },
        body: JSON.stringify({
            "PersonInfo": {
                    "PersonName": {
                    "FirstName": personInfo.firstName,
                    "LastName": personInfo.lastName
                },
                "ContactInfo": [
                    {
                        "PostAddr": {
                        "StreetNum": personInfo.streetNumber,
                        "StreetName": personInfo.streetName,
                        "City": personInfo.city,
                        "StateProv": personInfo.state,
                        "PostalCode": personInfo.postalCode
                        }
                    }
                ]
            }
        })
    })
    return response
}

export const createToken = async () => {
    const baseUrl = process.env.OAUTH_TOKEN_URL || "https://apitest.microbilt.com/OAuth/Token";
    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: "client_credentials"
            })
        })

        const data = await response.json()
        if (response.ok){
            await storeToken(data.client_id, data.access_token, data.expires_in)
            return data.access_token
        } else {
            console.log(data)
            return null
        }
    } catch (error) {
        console.log("There was an error: " + error)
    }
}