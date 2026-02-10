import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Leaf, ArrowLeft, LayoutDashboard, Loader2, CheckCircle2, User, Zap, Car, Recycle, 
  ChevronRight, Globe, BarChart3, Info, Sparkles, Trophy
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CONFIG from "../config";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

const Predict = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/");
  }, [navigate]);

  const [formData, setFormData] = useState({
    bodyType: "normal", sex: "male", diet: "omnivore",
    showerFrequency: "daily", heatingSource: "electricity", transport: "public", vehicleType: "none",
    socialActivity: "sometimes", groceryBill: 3000, airTravel: "rarely", vehicleDistance: 0,
    wasteBagSize: "medium", wasteCount: 2, tvHours: 2, newClothes: 0,
    internetHours: 4, energyEfficiency: "sometimes", recycling: "plastic", cookingWith: "gas"
  });

  const handlePredict = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(`${CONFIG.BASE_URL}/predict`, { ...formData, userId: user.id });
      if (res.data.success) setResult(res.data);
    } catch {
      alert("AI Prediction failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- REPORT VIEW ----------
  if (result) return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* REPORT HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">AI Environmental Audit</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
            <LayoutDashboard size={18} /> Return to Dashboard
          </button>
        </div>

        {/* SCORE SECTION */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
               <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-10 animate-pulse"></div>
               <div className="relative w-40 h-40 rounded-full border-[10px] border-emerald-500 flex flex-col items-center justify-center bg-white shadow-inner">
                  <span className="text-5xl font-black text-slate-900">{result.score}%</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Eco Score</span>
               </div>
            </div>
            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <Trophy size={14} /> {result.badge} Status
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Your Sustainability Profile is Verified.</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Our Random Forest model has analyzed your data against India's national sustainability benchmarks.</p>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">Annual Trajectory</p>
            <h3 className="text-5xl font-black mb-2 tracking-tighter">{result.prediction} <span className="text-xl text-slate-500">kg</span></h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">Total Predicted Carbon Emission per year based on current habits.</p>
          </div>
        </div>

        {/* METRICS & COMPARISON - TEXT LOGIC FIXED HERE */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-xl font-black mb-8 flex items-center gap-2"><Globe className="text-emerald-500" /> Benchmark Comparison</h3>
             <div className="space-y-6">
                <ComparisonBar label="India Average" userValue={result.prediction} avgValue={result.comparison.indiaAverage} />
                <ComparisonBar label="Global Average" userValue={result.prediction} avgValue={result.comparison.globalAverage} />
             </div>
             <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm font-medium text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  {result.comparison.betterThanIndia ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Your footprint is <strong>lower</strong> than the Indian national average.</span></>
                  ) : (
                    <><Info className="w-4 h-4 text-amber-500" /><span>Your footprint is <strong>higher</strong> than the Indian national average.</span></>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {result.comparison.betterThanGlobal ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Your footprint is <strong>lower</strong> than the global average.</span></>
                  ) : (
                    <><Info className="w-4 h-4 text-amber-500" /><span>Your footprint is <strong>higher</strong> than the global average.</span></>
                  )}
                </div>
             </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-xl font-black mb-4 flex items-center gap-2"><BarChart3 className="text-emerald-500" /> Impact Breakdown</h3>
             <div className="h-[240px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        {name:"Transport", value:result.breakdown.transport},
                        {name:"Energy", value:result.breakdown.energy},
                        {name:"Diet", value:result.breakdown.diet},
                        {name:"Waste", value:result.breakdown.waste}
                      ]}
                      innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                    >
                      {COLORS.map((color,index)=>(<Cell key={index} fill={color} stroke="none" />))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius:'16px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-4 flex-wrap">
                {["Transport", "Energy", "Diet", "Waste"].map((label, i) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-emerald-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-200">
           <div className="flex items-center gap-3 mb-8">
              <Zap className="text-emerald-300" />
              <h3 className="text-2xl font-black tracking-tight">AI Optimization Strategy</h3>
           </div>
           <div className="grid md:grid-cols-2 gap-4">
              {result.recommendations.map((tip,i)=>(
                <div key={i} className="flex gap-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 group hover:bg-white/20 transition-all">
                  <CheckCircle2 className="text-emerald-300 shrink-0 mt-0.5" />
                  <p className="font-bold text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  // ---------- FORM VIEW ----------
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2.5 font-black text-xl tracking-tighter">
            <div className="bg-emerald-600 p-1.5 rounded-lg shadow-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            EcoTwin AI
          </div>
          <button onClick={() => navigate("/dashboard")} className="p-2.5 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900">
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* PROGRESS BAR */}
          <div className="flex h-1.5 w-full bg-slate-50">
            {[1,2,3,4].map(s => (
              <div key={s} className={`flex-1 transition-all duration-500 ${step >= s ? 'bg-emerald-500' : 'bg-transparent'}`} />
            ))}
          </div>

          <div className="p-10 md:p-14">
            {step === 1 && <StepLayout icon={User} title="Core Profile" desc="Establish your baseline biological and social metrics.">
              <Select label="Physiology / Body Type" value={formData.bodyType} onChange={v=>setFormData({...formData,bodyType:v})} options={["normal","underweight","overweight","obese"]} />
              <Select label="Biological Sex" value={formData.sex} onChange={v=>setFormData({...formData,sex:v})} options={["male","female"]} />
              <Select label="Primary Diet" value={formData.diet} onChange={v=>setFormData({...formData,diet:v})} options={["omnivore","vegetarian","vegan"]} />
              <Select label="Social Engagement" value={formData.socialActivity} onChange={v=>setFormData({...formData,socialActivity:v})} options={["never","sometimes","often"]} />
            </StepLayout>}

            {step === 2 && <StepLayout icon={Zap} title="Energy Ecosystem" desc="Analyze home utility usage and digital footprint.">
              <div className="grid md:grid-cols-2 gap-x-6">
                <Select label="Heating Source" value={formData.heatingSource} onChange={v=>setFormData({...formData,heatingSource:v})} options={["electricity","gas","coal","wood"]} />
                <Select label="Cooking Method" value={formData.cookingWith} onChange={v=>setFormData({...formData,cookingWith:v})} options={["gas","electric","microwave","stove"]} />
                <Select label="Energy Efficiency" value={formData.energyEfficiency} onChange={v=>setFormData({...formData,energyEfficiency:v})} options={["no","sometimes","yes"]} />
                <Select label="Shower Habits" value={formData.showerFrequency} onChange={v=>setFormData({...formData,showerFrequency:v})} options={["daily","twice a day","rarely"]} />
              </div>
              <Input label="TV/PC Screen Time (Hrs/Day)" type="number" value={formData.tvHours} onChange={v=>setFormData({...formData,tvHours:v})} />
              <Input label="Active Internet Usage (Hrs/Day)" type="number" value={formData.internetHours} onChange={v=>setFormData({...formData,internetHours:v})} />
            </StepLayout>}

            {step === 3 && <StepLayout icon={Car} title="Mobility & Logistics" desc="Mapping your physical transit and aviation patterns.">
              <Select label="Primary Transit Mode" value={formData.transport} onChange={v=>setFormData({...formData,transport:v})} options={["public","private","walk/bike"]} />
              <Select label="Engine Type" value={formData.vehicleType} onChange={v=>setFormData({...formData,vehicleType:v})} options={["none","petrol","diesel","electric","hybrid"]} />
              <Input label="Monthly Cumulative Distance (km)" type="number" value={formData.vehicleDistance} onChange={v=>setFormData({...formData,vehicleDistance:v})} />
              <Select label="Air Travel Frequency" value={formData.airTravel} onChange={v=>setFormData({...formData,airTravel:v})} options={["never","rarely","frequently"]} />
            </StepLayout>}

            {step === 4 && <StepLayout icon={Recycle} title="Circular Consumption" desc="Finalizing waste generation and purchasing behavior.">
              <Input label="Avg. Monthly Grocery Spend (₹)" type="number" value={formData.groceryBill} onChange={v=>setFormData({...formData,groceryBill:v})} />
              <Input label="New Apparel Items (Monthly)" type="number" value={formData.newClothes} onChange={v=>setFormData({...formData,newClothes:v})} />
              <Select label="Standard Waste Bag Size" value={formData.wasteBagSize} onChange={v=>setFormData({...formData,wasteBagSize:v})} options={["small","medium","large"]} />
              <Input label="Bags per Week" type="number" value={formData.wasteCount} onChange={v=>setFormData({...formData,wasteCount:v})} />
              <Select label="Recycling Proficiency" value={formData.recycling} onChange={v=>setFormData({...formData,recycling:v})} options={["none","plastic","paper","metal","glass"]} />
            </StepLayout>}

            <div className="flex justify-between items-center mt-12 pt-10 border-t border-slate-50">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Back</button>
              ) : <div />}
              
              <button 
                onClick={step < 4 ? () => setStep(step + 1) : handlePredict}
                className="group px-10 py-4 bg-slate-900 text-white rounded-[1.25rem] font-bold shadow-2xl shadow-slate-200 hover:bg-emerald-600 transition-all flex items-center gap-3 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <> {step < 4 ? 'Continue' : 'Generate Intelligence Report'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// UI SUB-COMPONENTS
const StepLayout = ({ icon: Icon, title, desc, children }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100"><Icon size={24}/></div>
      <div>
        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
        <p className="text-slate-400 font-medium text-sm">{desc}</p>
      </div>
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
      {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
    </select>
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300" />
  </div>
);

const ComparisonBar = ({ label, userValue, avgValue }) => {
  const percentage = Math.min((userValue / (avgValue * 1.5)) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <span>{label} ({avgValue} kg)</span>
        <span className={userValue <= avgValue ? 'text-emerald-500' : 'text-rose-500'}>
          {userValue <= avgValue ? 'Below Avg' : 'Above Avg'}
        </span>
      </div>
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${userValue <= avgValue ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{width: `${percentage}%`}} />
      </div>
    </div>
  );
};

export default Predict;