import { BanknoteIcon, Bot, FileWarningIcon, LucideTestTube, MailWarning, MonitorCheck, Shield, TestTube, TestTube2Icon } from "lucide-react";
import React from "react";
function Card({ label, value, deltaText }) {

const [shadowStyle, setShadowStyle] = React.useState("");

  function addTextShadow(t) {
   
    
    setShadowStyle(`border border-blue-300 border-2xl `);
  }
  function SetIcon(){
    if(label === "Total Agents"){
      return <Bot className="text-primary" size={24} />
    }else if(label === "Verified Agents"){
      return <Shield className="text-primary" size={24} />
    }else if(label === "Active Simulations"){
      return <LucideTestTube className="text-primary" size={24} />
    }else if(label === "Vulnerabilities Detected"){
      return <MonitorCheck className="text-primary" size={24} />
    }else if(label === "Transactions Executed"){
      return <BanknoteIcon className="text-primary" size={24} />
    }
  }
  return (
   <div
            key={label}
            className={`card bg-[#0B1020]  rounded-[10%] ${shadowStyle ? shadowStyle : ''}`}
         onMouseOver={addTextShadow}
          onMouseOut={() => setShadowStyle("")}
         >
            <div className="card-body py-4 px-4 ">
              <div className="flex gap gap-2">
              <p className="text-xs uppercase tracking-wide text-base-content/60">
                {label}
              </p>
              {SetIcon()}
              </div>
              <p className="text-3xl font-semibold mt-2">{value}</p>
              {deltaText && (
                <p className={`text-xs mt-1 text-green-600`}>{deltaText}
                </p>
              )}
            </div>
          </div>
  )
}

export default Card