import { ClipboardList, LogOut, Wrench } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useUserAuth } from "../context/authenticationcontext";
import logo from "../assets/logomain.png";

const navigationClassName =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950";

export default function Navbar() {
  const { user, Logout } = useUserAuth();
  const navigate = useNavigate();

  async function LogoutFlow() {
    await Logout();

    navigate("/login", {
      state: { message: "Successfully logged out." },
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-18 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="RepairLah home">
          <img src={logo} alt="RepairLah" className="h-11 w-11 object-contain" />
          <div>
            <p className="text-lg font-bold leading-none tracking-tight text-slate-950">
              Repair<span className="text-emerald-700">Lah!</span>
            </p>
            <p className="mt-1 hidden text-[11px] font-medium text-slate-400 sm:block">
              TV repair made simple
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Link to="/" className={navigationClassName}>
            Home
          </Link>

          {user?.customertype === "customer" && (
            <Link to="/check-status" className={navigationClassName}>
              Check status
            </Link>
          )}

          {user?.customertype === "technician" && (
            <Link to="/technicianpage" className={navigationClassName}>
              Check jobs
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className={navigationClassName}>
                Log in
              </Link>
              <Link
                to="/register"
                className="ml-1 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Get started
              </Link>
            </>
          )}

          {user && (
            <>
              <div className="mx-1 hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
                  {user.customertype === "technician" ? (
                    <Wrench size={15} />
                  ) : (
                    <ClipboardList size={15} />
                  )}
                </div>
                <div className="max-w-40">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    {user.name || user.email}
                  </p>
                  <p className="truncate text-[11px] capitalize text-slate-500">
                    {user.customertype}
                  </p>
                </div>
              </div>

              <button
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                onClick={LogoutFlow}
                type="button"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
