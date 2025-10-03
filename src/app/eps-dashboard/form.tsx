"use client"

import { FormEvent, useState } from "react"
import DashboardInput from "../components/dashboard-input"
import { usStateAndTerritoryInitials } from "../util/data"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import Oval from "react-loading-icons/dist/esm/components/oval"
import { filterPersonData } from "../util/filter"
import { reportContextUse } from "../context/ReportContext"
import { useRouter } from "next/navigation"
import LogOut from "../components/logout"

export interface PersonData {
    firstName: string,
    lastName: string,
    streetNumber: string,
    streetName: string,
    city: string,
    state: string,
    postalCode: string,
    phone: string,
}

export default function Form(){
    const { setData } = reportContextUse()
    const router = useRouter()

    const [ personData, setPersonData ] = useState<PersonData>({ firstName: '', lastName: '', streetNumber: '', city: '', state: '', streetName: '', postalCode: '', phone: ''})
    const [ stateFieldIsClicked, setStateFieldIsClicked ] = useState(false)
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
                const response = await fetch("/api/eps", {
                    method: "POST", 
                    body: JSON.stringify({ ...personData })
                })

                const data = await response.json()
                if (data.message?.MsgRsHdr?.Status?.StatusDesc == "NOHIT"){
                    setError("PERSON NOT FOUND")
                } else {
                    setSuccess("PERSON FOUND. REDIRECTING YOU TO THE DOWNLOAD PAGE...")
                    const filteredData = filterPersonData(data, personData)
                    setData(filteredData)
                    router.push("/report-page")
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return(
        <div className="bg-white w-[30rem] mx-auto">
            <form action="post" className="py-10 p-5 px-20 shadow-lg space-y-5">
                <div className="text-center">
                    <h2 className="font-bold text-xl">Enhanced People Search</h2>
                    <p className="text-xs">Please fill as accurately as possible</p>
                </div>

                <DashboardInput label="Person's First Name" placeholder="First Name" value={personData?.firstName} onChange={(e) => setPersonData(prev => ({ ...prev, firstName: e.target.value.toUpperCase() }))}  />
                <DashboardInput label="Person's Last Name" placeholder="Last Name" value={personData?.lastName} onChange={(e) => setPersonData(prev => ({ ...prev, lastName: e.target.value.toUpperCase() }))}  />
                <DashboardInput label="Phone Number" placeholder="Phone Number" value={personData?.phone} onChange={(e) => setPersonData(prev => ({ ...prev, phone: e.target.value }))}  />                    
                <DashboardInput label="Street Number" placeholder="Street Number" value={personData?.streetNumber} onChange={(e) => setPersonData(prev => ({ ...prev, streetNumber: e.target.value }))}  />
                <DashboardInput label="Street Name" placeholder="Street Name" value={personData?.streetName} onChange={(e) => setPersonData(prev => ({ ...prev, streetName: e.target.value.toUpperCase() }))}  />
                <DashboardInput label="City" placeholder="City" value={personData?.city} onChange={(e) => setPersonData(prev => ({ ...prev, city: e.target.value.toUpperCase() }))}  />

                <div className="space-y-2 text-xs text-stone-600">
                        <p className="">State/Province</p>
                        <div className="border p-2 border-stone-300 z-10 bg-white text-stone-600 rounded-lg">
                            <div className="flex items-center justify-between w-full cursor-pointer px-2" onClick={() => setStateFieldIsClicked(prev =>!prev)}>
                                <p>{personData?.state || 'Select State/Province'}</p>
                                {stateFieldIsClicked ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            {stateFieldIsClicked && <hr className="mt-2 border-stone-300 w-[100%]"/>}
                            {stateFieldIsClicked &&
                                <div className="*:even:bg-stone-100">
                                    {usStateAndTerritoryInitials.map((item, index) => {
                                        return <div key={index}
                                                    onClick={() => {
                                                        setPersonData(prev => ({ ...prev, state: item }))
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
                <DashboardInput label="Postal Code" placeholder="Postal Code" value={personData?.postalCode} onChange={(e) => setPersonData(prev => ({ ...prev, postalCode: e.target.value }))}  />
                
                <p className="text-red-700 text-xs">{error}</p>
                <p className="text-green-700 text-xs">{success}</p>
                <div className="flex flex-row-reverse items-center justify-between">
                    <button onClick={handleSubmit} type="submit" className={`bg-[#7666c0] text-white cursor-pointer shadow-lg rounded-lg mx-auto w-32 h-10 font-bold uppercase flex justify-center items-center`}>{isLoading ? <Oval height={20} width={20} speed={.5} stroke="#fff" /> : "Submit"}</button>
                    <LogOut />
                </div>
            </form>
        </div>
    )
}