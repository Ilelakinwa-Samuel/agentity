const Agent = require("./agent");
const AgentMetadata = require("./agentMetadata");
const AgentReputation = require("./agentReputation");
const SimulationRun = require("./simulationRun");
const SmartContractAudit = require("./smartContractAudit");

Agent.hasOne(AgentMetadata, { foreignKey: "agent_id", as: "metadata" });
AgentMetadata.belongsTo(Agent, { foreignKey: "agent_id" });

Agent.hasOne(AgentReputation, { foreignKey: "agent_id", as: "reputation" });
AgentReputation.belongsTo(Agent, { foreignKey: "agent_id" });

Agent.hasMany(SimulationRun, { foreignKey: "agent_id", as: "simulations" });
SimulationRun.belongsTo(Agent, { foreignKey: "agent_id", as: "agent" });

module.exports = {
  Agent,
  AgentMetadata,
  AgentReputation,
  SimulationRun,
  SmartContractAudit,
};