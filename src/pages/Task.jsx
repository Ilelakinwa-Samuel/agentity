import  { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AppLayout from "../layouts/AppLayouts";
import { authentication } from "../store/zustant/useZustandHook";
import HederaAgentFormModal from "../components/popups/HederaAgentFormModal";

function Task() {
  const [open, setOpen] = useState(false);
  const {agents,getUserAgents} = authentication();

  useEffect(() => {
      try {
       getUserAgents();
      } catch (e) {
        console.error("Failed to load agents", e);
      }
    }, [getUserAgents]);

  
  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between rounded-lg p-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Smart Contract Audits</h1>
          <p className="text-sm text-base-content/60 text-white">
            Automated security analysis for smart contracts
          </p>
        </div>

        <button
          className="btn-sm mt-4 flex items-center rounded-lg border-none bg-[#06b0ff] px-4 py-2 text-white hover:bg-[#06b0ff]/90"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2" size={20} />
          <span>Add Task </span>
        </button>

        < HederaAgentFormModal
          isOpen={open}
          onClose={() => setOpen(false)}
          agents={agents}
        />
      </div>
    </AppLayout>
  );
}

export default Task;
