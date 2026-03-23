import { useEffect } from "react"
import AgentPlatform from "../components/agentPlatform/AgentPlatform"
import LandingPageAgentWork from "../components/landingPageAgentWork/LandingPageAgentWork"
import LandingPageFooter from "../components/landingPageFooter/LandingPageFooter"
import LandingPageIntro from "../components/landingPageIntro/LandingPageIntro"
import LandingTopbar from "../components/layouts/LandingTopbar"
import { authentication } from "../store/zustant/useZustandHook"
import { Loading } from "../components/loading/Loading"

function LandingPage() {
   const { getDashboard,  loading } = authentication();

  useEffect(() => {
     getDashboard();
  }, []);
   if (loading) return <Loading />;
  return (
    <div>
      <LandingTopbar/>
      <LandingPageIntro/>
      <AgentPlatform/>
      <LandingPageAgentWork/>
      <LandingPageFooter/>

    </div>
  )
}

export default LandingPage