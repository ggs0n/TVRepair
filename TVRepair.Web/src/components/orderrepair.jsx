import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  BadgeDollarSign,
  Camera,
  CheckCircle2,
  Clock3,
  Headphones,
  MonitorCog,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useUserAuth } from "../context/authenticationcontext";
import { apiUrl } from "../config/api";
import tvPicture from "../assets/tvpicturemainpage.png";
import "./orderrepair.css";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure & safe",
    description: "Your repair details stay protected.",
  },
  {
    icon: Clock3,
    title: "Live updates",
    description: "Follow every stage of your repair.",
  },
  {
    icon: BadgeDollarSign,
    title: "Clear pricing",
    description: "Approve the quotation before paying.",
  },
  {
    icon: Headphones,
    title: "Local support",
    description: "Get help whenever you need it.",
  },
];

export default function OrderRepair() {
  const [brand, setBrand] = useState("Samsung");
  const [area, setArea] = useState("Kuala Lumpur");
  const [issuedescription, setIssueDesc] = useState("");
  const [photo, setPhoto] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { user } = useUserAuth();
  const navigate = useNavigate();

  async function SaveData(event) {
    event.preventDefault();

    if (!user) {
      navigate("/login", {
        state: { message: "Please log in to submit a repair request." },
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const formData = new FormData();
    formData.set("UserName", user.email);
    formData.set("Brand", brand);
    formData.set("Area", area);
    formData.set("IssueDescription", issuedescription);
    formData.set("CustomerId", user.id);

    if (photo) {
      formData.set("Photo", photo);
    }

    try {
      const response = await fetch(
        apiUrl("/api/TVRepair/AddRepairOrder"),
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit your repair request.");
      }

      if (!result.data?.id) {
        throw new Error("The order was created, but no order ID was returned.");
      }

      navigate(`/check-status?orderId=${result.data.id}`);
    } catch (error) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="home-page">
      <section className="mx-auto w-full max-w-[1500px] sm:px-6 lg:px-8 lg:py-12">
        <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.35)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex min-h-[590px] flex-col overflow-hidden bg-emerald-950 px-7 py-9 text-white sm:px-10 sm:py-12 lg:px-12">
            <div className="hero-glow" aria-hidden="true" />
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <CheckCircle2 size={15} />
                Fast. Easy. Reliable.
              </div>

              <h1 className="max-w-lg text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
                TV trouble? We’ll take it from here.
              </h1>

              <p className="mt-5 max-w-lg text-emerald-50/75 sm:text-lg">
                Tell us what happened and we’ll connect you with a trusted local
                technician. Track the whole repair from one simple place.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-emerald-50/90">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-300" />
                  Quick technician matching
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-300" />
                  Quote before payment
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-10">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl">
                <img
                  src={tvPicture}
                  alt="Television ready for repair"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
            <form className="w-full" onSubmit={SaveData}>
              <div className="mb-8 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <MonitorCog size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Repair request
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    What’s wrong with your TV?
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Share a few details. It usually takes less than two minutes.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  TV brand
                  <select
                    className={fieldClassName}
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                  >
                    <option value="Samsung">Samsung</option>
                    <option value="Sony">Sony</option>
                    <option value="Hitachi">Hitachi</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Lenovo">Lenovo</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  What issue are you experiencing?
                  <textarea
                    className={`${fieldClassName} min-h-28 resize-y`}
                    value={issuedescription}
                    onChange={(event) => setIssueDesc(event.target.value)}
                    placeholder="For example: the screen has sound but no picture"
                    required
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Service area
                  <select
                    className={fieldClassName}
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                  >
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                    <option value="Johor">Johor</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Cyberjaya">Cyberjaya</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Add a photo <span className="font-normal text-slate-400">(optional)</span>
                  <span className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-emerald-400 hover:bg-emerald-50/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                      {photo ? <Camera size={19} /> : <Upload size={19} />}
                    </span>
                    <span className="min-w-0 text-sm font-normal text-slate-500">
                      <span className="block truncate font-medium text-slate-700">
                        {photo ? photo.name : "Choose a photo of the issue"}
                      </span>
                      JPG, PNG or WEBP
                    </span>
                    <input
                      className="sr-only"
                      name="Photo"
                      type="file"
                      accept="image/*"
                      onChange={(event) => setPhoto(event.target.files[0])}
                    />
                  </span>
                </label>
              </div>

              {submitError && (
                <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {submitError}
                </p>
              )}

              <button
                className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-65"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting request..." : "Submit repair request"}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
                <ShieldCheck size={15} />
                No payment is required to submit a request.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
