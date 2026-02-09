import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Leaf, User, Mail, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("${API_URL}/signup", { name, email, password });
      alert(res.data.message);
      if (res.data.success) navigate("/");
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Visual Side - Premium Industrial Aesthetic */}
      <div className="hidden lg:flex w-5/12 bg-[#0f172a] p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 flex items-center gap-2.5 font-bold text-2xl tracking-tight">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            EcoTwin
          </span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> AI-Powered Sustainability
          </div>
          <h1 className="text-7xl font-extrabold leading-[1.1] mb-8 tracking-tighter">
            Design the <br/> 
            <span className="text-emerald-400">Green</span> Era.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md font-light">
            Join the elite circle of environmental pioneers using real-time AI analytics to neutralize carbon footprints.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <div className="text-sm font-medium text-slate-400">
            Join <span className="text-white font-bold">2,400+</span> contributors
          </div>
        </div>
      </div>

      {/* Form Side - Clean Glassmorphism Effect */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-[440px]">
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Create Account</h2>
            {/*<p className="text-slate-500 text-lg">Start your 14-day premium trial today.</p>*/}
            <p className="text-slate-500 text-lg">"Let’s build something great."</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  required
                  autoComplete="name"
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-300"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-300"
                  placeholder="you@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-300"
                  placeholder="Create a strong password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="group w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Create Account 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-6">
            <p className="text-slate-500 font-medium">
              Already have an account? <Link to="/" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors underline-offset-4 hover:underline">Sign in</Link>
            </p>
            
            <div className="h-[1px] w-full bg-slate-100 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                Secure Registration
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;