import { CustomerRequest } from "@/app/ibv-dashboard/form";
import { getToken } from "@/app/util/token";
import { NextRequest, NextResponse } from "next/server";
import { createToken } from "../eps/route";

export async function POST(req: NextRequest){
    try {
        const personData = await req.json()

        const baseUrl = process.env.IBV_URL || "https://apitest.microbilt.com/ibv/CreateForm"
        
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

const apiSearchFunction = async (baseUrl: string, personInfo: CustomerRequest) => {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${(await getToken()).accessToken}`
        },
        body: JSON.stringify({
            "CallbackUrl": "",
            "CallbackType": "",
            "ContactBy": "NEITHER",
            "DoNotRequestPhones": "true",
            "TransactionsNrOfDays": "365",
            "Customer": {
                "FirstName": personInfo.FirstName,
                "LastName": personInfo.LastName,
                "SSN": personInfo.SSN,
                "DOB": personInfo.DOB,
                "Address": personInfo.Address,
                "City": personInfo.City,
                "State": personInfo.State,
                "ZIP": personInfo.ZIP,
                "Country": personInfo.Country,
                "Phone": personInfo.Phone,
                "WorkPhone": personInfo.WorkPhone,
                "CellPhone": personInfo.CellPhone,
                "Email": personInfo.Email,
                "ABAnumber": personInfo.ABAnumber,
                "AccountNumber": personInfo.AccountNumber,
                "AccountType": personInfo.AccountType,
                "DirectDepositAmount": personInfo.DirectDepositAmount,
                "DirectDepositPayCycle": personInfo.DirectDepositPayCycle,
                "FinalUrl": "",
                "CompletionEmail": "",
                "Product": "IBVBUS"
            }
        })
    })
    return response
}