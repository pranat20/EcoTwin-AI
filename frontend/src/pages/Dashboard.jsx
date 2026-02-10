import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Leaf,
  History,
  PlusCircle,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Home,
  LayoutDashboard,
  Calendar,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

import banner from "../assets/images/future.jpg";
import CONFIG from "../config";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    history: [],
    latestScore: 0,
    latestEmission: 0,
    avgScore: 0,
    improvement: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchDashboardData(userData.id);
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    try {
      const res = await axios.get(`${CONFIG.BASE_URL}/history/${userId}`);
      if (res.data.success) {
        const history = res.data.predictions;
        if (history.length > 0) {
          const latest = history[0];
          const prev = history[1] || latest;
          const trend = Number(latest.sustainabilityScore) - Number(prev.sustainabilityScore);
          const totalScore = history.reduce((acc, item) => acc + Number(item.sustainabilityScore || 0), 0);
          const avg = (totalScore / history.length).toFixed(0);

          setStats({
            history: [...history].reverse(),
            latestScore: latest.sustainabilityScore,
            latestEmission: latest.predictedCarbonEmission,
            avgScore: avg,
            improvement: trend
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const chartData = stats.history.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short"
    }),
    score: Number(item.sustainabilityScore)
  }));

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6 text-center">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Synchronizing Intelligence...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* TOP NAVIGATION - Mobile Optimized */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter">EcoTwin AI</h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <NavBtn icon={<Home size={18}/>} label="Home" onClick={() => navigate("/home")} />
            <NavBtn icon={<LayoutDashboard size={18}/>} label="Analytics" active />
            <NavBtn icon={<History size={18}/>} label="Audit Log" onClick={() => navigate("/history")} />
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={() => navigate("/predict")}
              className="hidden md:flex px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all items-center gap-2"
            >
              <PlusCircle size={16}/> New Analysis
            </button>
            <button onClick={logout} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
              <LogOut size={20}/>
            </button>
            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-600">
              {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-100 p-4 space-y-2 animate-in slide-in-from-top duration-300">
            <NavBtn icon={<Home size={18}/>} label="Home" onClick={() => navigate("/home")} full />
            <NavBtn icon={<LayoutDashboard size={18}/>} label="Analytics" active full />
            <NavBtn icon={<History size={18}/>} label="Audit Log" onClick={() => navigate("/history")} full />
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
        
        {/* WELCOME BANNER - Height adjusted for mobile content */}
        <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-900 min-h-[280px] sm:h-64 flex items-end">
          <img src={banner} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 hover:scale-105" alt="Future Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          <div className="relative z-10 p-6 sm:p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                <Calendar size={14} /> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">Welcome, {user?.name?.split(" ")[0]}</h2>
              <p className="text-slate-300 font-medium opacity-80 mt-1 text-base sm:text-lg">Your climate impact intelligence is ready.</p>
            </div>
            <button onClick={() => navigate("/predict")} className="md:hidden w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">New Analysis</button>
          </div>
        </section>

        {/* METRICS GRID - Responsive columns */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <PremiumCard title="ECO SCORE" value={`${stats.latestScore}%`} trend={stats.improvement} sub="Based on latest data" />
          <PremiumCard title="DAILY FOOTPRINT" value={`${(stats.latestEmission / 365).toFixed(2)} kg`} sub="Avg. CO2 / day" />
          <PremiumCard title="MONTHLY FOOTPRINT" value={`${(stats.latestEmission / 12).toFixed(2)} kg`} sub="Avg. CO2 / month" />
          <PremiumCardDark title="ANNUAL PREDICTION" value={`${stats.latestEmission} kg`} sub="Total CO2 Outlook" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* CHART AREA - Responsive padding */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
              <h3 className="text-lg sm:text-xl font-black flex gap-2 items-center">
                <TrendingUp className="text-emerald-500" size={24}/>
                Sustainability Trend
              </h3>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Historical Data</div>
            </div>
            <div className="h-[280px] sm:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -20, right: 10 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'}} 
                  />
                  <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI INSIGHTS CARD - Height adjusted */}
          <div className="bg-emerald-600 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-200/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <Zap className="mb-6 opacity-80" size={40} />
            <h3 className="text-2xl font-black mb-4 tracking-tight">AI Sustainability Insight</h3>
            <p className="text-emerald-50/90 leading-relaxed font-medium mb-8 text-sm sm:text-base">
              Your current sustainability score is <span className="text-white font-bold">{stats.latestScore}%</span>. 
              Our Random Forest model suggests optimizing transport habits could decrease your footprint by up to 12% next month.
            </p>
            <button onClick={() => navigate("/predict")} className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
              Optimize Now <ChevronRight size={18}/>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

function NavBtn({ icon, label, active, onClick, full }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl font-bold text-sm transition-all ${full ? 'w-full justify-start' : ''} ${active ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 lg:hover:bg-transparent'}`}
    >
      {icon} {label}
    </button>
  );
}

function PremiumCard({ title, value, trend, sub }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-[1.8rem] sm:rounded-[2.2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        {trend !== undefined && (
          <div className={`flex items-center font-bold text-[10px] sm:text-xs ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 tracking-tight group-hover:text-emerald-600 transition-colors">
        {value}
      </h2>
      <p className="text-[10px] sm:text-[11px] font-bold text-slate-400">{sub}</p>
    </div>
  );
}

function PremiumCardDark({ title, value, sub }) {
  return (
    <div className="bg-slate-900 p-6 sm:p-8 rounded-[1.8rem] sm:rounded-[2.2rem] shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 blur-xl"></div>
      <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{title}</p>
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
        {value}
      </h2>
      <p className="text-[10px] sm:text-[11px] font-bold text-emerald-500/60 uppercase">{sub}</p>
    </div>
  );
}

export default Dashboard;