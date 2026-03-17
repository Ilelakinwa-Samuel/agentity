import { create } from "zustand";
import api from "../axios/axiosInitaition";
import toast from "react-hot-toast";

export const authentication = create((set) => ({
  dashBoard: null,
  loading: false,
  error: null,
  agents: [],
  agentDetails: null,
  smartContracts: [],
  user: null,
  audit:[],
  tasksHistory: [],

  registerUser: async (payload) => {
    try {
      set({ loading: true, error: null });

      const res = await api.post("/auth/register", payload);

      if (!res || res.status < 200 || res.status >= 300) {
        alert("Registration failed, please try again");
        set({ loading: false });
        return;
      }

      const { jwt, dashboard, email, name } = res.data;

      set({
        dashBoard: dashboard,
        user: { email, name },
        loading: false,
      });
      toast.success("Registration successful!", { id: "register" });
      // TODO: optionally persist jwt (localStorage / cookie)
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message ?? "Failed to register user",
      });
      toast.error("Registration failed, please try again", { id: "register" });
    }
  },

  loginUser: async (payload) => {
    try {
      set({ loading: true, error: null });

      const res = await api.post("/auth/login", payload);


      if (!res || res.status < 200 || res.status >= 300) {
        toast.error("Login failed, please try again");
        set({ loading: false });
        return;
      }

      const { jwt, dashboard, email, name } = res.data;

      set({
        dashBoard: dashboard,
        user: { email, name },
        loading: false,
      });
      toast.success("Login successful!", { id: "login" });

  
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message ?? "Failed to login user",
      });
      toast.error("Login failed, please try again", { id: "login" });
    }
  },

  getDashboard: async () => {
    try {
      set({ loading: true, error: null });

      const res = await api.get("/dashboard/overview");

      set({ dashBoard: res.data, loading: false });

      toast.success("Dashboard data loaded!", { id: "load-dashboard" });

    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ?? "Failed to get dashboard data",
      });
    
    }
  },

  getUserAgents: async () => {
    try {
      set({ loading: true, error: null });

      const res = await api.get("/agents/my");

      set({ agents: res.data.agents, loading: false });
  toast.success("Agents loaded!", { id: "load-agents" });
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message ?? "Failed to get user agents",
      });
      toast.error("Failed to load agents", { id: "load-agents" });
    }
  },
signOut: async () => {
    try {
      set({ loading: true, error: null });

      await api.post("/auth/logout");

      set({ dashBoard: null, user: null, loading: false });
      toast.success("Logged out successfully!", { id: "logout" });
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message ?? "Failed to logout",
      });
      toast.error("Logout failed, please try again", { id: "logout" });
    }
  },
  registerAgent: async (payload) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post("/agents/register", payload);

      if (!res || res.status < 200 || res.status >= 300) {
        alert("Agent registration failed, please try again");
        set({ loading: false });
        return;
      }
     toast.success("Agent registered!", { id: "register-agent" });
      set({ loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message ?? "Failed to register agent",
      });
      toast.error("Failed to register agent", { id: "register-agent" });
    }},
    getAudit: async () => {
      try {
        set({ loading: true, error: null });
        const res = await api.get(`/audits/history`);

        if (!res || res.status < 200 || res.status >= 300) {
          toast.error("Failed to load audit, please try again", { id: "load-audit" });
          set({ loading: false });
          return;
        }
       toast.success("Audit loaded!", { id: "load-audit" });
        set({ loading: false, audit: res.data });
      } catch (err) {
        set({
          loading: false,
          error: err?.response?.data?.message ?? "Failed to load audit",
        });
        toast.error("Failed to load audit", { id: "load-audit" });
      }
    },
    registerContract: async (payload) => {
      try {
        set({ loading: true, error: null });
        const res = await api.post("/audits", payload);

        if (!res || res.status < 200 || res.status >= 300) {
          toast.error("Contract registration failed, please try again", { id: "register-contract" });
          set({ loading: false });
          return;
        }
       toast.success("Contract registered!", { id: "register-contract" });
        set({ loading: false });
      } catch (err) {
        set({
          loading: false,
          error: err?.response?.data?.message ?? "Failed to register contract",
        });
        toast.error("Failed to register contract", { id: "register-contract" });
      }
    },
    verifyAgent:async (agentId) => {
      try {
        set({ loading: true, error: null });
        const res = await api.post(`/agents/${agentId}/verify`);

        if (!res || res.status < 200 || res.status >= 300) {
          toast.error("Agent verification failed, please try again", { id: "verify-agent" });
          console.error("Verification failed response:", res);
          set({ loading: false });
          return;
        }
        consaole.log("Verification successful response:", res);
       toast.success("Agent verified!", { id: "verify-agent" });
        set({ loading: false });
      } catch (err) {
        set({
          loading: false,
          error: err?.response?.data?.message ?? "Failed to verify agent",
        });
        toast.error("Failed to verify agent", { id: "verify-agent" });
      }},
      linkWallet: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await api.post("/wallets/link", payload);

          if (!res || res.status < 200 || res.status >= 300) {
            toast.error("Wallet linking failed, please try again", { id: "link-wallet" });
            set({ loading: false });
            return;
          }
         toast.success("Wallet linked!", { id: "link-wallet" });
          set({ loading: false });
        } catch (err) {
          set({
            loading: false,
            error: err?.response?.data?.message ?? "Failed to link wallet",
          });
          toast.error("Failed to link wallet", { id: "link-wallet" });
        }
      },
      getTasksHistory: async () => {
        try {
          set({ loading: true, error: null });
          const res = await api.get("/tasks/history");

          if (!res || res.status < 200 || res.status >= 300) {
            toast.error("Failed to load tasks history, please try again", { id: "load-tasks-history" });
            set({ loading: false ,});
            return;
          }
         toast.success("Tasks history loaded!", { id: "load-tasks-history" });
          set({ loading: false, tasksHistory: res.data });
        } catch (err) {
          set({
            loading: false,
            error: err?.response?.data?.message ?? "Failed to load tasks history",
          });
          toast.error("Failed to load tasks history", { id: "load-tasks-history" });
        }
      }


}));
