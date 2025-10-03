import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Form from "./form"

export default async function DashboardPage(){
    const session = await getServerSession()
    if (!session){
        redirect('/login')
    }

    return(
        <div className="md:bg-[#e4defe] md:p-10 text-black">
            <Form />
        </div>
    ) 
}