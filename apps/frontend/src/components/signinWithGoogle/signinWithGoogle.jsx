import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../fireBaseConfig";
import "firebase/compat/auth";

async function signinWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const cred = await signInWithPopup(auth, provider);

    const email = cred.user?.email ?? "";
    const displayName = cred.user?.displayName ?? "";
     
    console.log({ email, displayName });
         
    // return something the caller can use
    return { email, displayName, user: cred.user };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error; // rethrow so caller can handle
  }
}

export default signinWithGoogle;
