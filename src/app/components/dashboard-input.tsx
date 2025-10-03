import { ChangeEventHandler } from "react";

export default function DashboardInput({ label, className, placeholder, value, onChange, ...props }: { label: string, className?: string, placeholder?: string, value: string, onChange: ChangeEventHandler<HTMLInputElement> }){
    return <div className="space-y-2">
        <p className="text-xs text-stone-600">{label}</p>
        <div className={`flex items-center border border-stone-400 text-xs bg-white text-black rounded-md`}>
            <input onChange={onChange} value={value} className={`border-0 p-2 outline-0 w-full ${className}`} type="text" placeholder={placeholder || "Type something here"} {...props} />
        </div>           
    </div>  
}