import React, { useState } from "react";
import { authentication } from "../../store/zustant/useZustandHook";

const INITIAL_FORM = {
  agentId: "",
  hederaAccountId: "",
  hederaPublicKey: "",
  kmsKeyId: "",
  taskType: "execution",
  action: "swap_tokens",
  fromToken: "",
  toToken: "",
  amount: "",
  slippageTolerance: "",
  userWallet: "",
};

function HederaAgentFormModal({ isOpen, onClose, agents }) {
  const { registerTask } = authentication();
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "slippageTolerance"
          ? value === "" // allow clearing the field
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      agentId: form.agentId,
      taskType: form.taskType,
      inputPayload: {
        action: form.action,
        fromToken: form.fromToken,
        toToken: form.toToken,
        amount: form.amount,
        slippageTolerance: form.slippageTolerance,
        userWallet: form.userWallet,
      },
    };

    try {
      await registerTask(payload);
      setForm(INITIAL_FORM);
      onClose();
    } catch (err) {
      console.error("Failed to register Hedera task:", err);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-lg bg-[#04020f] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Hedera Agent Settings</h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agent */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Agent</span>
            </label>
            <select
              name="agentId"
              value={form.agentId}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>
                Select agent
              </option>
              {agents?.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.agent_name ?? agent.id}
                </option>
              ))}
            </select>
          </div>

          {/* Hedera account ID */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Hedera account ID</span>
            </label>
            <input
              type="text"
              name="hederaAccountId"
              value={form.hederaAccountId}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="0.0.123456"
              required
            />
          </div>

          {/* Hedera public key */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Hedera public key</span>
            </label>
            <input
              type="text"
              name="hederaPublicKey"
              value={form.hederaPublicKey}
              onChange={handleChange}
              className="input input-bordered w-full font-mono text-sm"
              placeholder="Public key"
              required
            />
          </div>

          {/* KMS key ID */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">KMS key ID</span>
            </label>
            <input
              type="text"
              name="kmsKeyId"
              value={form.kmsKeyId}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="KMS key identifier"
              required
            />
          </div>

          {/* Task payload */}
          <div className="divider">Task Payload</div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Task type</span>
            </label>
            <select
              name="taskType"
              value={form.taskType}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="execution">execution</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Action</span>
            </label>
            <input
              type="text"
              name="action"
              value={form.action}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="swap_tokens"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">From token</span>
              </label>
              <input
                type="text"
                name="fromToken"
                value={form.fromToken}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">To token</span>
              </label>
              <input
                type="text"
                name="toToken"
                value={form.toToken}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="input input-bordered w-full"
                min={0}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Slippage tolerance (%)</span>
              </label>
              <input
                type="number"
                name="slippageTolerance"
                value={form.slippageTolerance}
                onChange={handleChange}
                className="input input-bordered w-full"
                step="0.1"
                min={0}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">User wallet (Hedera ID)</span>
            </label>
            <input
              type="text"
              name="userWallet"
              value={form.userWallet}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="0.0.7148109"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HederaAgentFormModal;
