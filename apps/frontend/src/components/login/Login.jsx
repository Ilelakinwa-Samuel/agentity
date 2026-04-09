import { useNavigate } from "react-router-dom";
import { authentication } from "../../store/zustant/useZustandHook";
import signinWithGoogle from "../signinWithGoogle/signinWithGoogle";

function Login() {

  const {loginUser, dashBoard } = authentication();
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const result = await signinWithGoogle();
      if (!result) {
        return;
      }

      const { email} = result;

      const user = {
        email,
        password: email,
      };

      await loginUser(user);


      if (dashBoard) {
        navigate("/dashboard");
      }
     
    } catch (e) {
      console.error("Error registering user:", e);
    }
  }




    
  




  return (
    <button className="btn btn-ghost font-extrabold text-5xl border-none px-8 bg-white
             border-base-300 rounded-lg text-[#3a05fb] h-9 min-h-0 hover:bg-[#f0eff4]  "
             
             onClick={handleLogin}>
                <div className="text-xl font-mono">Login</div>
            </button>
  )
}

export default Login