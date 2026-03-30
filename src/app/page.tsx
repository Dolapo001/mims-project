"use client"

import Link from "next/link"
import { Target, ArrowRight, Zap, TrendingUp, Users, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Simple Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
            <Target className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">AdWise AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            Launch Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-12 max-w-5xl mx-auto py-24 md:py-32">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
            <Zap className="w-3 h-3" />
            AI-Powered Predictions
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Predict the best platform for your <span className="text-blue-600">next campaign.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Stop guessing and start growing. Our AI analyzes your campaign goals and target audience to recommend the highest performing social media platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard" 
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-100 flex items-center justify-center gap-2 text-lg"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-12 md:pt-24 text-left">
          {[
            { 
              icon: TrendingUp, 
              title: "87% Accuracy", 
              desc: "Predictive models trained on millions of high-performing campaign datasets." 
            },
            { 
              icon: Users, 
              title: "Target Focused", 
              desc: "Granular audience analysis including age, interest, and platform engagement habits." 
            },
            { 
              icon: Shield, 
              title: "Budget Safe", 
              desc: "Minimize waste by allocating spend where it actually converts for your unique goals." 
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-200 transition-colors group">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 flex flex-col items-center gap-4 text-slate-400 text-sm font-medium">
        <p>© 2026 AdWise AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

