
function Activity({title, description, time, state}) {
  return (
    <div className="p-4 border border-[#271c1c] rounded-lg w-[98%] mx-auto
     bg-[#0d1327] flex justify-between">
        <div className={`px-2 py-2 -mr-80 rounded-full w-1 h-1 ${state === "warning" ? "bg-[#ffaa01]" : state === "info" ? "bg-[#06ff38]" : "bg-[#ff3007]"}`}></div>
      <div className="">
        <h3 className="font-medium text-[#f3eded]">{title}</h3>
        <p className="text-sm text-[#888383] mt-1">{description}</p>
      </div>
      <div className="flex">
        <div className={`rounded-full mb-2 mr-3 ${state === "warning" ? "bg-[#3b2d0f]" : state === "info" ? "bg-[#0f2715]" : "bg-[#2c1f1d]"}`}>
      <div className={`px-4 pt-1  ${state === "warning" ? "text-[#eda616]" : state === "info" ? "text-[#0b8a24]" : "text-[#e14020]"}`}>
          {state}
        </div></div>
      <p className="text-xs text-base-content/100 mt-1">{time}</p>
      </div>
    </div>
  )
}

export default Activity