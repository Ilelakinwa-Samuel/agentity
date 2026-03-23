import {  useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayouts";
import { Play, TestTube } from "lucide-react";
import SimulationCard from "../components/Card/SimulationCard";
import Active from "../components/SimulationState/Active";
import { authentication } from "../store/zustant/useZustandHook";
import SimulationTable from "../components/table/SimulationTable.jsx";

function SimulationPage() {
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [scenario, setScenario] = useState("Token Swap");

  const agents = authentication((state) => state.agents);
  const getUserAgents = authentication((state) => state.getUserAgents);
  const runSimulation = authentication((state) => state.runSimulation);
  const simulations = authentication((state) => state.simulations);
const {getSimulations} = authentication();
  useEffect(() => {
    const loadUserAgents = async () => {
      try {
        await getUserAgents();
      } catch (err) {
        console.error("Failed to load user agents:", err);
      }
    };

    loadUserAgents();
  }, [getUserAgents]);
  useEffect(() => {
    const loadSimulations = async () => {
      try {
        await getSimulations();
      } catch (err) {
        console.error("Failed to load simulations:", err);
      }
    };

    loadSimulations();
  }, [getSimulations]);

  const handleAgentChange = (e) => {
    const value = e.target.value;
    setSelectedAgentId(value);
  };

  const handleRunSimulation = async () => {
    if (!selectedAgentId) return;

    try {
      await runSimulation({
        agentId: selectedAgentId,
        scenarioType: scenario,
      });
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  const selectedAgent = agents?.find(
    (agent) => String(agent.id) === String(selectedAgentId)
  );

  return (
    <AppLayout>
      <div className="mb-6 rounded-lg p-4">
        <h1 className="mb-1 text-3xl font-bold">Simulation Sandbox</h1>
        <p className="text-sm text-white/60">
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
                className="select mt-4 mb-4 w-full max-w-xs bg-[#1c1b24] py-2 focus:outline-none"
                onChange={handleAgentChange}
                value={selectedAgentId}
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
              <select
                className="select mt-8 mb-4 w-full max-w-xs bg-[#1c1b24] py-2 focus:outline-none"
                onChange={(e) => setScenario(e.target.value)}
                value={scenario}
              >
                <option>Token Swap</option>
                <option>NFT Mint</option>
                <option>Liquidity Pool</option>
                <option>Oracle Query</option>
                <option>Yield Farming</option>
                <option>Governance Vote</option>
              </select>
            </div>

            <div>
              <SimulationCard
                action={selectedAgentId}
                status={selectedAgent?.status}
              />
            </div>

            <div>
              <button
                type="button"
                className="btn btn-primary mt-4 flex w-full items-center justify-center bg-[#1087e7] px-2 py-1 hover:bg-[#0d78c9]"
                onClick={handleRunSimulation}
                disabled={!selectedAgentId || selectedAgent?.status === "running"}
              >
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
        <div>
        {simulations&&(simulations.map((sim) => (
        <SimulationTable key={sim.id} agent={sim} />
      )))}
        </div>
      </div>
    </AppLayout>
  );
}

export default SimulationPage;
