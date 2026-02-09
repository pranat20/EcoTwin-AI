import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  LogOut,
  BarChart3,
  Brain,
  Globe,
  Zap,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";

// LOCAL IMAGES - Kept exactly as provided
import heroImg from "../assets/images/hero-india-solar.jpg";
import metroImg from "../assets/images/india-metro.jpg";
import evImg from "../assets/images/india-ev.jpg";
import cityImg from "../assets/images/india-city.jpg";
import recycleImg from "../assets/images/india-recycle.jpg";

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) navigate("/");
    setUserName(user?.name?.split(" ")[0]);
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] font-sans text-slate-900">
      {/* NAVIGATION BAR - Premium Glass Effect */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900">EcoTwin AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sustainability Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all border border-rose-100"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-32">
        
        {/* HERO SECTION - Premium Industrial Layout */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest border border-emerald-100">
              <ShieldCheck size={14} /> Welcome back, {userName || 'Pioneer'}
            </div>
            <h2 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Carbon <span className="text-emerald-500">Intelligence</span> for the Future.
            </h2>
            <p className="text-slate-500 text-xl leading-relaxed font-light max-w-xl">
              EcoTwin AI leverages proprietary Random Forest models to simulate your environmental "Digital Twin," providing hyper-accurate consumption predictions.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate("/predict")}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-slate-200 hover:bg-emerald-600 transition-all flex items-center gap-3 group"
              >
                Start AI Analysis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                View Analytics
              </button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/10 rounded-[2rem] blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            <img
              src={heroImg}
              alt="Sustainable Solar"
              className="relative rounded-[2rem] shadow-2xl border border-white object-cover aspect-[4/3]"
            />
          </div>
        </section>

        {/* STATS / WHY SECTION */}
        <section className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
          <div className="relative z-10 max-w-3xl space-y-8">
            <h3 className="text-4xl font-extrabold tracking-tight">The Indian Impact Paradox</h3>
            <p className="text-slate-400 text-xl leading-relaxed font-light">
              As India accelerates toward a $5T economy, personal carbon accountability becomes our greatest tool. 
              <span className="text-white font-medium"> EcoTwin AI bridges the gap </span> 
              between rapid development and ecological preservation.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-slate-800">
              <div>
                <div className="text-3xl font-black text-emerald-400">40%</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-tighter">Potential Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-400">Real-time</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-tighter">AI Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES - Bento Grid Style */}
        <section className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<BarChart3 size={32}/>}
            title="Granular Analysis"
            desc="Deep-dive into transport, energy usage, and dietary patterns with precision."
          />
          <Feature
            icon={<Brain size={32}/>}
            title="Predictive Logic"
            desc="Random Forest ML architecture provides accuracy beyond basic calculators."
          />
          <Feature
            icon={<Zap size={32}/>}
            title="Actionable Insights"
            desc="Don't just track—transform with AI-generated lifestyle recommendations."
          />
        </section>

        {/* KNOWLEDGE BLOCKS */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-black tracking-tight text-slate-900">Sustainable Solutions</h3>
            <p className="text-slate-500 max-w-2xl mx-auto">Proven strategies to mitigate environmental impact in the modern Indian landscape.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <ImageBlock
              img={metroImg}
              tag="Mobility"
              title="Mass Transit Systems"
              desc="Leveraging India's growing Metro networks to slash per-capita transit emissions."
            />
            <ImageBlock
              img={evImg}
              tag="Innovation"
              title="Electric Transition"
              desc="Adopting zero-emission vehicles to decouple mobility from fossil fuel dependency."
            />
            <ImageBlock
              img={cityImg}
              tag="Infrastructure"
              title="Smart Urbanism"
              desc="Efficiency-first city planning designed for reduced heat-island effects."
            />
            <ImageBlock
              img={recycleImg}
              tag="Circular Economy"
              title="Waste Valuization"
              desc="Transforming waste streams into resources through intelligent recycling."
            />
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 font-bold text-slate-400 mb-4">
            <Leaf size={16} /> EcoTwin AI Platform
          </div>
          <p className="text-slate-400 text-sm">Empowering a Greener Bharat through Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="group bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
      <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h4 className="font-extrabold text-xl mb-3 text-slate-800 tracking-tight">
        {title}
      </h4>
      <p className="text-slate-500 leading-relaxed font-medium text-sm">
        {desc}
      </p>
    </div>
  );
}

function ImageBlock({ img, title, desc, tag }) {
  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <div className="relative h-[300px] overflow-hidden">
        <img 
          src={img} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-8">
        <h4 className="font-extrabold text-2xl mb-3 text-slate-900 tracking-tight">
          {title}
        </h4>
        <p className="text-slate-500 leading-relaxed font-light">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default Home;