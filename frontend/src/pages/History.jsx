import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Globe, ShieldCheck, BarChart3, Search, 
  Loader2, ArrowLeft, X, CheckCircle2, Eye,
  Calendar, Download, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [userName, setUserName] = useState("EcoWarrior");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "EcoWarrior");
        fetchHistory(user.id);
      } catch (e) {
        console.error("User data parse error", e);
      }
    }
  }, []);

  const fetchHistory = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/history/${userId}`);
      if (res.data.success) {
        setHistory(res.data.predictions);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => 
    new Date(item.createdAt).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12 font-sans selection:bg-emerald-100">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAV & SEARCH */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div className="space-y-4">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Insights
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Environmental Audit Log</h1>
              <p className="text-slate-500 font-medium mt-1">Archive of AI-driven sustainability assessments for <span className="text-slate-900 font-bold">{userName}</span></p>
            </div>
          </div>

          <div className="relative w-full lg:w-96 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none border-r border-slate-200 pr-3">
              <Search className="text-slate-400 w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search by date (DD/MM/YYYY)..." 
              className="pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full outline-none text-sm font-bold shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* SUMMARY STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            icon={<Globe size={22}/>} 
            color="emerald" 
            label="Total Logs" 
            value={history.length} 
          />
          <StatCard 
            icon={<ShieldCheck size={22}/>} 
            color="blue" 
            label="Integrity Status" 
            value="Verified" 
          />
          <StatCard 
            icon={<BarChart3 size={22}/>} 
            color="orange" 
            label="Avg. Efficiency" 
            value={`${history.length ? (history.reduce((acc, item) => acc + Number(item.sustainabilityScore || 0), 0) / history.length).toFixed(0) : 0}%`} 
          />
        </div>

        {/* DATA TABLE - Premium Professional Look */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Audit Timestamp</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">CO2 Trajectory</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 hidden md:table-cell">Health Score</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="4" className="p-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Decrypting Audit Data...</span>
                    </div>
                  </td></tr>
                ) : filteredHistory.length === 0 ? (
                  <tr><td colSpan="4" className="p-32 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found matching your query.</p>
                  </td></tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item._id} className="group hover:bg-slate-50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="font-bold text-slate-700">
                            {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-slate-900 text-lg">{item.predictedCarbonEmission}</span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1.5 uppercase">kg/yr</span>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          item.sustainabilityScore > 75 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {item.sustainabilityScore}% Efficiency
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedRecord(item)} 
                          className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center gap-2 ml-auto"
                        >
                          <Eye size={14}/> View Report
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ANALYSIS REPORT MODAL --- */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                <ShieldCheck size={16}/> Certified AI Analysis
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 md:p-12 overflow-y-auto space-y-10">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-28 h-28 bg-white rounded-full border-[6px] border-emerald-500 shadow-xl flex items-center justify-center">
                    <span className="text-4xl font-black text-slate-900">{selectedRecord.sustainabilityScore}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Impact Report</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">ID: {selectedRecord._id.slice(-8).toUpperCase()}</p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Yearly Projection</p>
                  <p className="text-2xl font-black text-slate-900">{selectedRecord.predictedCarbonEmission} <span className="text-xs text-slate-400 font-bold">kg</span></p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Daily Average</p>
                  <p className="text-2xl font-black text-slate-900">{(selectedRecord.predictedCarbonEmission / 365).toFixed(2)} <span className="text-xs text-slate-400 font-bold">kg</span></p>
                </div>
              </div>

              {/* Action Plan */}
              <div className="space-y-6">
                <h4 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest">
                  <div className="h-px flex-1 bg-slate-100"></div>
                  AI Recommendations
                  <div className="h-px flex-1 bg-slate-100"></div>
                </h4>
                <div className="space-y-3">
                  {selectedRecord.recommendations.map((tip, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white">
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-[0.98]"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Sub-component for Stats
function StatCard({ icon, color, label, value }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900">{value}</h3>
    </div>
  );
}

export default History;