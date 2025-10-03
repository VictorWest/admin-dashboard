import { ChangeEventHandler } from "react";

export default function Input({ type, placeholder, onChange, icon } : { type: string, placeholder: string, onChange: ChangeEventHandler<HTMLInputElement>, icon?: React.ReactNode }){
    return (
        <div className="flex items-center gap-3 border-[1.3] border-white text-white p-2 w-72 rounded-sm">
            <span>{icon}</span>
            <input className="outline-0" type={type} placeholder={placeholder} onChange={onChange} />
        </div>
    )
    
}