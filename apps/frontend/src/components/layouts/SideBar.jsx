import { Link, NavLink } from "react-router-dom";
import navItems from "../../constants/navItem";
import logo from "../../assets/Agentity-logo.png"
function Sidebar() {
  return (
    <div className="flex-1 h-300 fixed flex flex-col border-[#514c4c]  bg-[#0B1020]">
      {/* Logo */}
      <Link to={"/"} >
      <div className="h-16 flex items-center px-4 gap-2 border-b border-[#514c4c]">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-xl text-primary-content">
            <img src={logo} alt="ahentity logo"/>
          </span>
        </div>
        <span className="font-semibold text-lg">Agentity</span>
      </div>
</Link>
      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-2 text-sm cursor-pointer rounded-lg transition-colors",
                "hover:bg-base-300",
                isActive ? "bg-base-300 text-primary font-medium" : "text-base-content/80",
              ].join(" ")
            }>

           
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
