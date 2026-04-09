import { Box, TestTube } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../progessiveBar/ProgressiveBar'
import { authentication } from '../../store/zustant/useZustandHook';

function RegisteredAgent({ name, status, lastActive, reputation, type , id}) {
  const {verifyAgent,loading} = authentication();

  return (
   <tr className=" py-2 h-10 w-full grid grid-cols-6 hover:bg-[#2f2f2f]">
     <td className="text-left text-sm text-base-content/60">{name}</td>
     <td className="text-left text-sm text-base-content/60">{type}</td>
      <td className="text-left text-sm text-base-content/60 flex"><ProgressBar value={parseInt(reputation)} color="bg-purple-500" /> <span className="ml-2">{reputation}</span></td>
     <td className={`text-left text-sm  flex gap-1 items-center ${status === 'Verified' ? 'text-green-500' : 'text-yellow-500'}`}
     ><Box className="w-4 h-4" /> <span>{status}</span></td>
      <td className="text-left text-sm text-base-content/60">{lastActive}</td>
      <td className="text-left text-sm text-base-content/60 text-[#0847bc]">
        <button className="btn btn-sm btn-outline" onClick={() => verifyAgent(id)}
          disabled={loading}>
          Verify
        </button>
        <button className="btn btn-sm btn-outline ml-2"><Link to="/simulations"><TestTube className="w-4 h-4" /></Link></button>
      </td>
    </tr>
  )
}

export default RegisteredAgent