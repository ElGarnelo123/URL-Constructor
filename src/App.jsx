import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  Copy, 
  ExternalLink, 
  RotateCcw, 
  Settings, 
  Moon, 
  Sun,
  AlertCircle,
  Wrench
} from 'lucide-react';

/**
 * WORKER CONFIGURATION
 * Edit this list to add/remove workers
 */
const WORKERS = [
  {
    key: "create-notification-leave-request",
    label: "Leave Request Notifications",
    desc: "Triggers leave request notifications immediately",
    icon: "fly"
  },
  {
    key: "public-functions-notification",
    label: "Public Functions (Job Board)",
    desc: "Triggers new public functions notifications",
    icon: "📢"
  },
  {
    key: "email",
    label: "Process Email Queue",
    desc: "Processes email queue",
    icon: "✉️"
  },
  { 
    key: "custom", 
    label: "Custom Worker...", 
    desc: "Enter a specific worker key manually",
    icon: "🔧" 
  },
];

// --- UTILS & LOGIC ---

function safeParseUrl(raw) {
  try {
    const trimmed = (raw || "").trim();
    if (!trimmed) return null;
    return new URL(trimmed);
  } catch {
    return null;
  }
}

function buildWorkerUrl(rawApiUrl, workerType) {
  const parsed = safeParseUrl(rawApiUrl);
  if (!parsed) return { url: "", error: "Invalid URL. Please paste a valid api.php link." };

  // 1. Extract the account ID before we wipe the params
  const account = parsed.searchParams.get("account");

  // 2. Wipe ALL query parameters and hash to get a clean slate
  // This removes 'subject', 'param', 'module', or anything else unwanted
  parsed.search = ""; 
  parsed.hash = "";

  // 3. Re-add only the strict essentials
  if (account) {
    parsed.searchParams.set("account", account);
  }
  parsed.searchParams.set("requestType", "worker");
  parsed.searchParams.set("type", workerType);

  return { url: parsed.toString(), error: "" };
}

