import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Leaf, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://ecotwin-backend.onrender.com/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Visual Side - Premium Sustainable Tech Aesthetic */}
      <div className="hidden lg:flex w-5/12 bg-[#022c22] p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}>
        </div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 flex items-center gap-2.5 font-bold text-2xl tracking-tight">
          <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="tracking-tighter text-white">EcoTwin</span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Intelligence Suite
          </div>
          <h1 className="text-7xl font-extrabold leading-[1.1] mb-8 tracking-tighter">
            Welcome <br/> 
            <span className="text-emerald-400 text-opacity-90">Back.</span>
          </h1>
          <p className="text-emerald-100/60 text-lg leading-relaxed max-w-md font-light">
            Continue your journey in reducing global emissions with our latest AI-driven insights and carbon-neutral strategies.
          </p>
        </div>

        <div className="relative z-10 text-xs font-medium text-emerald-500/50 uppercase tracking-widest">
          © 2026 EcoTwin Intelligence Platform
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-[420px]">
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Sign In</h2>
            <p className="text-slate-500 text-lg">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-300"
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <button type="button" className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">Forgot Password?</button>
              </div>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-300"
                  placeholder="••••••••"
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
                  Sign In 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-slate-500 font-medium">
              Don't have an account? <Link to="/signup" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors underline-offset-4 hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;