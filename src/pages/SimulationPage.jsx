import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayouts";
import { Loader, Play, TestTube } from "lucide-react";
import SimulationCard from "../components/Card/SimulationCard";
import NoActive from "../components/SimulationState/NoActive";
import Active from "../components/SimulationState/Active";
import { authentication } from "../store/zustant/useZustandHook";

function SimulationPage() {
  const [action, setAction] = useState(""); // selected agent id
  const { agents, getUserAgents } = authentication();

  useEffect(() => {
    async function loadUserAgents() {
      try {
        await getUserAgents();
      } catch (err) {
        console.error("Failed to load user agents:", err);
      }
    }

    loadUserAgents();
  }, [getUserAgents]);

  function handleChange(e) {
    const selected = e.target.value;
    setAction(selected);
   
  }

  const selected = agents?.find((agent) => agent.id === action);


  return (
    <AppLayout>
      <div className="mb-6 rounded-lg p-4">
        <h1 className="mb-1 text-3xl font-bold">Simulation Sandbox</h1>
        <p className="text-sm text-base-content/60 text-white">
          Test AI agents in containerized scenarios
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Simulation Controls */}
        <div className="card col-span-1 border border-[#514c4c] bg-base-200">
          <div className="card-body flex gap-2">
            <TestTube className="my-2 mr-2 h-5 w-5 text-[#0d59a5]" />
            <h2 className="card-title my-2">Configure Simulation</h2>
          </div>

          <form className="card-body">
            <div className="card-body">
              <select
                className="select mt-4 mb-4 w-[30] max-w-xs bg-[#1c1b24] py-2 focus:border-none"
                onChange={handleChange}
                value={action}
              >
                <option value="" disabled>
                  Select agent
                </option>
                {agents?.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.agent_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="card-body">
              <select className="select mt-8 mb-4 w-[96%] max-w-xs bg-[#1c1b24] py-2 focus:border-none">
                <option>Token Swap</option>
                <option>NFT Mint</option>
                <option>Liquidity Pool</option>
                <option>Contact Deployment</option>
                <option>Multi-Sig Transaction</option>
                <option>Cross Chain Bridge</option>
              </select>
            </div>

            <div>
              <SimulationCard action={action} status={selected?.status} />
            </div>

            <div>
              <button className="btn btn-primary mt-4 flex w-full items-center justify-center bg-[#1087e7] px-2 py-1 hover:bg-[#0d78c9]">
                <Play className="mr-2 h-6 w-6" />
                <span>Run Simulation</span>
              </button>
            </div>
          </form>
        </div>

        {/* Simulation View */}
        <div className="card col-span-2 rounded-lg border border-[#514c4c] bg-base-200">
          <div className="card-body">
            <Active />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default SimulationPage;
