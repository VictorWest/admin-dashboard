"use client"
import { redirect } from "next/navigation";
import { PDFReport } from "../components/pdf-report";
import { reportContextUse } from "../context/ReportContext";

export default function VerificationReportPage() {
    const { data } = reportContextUse()

    if (!data){
        redirect("/eps-dashboard")
    }
  
    return <PDFReport data={data} />;
}