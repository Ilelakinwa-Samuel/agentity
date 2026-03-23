import { Bot, Cross, Plus } from "lucide-react";
import AppLayout from "../layouts/AppLayouts";
import RegisteredAgent from "../components/agent/RegisteredAgent";
import Modal from "../components/model/Modal";
import NewAgentPopUp from "../components/popups/NewAgentPopUp";
import { useEffect, useState } from "react";
import { authentication } from "../store/zustant/useZustandHook";
import formatDate  from "../helper/formatDate";

function AiAgent() {
  const [open, setOpen] = useState(false);
  const { agents, getUserAgents } = authentication();

  useEffect(() => {
    let isMounted = true;

    const fetchAgents = async () => {
      try {
        await getUserAgents();
      } catch (e) {
        console.error("Failed to load agents", e);
      }
    };

    fetchAgents();
    return () => {
      isMounted = false;
    };
  }, [getUserAgents]);

  return (
    <AppLayout>
      <div className="mb-6 p-4 rounded-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">AI Agent</h1>
          <p className="text-sm text-base-content/60 text-white">
            Register and manage AI agents
          </p>
        </div>

        <button
          className="bg-[#06b0ff] btn-sm mt-4 flex px-4 py-2 rounded-lg border-none text-white:hover:bg-[#06b0ff]/90"
          onClick={() => setOpen(true)}
        >
          <Plus className=" mr-2" size={30} />
          <span>Create New Agent</span>
        </button>
      </div>

      <div className="border-[#514c4c] bg-[#0B1020] rounded-lg border">
        <div className="items-center gap-4 p-4 border-b border-[#514c4c]">
          <div className="flex">
            <Bot className="text-primary " size={24} />
            <h2 className="text-xl font-semibold">Registered Agents</h2>
            <span className="text-xl text-[#f5f8f9]">
              ({agents?.length ?? 0})
            </span>
          </div>

          <div>
            <table className="table-auto w-full mt-5">
              <thead>
                <tr className=" py-2 h-10 w-full grid grid-cols-6 hover:bg-[#2f2f2f]">
                  <td className="text-left text-sm text-base-content/60">
                    Agent Name
                  </td>
                  <td className="text-left text-sm text-base-content/60">
                    Type
                  </td>
                  <td className="text-left text-sm text-base-content/60">
                    Reputation
                  </td>
                  <td className="text-left text-sm text-base-content/60">
                    Status
                  </td>
                  <td className="text-left text-sm text-base-content/60">
                    Last Activity
                  </td>
                  <td className="text-left text-sm text-base-content/60">
                    Actions
                  </td>
                </tr>
              </thead>
              <tbody>
                {agents&&(agents.map((agent) => (
                  <RegisteredAgent key={agent.id} id={agent.id} type={"agent"} name={agent.agent_name} 
                    lastActive={formatDate(agent.updatedAt)} status={agent.status}
                    reputation={agent.reputation.score}
                    />
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <NewAgentPopUp onClose={() => setOpen(false)} />
      </Modal>
    </AppLayout>
  );
}

export default AiAgent;
