import { useState } from "react";
import { authentication } from "../../store/zustant/useZustandHook";
import { Loading } from "../loading/Loading";

function NewAgentPopUp({ onClose, onSubmit }) {
  const { registerAgent, getUserAgents,loading}= authentication();
  const [form, setForm] = useState({
    agentName: "",
    agent_name: "",
    description: "",
    agentType: "",
    walletAddress: "",
    public_key: "",
    apiEndpoint: "",
    metadata: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  async function handleSubmit (e)  {
    e.preventDefault();

    const payload = {
      agentName: form.agentName,
      agent_name: form.agent_name,
      description: form.description,
      agentType: form.agentType,
      walletAddress: form.walletAddress,
      public_key: form.public_key,
      apiEndpoint: form.apiEndpoint,
      metadata: form.metadata,
    };
await registerAgent(payload);
await getUserAgents();
onClose(true);
    onSubmit?.(payload);
  };
if(loading) return <Loading/>;
  return (
    <form className="space-y-4 h-full bg-[#140758]/60" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-2">Register New Agent</h2>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-sm">Name</span>
        </label>
        <input
          type="text"
          className="input bg-[#140758]/60 input-bordered w-full :focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Agent Name"
          value={form.agentName}
          onChange={handleChange("agentName")}
        />
      </div>

      <div className="form-control mt-2">
        <label className="label">
          <span className="label-text text-sm">Agent Name (snake_case)</span>
        </label>
        <input
          type="text"
          className="input bg-[#140758]/60 input-bordered w-full :focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="agent_name"
          value={form.agent_name}
          onChange={handleChange("agent_name")}
        />
      </div>

      <div className="form-control mt-2">
        <label className="label">
          <span className="label-text text-sm">Description</span>
        </label>
        <textarea
          className="textarea bg-[#140758]/60 textarea-bordered w-full mt-2 :focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Detailed description of the agent's purpose and capabilities"
          value={form.description}
          onChange={handleChange("description")}
        />
      </div>

      <div className="form-control mt-2">
        <label className="label">
          <span className="label-text text-sm">Agent Type</span>
        </label>
        <select
          className="select mt-2 bg-[#140758]/80 select-bordered w-full :focus:ring-2 focus:ring-primary focus:outline-none"
          value={form.agentType}
          onChange={handleChange("agentType")}
        >
          <option value="" disabled>
            Select agent type
          </option>
          <option>Trading Bot</option>
          <option>Defi Agent</option>
          <option>NFT Agent</option>
          <option>Government Agent</option>
          <option>Analytics Agent</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-control mt-2">
        <label className="label">
          <span className="label-text text-sm">Wallet Address</span>
        </label>
        <input
          type="text"
          className="input bg-[#140758]/60 mt-2 input-bordered w-full :focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Wallet Address (e.g. 0x1234...abcd)"
          value={form.walletAddress}
          onChange={handleChange("walletAddress")}
        />
      </div>

      <div className="form-control mt-2">
        <label className="label">
          <span className="label-text text-sm">Public Key</span>
        </label>
        <input
          type="text"
          className="input bg-[#140758]/60 mt-2 input-bordered w-full :focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Public key (e.g. 0xadffbc...)"
          value={form.public_key}
          onChange={handleChange("public_key")}
        />
      </div>

      <div className="form-control mt-2">
        <label className="label">
          <span className="label-text text-sm">API Endpoint</span>
        </label>
        <input
          type="text"
          className="input bg-[#140758]/60 mt-2 input-bordered w-full :focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="API Endpoint (e.g. https://api.example.com/agent)"
          value={form.apiEndpoint}
          onChange={handleChange("apiEndpoint")}
        />
      </div>

      <div className="form-control mt-2">
        <label className="label">
          <span className="label-text text-sm">Metadata (JSON)</span>
        </label>
        <textarea
          rows={3}
          cols={30}
          className="textarea bg-[#140758]/60 textarea-bordered w-full mt-2 :focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder={`Metadata in JSON format (e.g. {"key":"value"})`}
          value={form.metadata}
          onChange={handleChange("metadata")}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="btn btn-ghost btn-sm bg-white rounded-lg px-4 py-2 ml-2 text-base-content/80 hover:bg-white/20"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary rounded-lg px-4 py-2 ml-3 text-white bg-[#034eef] btn-sm hover:bg-[#0000FF]/80"
        >
          Register Agent
        </button>
      </div>
    </form>
  );
}

export default NewAgentPopUp;
