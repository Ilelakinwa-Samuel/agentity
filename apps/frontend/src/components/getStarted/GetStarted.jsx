import SignUp from "../signUp/SignUp"

function GetStarted() {
  return (
   <div className="flex flex-col items-center justify-center h-80 bg-[#01071f] text-white rounded-lg p-10">
    <h1 className="text-4xl font-bold mb-4">Welcome to Agentity</h1>
    <p className="text-lg mb-8 text-center max-w-xl">
      Your all-in-one solution for secure and efficient smart contract
       auditing on the Avalanche blockchain. Get started in three simple steps.</p>
      <SignUp/>
  </div>
  )
}

export default GetStarted