// --- MAIN COMPONENT ---

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiUrl, setApiUrl] = useState("https://api.eu-west-1.rentmanapp.com/4.806/api.php?account=staging133393&requestType=query&subject=Uren");
  const [selectedWorker, setSelectedWorker] = useState("create-notification-leave-request");
  const [customWorker, setCustomWorker] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const effectiveWorker = useMemo(() => {
    if (selectedWorker === "custom") return (customWorker || "").trim();
    return selectedWorker;
  }, [selectedWorker, customWorker]);

  const parsedInput = safeParseUrl(apiUrl);
  const accountId = parsedInput?.searchParams.get("account") || "Unknown";
  const apiHost = parsedInput ? parsedInput.host : "";

  useEffect(() => {
    if (!apiUrl.trim()) {
      setOutputUrl("");
      setError("");
      return;
    }
    if (!effectiveWorker) {
      setOutputUrl("");
      return;
    }
    const res = buildWorkerUrl(apiUrl, effectiveWorker);
    setOutputUrl(res.url);
    setError(res.error);
  }, [apiUrl, effectiveWorker]);

  const handleCopy = () => {
    if (!outputUrl) return;
    navigator.clipboard.writeText(outputUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setApiUrl("https://api.eu-west-1.rentmanapp.com/4.806/api.php?account=staging133393&requestType=query&subject=Uren");
    setSelectedWorker("create-notification-leave-request");
    setCustomWorker("");
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-100' : 'bg-[#f4f5f7] text-gray-900'} font-sans`}>
      
      {/* HEADER */}
      <header className={`${isDarkMode ? 'bg-[#252525] border-b border-gray-700' : 'bg-white border-b border-gray-200'} sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0">
               <div className="bg-[#ff5722] h-8 w-8 flex flex-col justify-center items-center gap-[2px] rounded-sm mr-2 p-1">
                  <div className="bg-white w-full h-[3px] transform -skew-x-12"></div>
                  <div className="bg-white w-full h-[3px] transform -skew-x-12"></div>
                  <div className="bg-white w-full h-[3px] transform -skew-x-12"></div>
               </div>
               <span className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>RENTMAN</span>
               <span className={`ml-2 text-xs font-mono uppercase px-2 py-0.5 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                 Worker Tool
               </span>
            </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Configuration */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700 bg-[#2a2a2a]' : 'border-gray-100 bg-gray-50'}`}>
                <h2 className="font-semibold flex items-center gap-2">
                  <Settings size={18} className="text-[#ff5722]" /> Configuration
                </h2>
                <button onClick={handleReset} className="text-xs flex items-center gap-1 text-gray-500 hover:text-[#ff5722] transition-colors">
                  <RotateCcw size={12} /> Reset Default
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium opacity-90">
                    Source URL <span className="text-[#ff5722]">*</span>
                  </label>
                  <textarea
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="Paste api.php URL from Network tab..."
                    className={`w-full h-24 p-3 rounded-lg border font-mono text-xs focus:ring-2 focus:ring-[#ff5722] focus:border-transparent outline-none transition-all resize-none
                      ${isDarkMode ? 'bg-[#1a1a1a] border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                  />
                  {parsedInput && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-[10px] px-2 py-1 rounded-md border font-mono ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                        {apiHost}
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-md border font-mono flex items-center gap-1 ${isDarkMode ? 'bg-[#ff5722]/10 border-[#ff5722]/20 text-[#ff5722]' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
                        <Wrench size={10} /> account={accountId}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium opacity-90">Worker Type</label>
                  <div className="relative">
                    <select
                      value={selectedWorker}
                      onChange={(e) => setSelectedWorker(e.target.value)}
                      className={`w-full p-3 pr-10 rounded-lg border appearance-none outline-none focus:ring-2 focus:ring-[#ff5722] transition-all
                        ${isDarkMode ? 'bg-[#1a1a1a] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                      {WORKERS.map(w => (
                        <option key={w.key} value={w.key}>{w.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>
                  <div className={`text-xs mt-1 p-2 rounded border-l-2 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-500'}`}>
                    {WORKERS.find(w => w.key === selectedWorker)?.desc}
                  </div>
                  {selectedWorker === 'custom' && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <input
                        type="text"
                        value={customWorker}
                        onChange={(e) => setCustomWorker(e.target.value)}
                        placeholder="e.g. create-notification-leave-request"
                        className={`w-full p-2 rounded-lg border font-mono text-sm focus:ring-2 focus:ring-[#ff5722] outline-none
                          ${isDarkMode ? 'bg-[#1a1a1a] border-gray-600' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Action & Output */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`sticky top-24 rounded-xl shadow-lg border overflow-hidden ${isDarkMode ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-200'}`}>
               <div className="h-1 bg-gradient-to-r from-[#ff5722] to-[#ff9100]"></div>
               <div className="p-6">
                 <h2 className="text-lg font-bold mb-4">Ready to Run</h2>
                 <div className="mb-6">
                    {error ? (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 text-red-700 border border-red-100">
                        <AlertCircle className="shrink-0 mt-0.5" size={16} />
                        <span className="text-sm">{error}</span>
                      </div>
                    ) : (
                      <div className={`flex items-start gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-[#1a1a1a] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                         <div className={`mt-0.5 p-1 rounded-full ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                           <Check size={12} />
                         </div>
                         <div className="overflow-hidden">
                           <div className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-1">Generated Worker URL</div>
                           <div className="font-mono text-xs break-all opacity-80 line-clamp-3">
                             {outputUrl || "Waiting for input..."}
                           </div>
                         </div>
                      </div>
                    )}
                 </div>
                 <div className="space-y-3">
                   <button
                     onClick={() => window.open(outputUrl, '_blank')}
                     disabled={!outputUrl || !!error}
                     className={`w-full group relative flex items-center justify-center gap-2 py-4 rounded-lg font-bold shadow-md transition-all
                       ${!outputUrl || !!error 
                         ? 'bg-gray-300 cursor-not-allowed text-gray-500 opacity-50' 
                         : 'bg-[#ff5722] hover:bg-[#e64a19] text-white hover:shadow-lg hover:-translate-y-0.5'}`}
                   >
                     <ExternalLink size={20} />
                     <span>RUN WORKER</span>
                   </button>
                   <button
                     onClick={handleCopy}
                     disabled={!outputUrl}
                     className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium border transition-all
                       ${isDarkMode 
                         ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                         : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                   >
                     {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                     <span>{copied ? "Copied to Clipboard" : "Copy URL"}</span>
                   </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
