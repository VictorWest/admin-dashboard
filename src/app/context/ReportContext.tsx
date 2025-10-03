"use client"
import { createContext, useContext, useState } from "react";
import { PDFReportProps } from "../components/pdf-report";

const ReportContext = createContext<any>(null)

export const ReportProvider = ({ children }: any) => {
    const [ data, setData ] = useState<PDFReportProps>()

    return(
        <ReportContext.Provider value={{ data, setData }}>
            { children }
        </ReportContext.Provider>
    )
}

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
}