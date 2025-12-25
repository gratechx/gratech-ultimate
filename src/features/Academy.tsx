import React from 'react';
import { BookOpen, Code, Terminal, Brain, Sparkles, Target, Zap, Shield, GitBranch } from 'lucide-react';

const Academy: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-white flex items-center gap-3 mb-4">
          <Brain className="text-nexus-primary" size={40} />
          Nexus Academy
        </h2>
        <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
          Master the art and science of Prompt Engineering. Learn how to orchestrate AI agents, 
          optimize context, and build reliable systems using scientific principles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900/80 border border-nexus-border rounded-xl p-6 hover:border-nexus-primary/50 transition-all group cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
            <Target className="text-blue-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Core Principles</h3>
          <p className="text-sm text-gray-400">
            Learn the foundational elements: Clarity, Context, Constraints, and Persona.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-nexus-border rounded-xl p-6 hover:border-nexus-secondary/50 transition-all group cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
            <Code className="text-teal-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Technical Strategies</h3>
          <p className="text-sm text-gray-400">
            Master Zero-shot, Few-shot, and Chain of Thought prompting techniques.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-nexus-border rounded-xl p-6 hover:border-nexus-accent/50 transition-all group cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
            <GitBranch className="text-violet-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Agent Orchestration</h3>
          <p className="text-sm text-gray-400">
            How to coordinate multiple AI agents (like Comet & Gemini) for complex tasks.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">The Anatomy of a Perfect Prompt</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                A robust prompt structure significantly reduces hallucination and improves output quality. 
                Think of it as programming in natural language.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">1. Persona:</span>
                    <span className="text-gray-400">Who is the AI? (e.g., "Act as a Senior Architect")</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">2. Task:</span>
                    <span className="text-gray-400">What specific action to perform? (Use active verbs)</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">3. Context:</span>
                    <span className="text-gray-400">Background info, data, or code snippets.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">4. Output Format:</span>
                    <span className="text-gray-400">JSON, Markdown, Table, specific tone?</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-nexus-primary"></div>
                <div className="text-gray-500 mb-2">// Example: Architecture Request</div>
                <div className="text-purple-300">Act as a Senior Cloud Architect.</div>
                <div className="text-blue-300 mt-2">Analyze the provided infrastructure configuration for security vulnerabilities.</div>
                <div className="text-green-300 mt-2">Context: Utilizing Azure Kubernetes Service with default network policies.</div>
                <div className="text-orange-300 mt-2">Output a prioritized list of risks in Markdown format with mitigation steps.</div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="text-nexus-secondary" />
            <h3 className="text-2xl font-bold text-white">Advanced Techniques</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white mb-2">Zero-Shot</h4>
                <p className="text-sm text-gray-400 mb-4">Asking the AI to perform a task without examples. Relies on the model's pre-trained knowledge.</p>
                <code className="text-xs bg-black/30 p-2 rounded block text-cyan-300">"Explain Quantum Computing."</code>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white mb-2">Few-Shot</h4>
                <p className="text-sm text-gray-400 mb-4">Providing examples of input/output pairs to guide the model's pattern recognition.</p>
                <code className="text-xs bg-black/30 p-2 rounded block text-cyan-300">"Input: Happy → Output: Positive\nInput: Sad → Output: ..."</code>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white mb-2">Chain of Thought</h4>
                <p className="text-sm text-gray-400 mb-4">Encouraging the model to explain its reasoning steps before giving the final answer.</p>
                <code className="text-xs bg-black/30 p-2 rounded block text-cyan-300">"Let's think step by step..."</code>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="text-nexus-accent" />
                <h3 className="text-2xl font-bold text-white">Guardrails & Safety</h3>
            </div>
            <p className="text-gray-300 mb-6">
                Ensuring AI outputs are safe, accurate, and aligned with policy is critical for enterprise deployment.
            </p>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                    <div className="w-2 h-12 bg-red-500 rounded-full"></div>
                    <div>
                        <h4 className="font-bold text-white">Hallucination Prevention</h4>
                        <p className="text-sm text-gray-400">Use "Grounding" to anchor responses in retrieved data. Explicitly instruct the model to say "I don't know" if data is missing.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                    <div className="w-2 h-12 bg-orange-500 rounded-full"></div>
                    <div>
                        <h4 className="font-bold text-white">Input Validation</h4>
                        <p className="text-sm text-gray-400">Sanitize user inputs before sending them to the LLM to prevent prompt injection attacks.</p>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Academy;