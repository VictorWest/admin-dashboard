"use client"

import { FormEvent, useState } from "react"
import DashboardInput from "../components/dashboard-input"
import { AccountType, accountTypeOptions, canadianProvincesAndTerritories, countryOptions, CountryType, PaymentCycle, paymentCycleOptions, usStateAndTerritoryInitials } from "../util/data"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import Oval from "react-loading-icons/dist/esm/components/oval"
import { sendIBVEmail } from "../components/resend"
import LogOut from "../components/logout"
import Link from "next/link"

export interface CustomerRequest {
    FirstName: string;
    LastName: string;
    SSN: string;
    DOB: string;
    Address: string;
    City: string;
    State: string;
    ZIP: string;
    Country: CountryType;
    Phone: string;
    WorkPhone: string;
    CellPhone: string;
    Email: string;
    ABAnumber: string;
    AccountNumber: string;
    AccountType: AccountType;
    DirectDepositAmount: string;
    DirectDepositPayCycle: PaymentCycle;
}

export const initialCustomerRequest: CustomerRequest = {
    FirstName: "",
    LastName: "",
    SSN: "",
    DOB: "",
    Address: "",
    City: "",
    State: "",
    ZIP: "",
    Country: "USA",
    Phone: "",
    WorkPhone: "",
    CellPhone: "",
    Email: "",
    ABAnumber: "",
    AccountNumber: "",
    AccountType: "Checking",
    DirectDepositAmount: "",
    DirectDepositPayCycle: "Every other week"
};

