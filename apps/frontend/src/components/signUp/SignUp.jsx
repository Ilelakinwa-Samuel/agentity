import signinWithGoogle from "../signinWithGoogle/signinWithGoogle";
import { authentication } from "../../store/zustant/useZustandHook";
import { useNavigate } from "react-router-dom";
import { Loading } from "../loading/Loading";

function SignUp() {
  const { registerUser, dashBoard ,loading} = authentication();
  const navigate = useNavigate();

  async function handleSignUp() {
    try {
      const result = await signinWithGoogle();
      if (!result) {
        return;
      }

      const { email, displayName } = result;

      const user = {
        email,
        password: email,
        name: displayName,
      };

      await registerUser(user);
     
     if (dashBoard)   navigate("/dashboard");
      
    } catch (e) {
      console.error("Error registering user:", e);
    }
  }

  return (
    <button
      onClick={handleSignUp}
      className="btn btn-ghost font-extrabold text-5xl border-none px-8 bg-[#3a05fb]
                 border-base-300 rounded-lg text-white h-9 min-h-0 hover:bg-[#1c0769]"
    >
      <div className="text-xl font-mono">SignUp</div>
    </button>
  );
}

export default SignUp;
