"use server"

import { Resend } from "resend"
import { EmailTemplate } from "./email-template"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendIBVEmail = async (email: string, url: string, name?: string ) => {
    try {
        const { data, error } = await resend.emails.send({
            to: email,
            from: "NoReply - IBV URL <customerservice@merchlyach.com>",
            subject: "Your Instant Bank Verification (IBV) Link",
            react: await EmailTemplate({name, url})
        })

        if (error) {
            console.log("email error:", error)
        }
        
        return {data, error}        
    } catch (error) {
        console.log(error)
    }
}