export default function Form(){

    const [ personData, setPersonData ] = useState<CustomerRequest>(initialCustomerRequest)
    const [ stateFieldIsClicked, setStateFieldIsClicked ] = useState(false)
    const [ countryFieldIsClicked, setCountryFieldIsClicked ] = useState(false)
    const [ accountTypeIsClicked, setAccountTypeIsClicked ] = useState(false)
    const [ paymentCycleIsClicked, setPaymentCycleIsClicked ] = useState(false)

    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState("")
    const [ success, setSuccess ] = useState("")

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const hasEmpty = Object.values(personData).some(item => item.trim() === "")

        if (hasEmpty){
            setError("All fields must be completed before proceeding")
        } else {
            setError("")
            setSuccess("")
            setIsLoading(true)
            try {
                const response = await fetch("/api/ibv", {
                    method: "POST", 
                    body: JSON.stringify({ ...personData })
                })

                const data = await response.json()

                if(data.message.Url){
                    try {
                        await sendIBVEmail(personData.Email, data.message.Url, personData.FirstName)
                        setSuccess("The IBV URL has been sent to " + personData.Email)
                    } catch (error) {
                        setError("There was an error sending you an email. Please try again")
                    }
                } else {
                    setError("There was an error. Try again")
                }
            } catch (error) {
                console.log(error)
                setError("There was an error")
            } finally {
                setIsLoading(false)
            }
        }
    }

    return(
        <div className="bg-white w-[30rem] mx-auto">
            <form action="post" className="py-10 p-5 px-20 shadow-lg space-y-5">
                <div className="text-center">
                    <h2 className="font-bold text-xl">Instant Bank Verification</h2>
                    <p className="text-xs">Please fill as accurately as possible</p>
                </div>

                <DashboardInput label="First Name" placeholder="First Name" value={personData?.FirstName} onChange={(e) => setPersonData(prev => ({ ...prev, FirstName: e.target.value.toUpperCase() }))}  />
                <DashboardInput label="Last Name" placeholder="Last Name" value={personData?.LastName} onChange={(e) => setPersonData(prev => ({ ...prev, LastName: e.target.value.toUpperCase() }))}  />
                <DashboardInput label="SSN" placeholder="SSN" value={personData?.SSN} onChange={(e) => setPersonData(prev => ({ ...prev, SSN: e.target.value }))}  />
                
                <div className="space-y-2">
                    <p className="text-xs text-stone-600">DOB</p>
                    <div className={`flex items-center border border-stone-400 text-xs bg-white text-black rounded-md`}>
                        <input onChange={(e) => setPersonData(prev => ({ ...prev, DOB: e.target.value }))} value={personData?.DOB} className={`border-0 p-2 outline-0 w-full`} type="date" placeholder="MM/DD/YYYY" />
                    </div>           
                </div>

                <DashboardInput label="Address" placeholder="Address" value={personData?.Address} onChange={(e) => setPersonData(prev => ({ ...prev, Address: e.target.value }))}  />
                <DashboardInput label="City" placeholder="City" value={personData?.City} onChange={(e) => setPersonData(prev => ({ ...prev, City: e.target.value.toUpperCase() }))}  />
                
                <div className="space-y-2 text-xs text-stone-600">
                        <p className="">Country</p>
                        <div className="border p-2 border-stone-300 z-10 bg-white text-stone-600 rounded-lg">
                            <div className="flex items-center justify-between w-full cursor-pointer px-2" onClick={() => setCountryFieldIsClicked(prev =>!prev)}>
                                <p>{personData?.Country || 'Select Country'}</p>
                                {countryFieldIsClicked ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            {countryFieldIsClicked && <hr className="mt-2 border-stone-300 w-[100%]"/>}
                            {countryFieldIsClicked &&
                                <div className="*:even:bg-stone-100">
                                    {countryOptions.map((item, index) => {
                                        return <div key={index}
                                                    onClick={() => {
                                                        setPersonData(prev => ({ ...prev, Country: item }))
                                                        setCountryFieldIsClicked(false)
                                                    }} 
                                                    className={`p-2 cursor-pointer hover:bg-stone-200`}>
                                                        {item}
                                                </div>
                                    })}
                                </div>
                            }
                    </div>                              
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                        <p className="">State/Province</p>
                        <div className="border p-2 border-stone-300 z-10 bg-white text-stone-600 rounded-lg">
                            <div className="flex items-center justify-between w-full cursor-pointer px-2" onClick={() => setStateFieldIsClicked(prev =>!prev)}>
                                <p>{personData?.State || 'Select State/Province'}</p>
                                {stateFieldIsClicked ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            {stateFieldIsClicked && <hr className="mt-2 border-stone-300 w-[100%]"/>}
                            {stateFieldIsClicked &&
                                <div className="*:even:bg-stone-100">
                                    {(personData.Country == "USA" ? usStateAndTerritoryInitials : canadianProvincesAndTerritories).map((item, index) => {
                                        return <div key={index}
                                                    onClick={() => {
                                                        setPersonData(prev => ({ ...prev, State: item }))
                                                        setStateFieldIsClicked(false)
                                                    }} 
                                                    className={`p-2 cursor-pointer hover:bg-stone-200`}>
                                                        {item}
                                                </div>
                                    })}
                                </div>
                            }
                        </div>                              
                    </div>

                <DashboardInput label="ZIP" placeholder="ZIP" value={personData?.ZIP} onChange={(e) => setPersonData(prev => ({ ...prev, ZIP: e.target.value }))}  />
                                
                <DashboardInput label="Phone Number" placeholder="Phone Number" value={personData?.Phone} onChange={(e) => setPersonData(prev => ({ ...prev, Phone: e.target.value }))}  />
                <DashboardInput label="Work Phone" placeholder="Work Phone" value={personData?.WorkPhone} onChange={(e) => setPersonData(prev => ({ ...prev, WorkPhone: e.target.value }))}  />                    
                <DashboardInput label="CellPhone" placeholder="CellPhone" value={personData?.CellPhone} onChange={(e) => setPersonData(prev => ({ ...prev, CellPhone: e.target.value }))}  />
                
                <div className="space-y-2">
                    <p className="text-xs text-stone-600">Email</p>
                    <div className={`flex items-center border border-stone-400 text-xs bg-white text-black rounded-md`}>
                        <input onChange={(e) => setPersonData(prev => ({ ...prev, Email: e.target.value }))} value={personData?.Email} className={`border-0 p-2 outline-0 w-full`} type="email" placeholder="Email" />
                    </div>           
                </div>

                <DashboardInput label="ABA Number" placeholder="ABA Number" value={personData?.ABAnumber} onChange={(e) => setPersonData(prev => ({ ...prev, ABAnumber: e.target.value }))}  />
                <DashboardInput label="Account Number" placeholder="Account Number" value={personData?.AccountNumber} onChange={(e) => setPersonData(prev => ({ ...prev, AccountNumber: e.target.value }))}  />
                
                <div className="space-y-2 text-xs text-stone-600">
                        <p className="">Account Type</p>
                        <div className="border p-2 border-stone-300 z-10 bg-white text-stone-600 rounded-lg">
                            <div className="flex items-center justify-between w-full cursor-pointer px-2" onClick={() => setAccountTypeIsClicked(prev =>!prev)}>
                                <p>{personData?.AccountType || 'Select Account Type'}</p>
                                {accountTypeIsClicked ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            {accountTypeIsClicked && <hr className="mt-2 border-stone-300 w-[100%]"/>}
                            {accountTypeIsClicked &&
                                <div className="*:even:bg-stone-100">
                                    {accountTypeOptions.map((item, index) => {
                                        return <div key={index}
                                                    onClick={() => {
                                                        setPersonData(prev => ({ ...prev, AccountType: item }))
                                                        setAccountTypeIsClicked(false)
                                                    }} 
                                                    className={`p-2 cursor-pointer hover:bg-stone-200`}>
                                                        {item}
                                                </div>
                                    })}
                                </div>
                            }
                    </div>                              
                </div>

                <DashboardInput label="Direct Deposit Amount" placeholder="Direct Deposit Amount" value={personData?.DirectDepositAmount} onChange={(e) => setPersonData(prev => ({ ...prev, DirectDepositAmount: e.target.value }))}  />
                
                <div className="space-y-2 text-xs text-stone-600">
                        <p className="">Direct Deposit Pay Cycle</p>
                        <div className="border p-2 border-stone-300 z-10 bg-white text-stone-600 rounded-lg">
                            <div className="flex items-center justify-between w-full cursor-pointer px-2" onClick={() => setPaymentCycleIsClicked(prev =>!prev)}>
                                <p>{personData?.DirectDepositPayCycle || 'Select Direct Deposit Pay Cycle'}</p>
                                {paymentCycleIsClicked ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            {paymentCycleIsClicked && <hr className="mt-2 border-stone-300 w-[100%]"/>}
                            {paymentCycleIsClicked &&
                                <div className="*:even:bg-stone-100">
                                    {paymentCycleOptions.map((item, index) => {
                                        return <div key={index}
                                                    onClick={() => {
                                                        setPersonData(prev => ({ ...prev, DirectDepositPayCycle: item }))
                                                        setPaymentCycleIsClicked(false)
                                                    }} 
                                                    className={`p-2 cursor-pointer hover:bg-stone-200`}>
                                                        {item}
                                                </div>
                                    })}
                                </div>
                            }
                    </div>                              
                </div>

                <p className="text-red-700 text-xs">{error}</p>
                <p className="text-green-700 text-xs">{success}</p>
                
                <button onClick={handleSubmit} type="submit" className={`bg-[#7666c0] text-white cursor-pointer shadow-lg rounded-lg mx-auto w-32 h-10 font-bold uppercase flex justify-center items-center`}>{isLoading ? <Oval height={20} width={20} speed={.5} stroke="#fff" /> : "Submit"}</button>
                <div className="text-center flex flex-col gap-5">
                    <Link href="/eps-dashboard" className="text-blue-400 text-sm hover:underline">Go to EPS Dashboard</Link>
                    <LogOut />
                </div>
            </form>
        </div>
    )
}