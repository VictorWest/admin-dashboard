"use client"
import { redirect } from "next/navigation";
import { PDFReport } from "../components/pdf-report";
import { useReportContext } from "../context/ReportContext";

export default function VerificationReportPage() {
    const { data } = useReportContext()

    if (!data){
        redirect("/eps-dashboard")
    }
  
    return <PDFReport data={data} />;
}