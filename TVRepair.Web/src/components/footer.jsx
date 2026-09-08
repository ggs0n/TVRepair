import { ShieldCheck } from "lucide-react";
import logo from "../assets/logomain.png";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-7 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-8 w-8 object-contain opacity-80" />
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} RepairLah Malaysia. All rights reserved.
          </p>
        </div>

        <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <ShieldCheck size={16} className="text-emerald-700" />
          Secure repair requests and payments
        </p>
      </div>
    </footer>
  );
}
