// ============================================
// GraTech Ultimate - Application Data
// ============================================

export const GRA_TECH_DATA = {
  company: {
    name: "GraTech",
    nameAr: "جراتك",
    tagline: "Sovereign AI Platform",
    taglineAr: "منصة الذكاء الاصطناعي السيادية",
    domain: "gratech.sa",
    founder: "Sulaiman Alshammari",
    founderHandle: "@Grar00t",
  },
  
  stats: {
    totalModels: 6,
    totalFeatures: 14,
    uptime: "99.9%",
    apiCalls: "1M+",
    users: "10K+",
  },

  aiModels: [
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      provider: "Google",
      description: "Fast responses for general tasks",
      icon: "⚡",
      status: "available",
    },
    {
      id: "gemini-3-pro",
      name: "Gemini 3 Pro",
      provider: "Google",
      description: "Advanced reasoning and analysis",
      icon: "🧠",
      status: "available",
    },
    {
      id: "deepseek-v3",
      name: "DeepSeek V3.1",
      provider: "Azure AI",
      description: "Code generation and analysis",
      icon: "💻",
      status: "available",
    },
    {
      id: "llama-405b",
      name: "Llama 3.1 405B",
      provider: "Azure AI",
      description: "Large context and reasoning",
      icon: "🦙",
      status: "available",
    },
    {
      id: "gpt-5",
      name: "GPT-5",
      provider: "Azure AI",
      description: "Advanced creative tasks",
      icon: "🌟",
      status: "available",
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "Azure OpenAI",
      description: "Balanced performance",
      icon: "🔮",
      status: "available",
    },
  ],

  features: [
    {
      id: "chat",
      name: "AI Chat",
      nameAr: "محادثة الذكاء",
      icon: "MessageSquare",
      path: "/chat",
      description: "Multi-model chat interface",
    },
    {
      id: "video",
      name: "Video Generation",
      nameAr: "توليد الفيديو",
      icon: "Video",
      path: "/video",
      description: "Create videos with Veo 3.1",
    },
    {
      id: "image",
      name: "Image Generation",
      nameAr: "توليد الصور",
      icon: "Image",
      path: "/image",
      description: "Generate images with Imagen Pro",
    },
    {
      id: "tts",
      name: "Text to Speech",
      nameAr: "تحويل النص لصوت",
      icon: "Volume2",
      path: "/tts",
      description: "Natural voice synthesis",
    },
    {
      id: "live-audio",
      name: "Live Audio",
      nameAr: "المحادثة الصوتية",
      icon: "Mic",
      path: "/live-audio",
      description: "Real-time voice conversation",
    },
    {
      id: "grounding",
      name: "Grounding Search",
      nameAr: "البحث المؤسس",
      icon: "Search",
      path: "/grounding",
      description: "AI search with citations",
    },
  ],

  navigation: [
    { name: "Overview", path: "/", icon: "LayoutDashboard" },
    { name: "Chat", path: "/chat", icon: "MessageSquare" },
    { name: "Video", path: "/video", icon: "Video" },
    { name: "Image", path: "/image", icon: "Image" },
    { name: "TTS", path: "/tts", icon: "Volume2" },
    { name: "Live Audio", path: "/live-audio", icon: "Mic" },
    { name: "Grounding", path: "/grounding", icon: "Search" },
    { name: "Settings", path: "/settings", icon: "Settings" },
  ],

  services: [
    {
      name: "Compute",
      status: "healthy",
      usage: 45,
      icon: "Cpu",
    },
    {
      name: "Storage",
      status: "healthy",
      usage: 62,
      icon: "HardDrive",
    },
    {
      name: "Network",
      status: "healthy",
      usage: 28,
      icon: "Network",
    },
    {
      name: "AI Models",
      status: "healthy",
      usage: 73,
      icon: "Brain",
    },
  ],

  quickActions: [
    { label: "New Chat", action: "new-chat", icon: "Plus" },
    { label: "Generate Image", action: "gen-image", icon: "Image" },
    { label: "Create Video", action: "gen-video", icon: "Video" },
    { label: "Voice Chat", action: "voice", icon: "Mic" },
  ],

  recentActivity: [
    {
      id: 1,
      type: "chat",
      title: "Code Review Session",
      time: "5 min ago",
      model: "deepseek-v3",
    },
    {
      id: 2,
      type: "image",
      title: "Logo Design",
      time: "1 hour ago",
      model: "imagen-pro",
    },
    {
      id: 3,
      type: "video",
      title: "Product Demo",
      time: "2 hours ago",
      model: "veo-3.1",
    },
  ],
};

export default GRA_TECH_DATA;
