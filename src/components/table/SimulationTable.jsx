import React from "react";


function SimulationTable(agents) {


  
  return (
    <table className="min-w-full border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-3 py-2 text-left">Agent Name</th>
          <th className="border px-3 py-2 text-left">Scenario</th>
          <th className="border px-3 py-2 text-left">Risk Score</th>
          <th className="border px-3 py-2 text-left">Vulnerabilities</th>
          <th className="border px-3 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent) => (
          <tr key={agent.id}>
            <td className="border px-3 py-2">{agent.agentName}</td>
            <td className="border px-3 py-2">{agent.scenario}</td>
            <td className="border px-3 py-2">{agent.riskScore}</td>
            <td className="border px-3 py-2">{agent.vulnerabilities}</td>
            <td className="border px-3 py-2 capitalize">{agent.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SimulationTable;
