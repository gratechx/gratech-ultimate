import React from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';

// Simple Landing Page
const Landing = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        padding: '8px 16px',
        background: 'rgba(20, 184, 166, 0.2)',
        border: '1px solid rgba(20, 184, 166, 0.4)',
        borderRadius: '999px',
        color: '#14b8a6',
        fontSize: '12px',
        marginBottom: '24px'
      }}>
        ● SYSTEMS ONLINE
      </div>
      
      <h1 style={{
        fontSize: 'clamp(48px, 12vw, 120px)',
        fontWeight: 900,
        background: 'linear-gradient(90deg, #fff, #14b8a6, #22d3ee)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0,
        lineHeight: 1
      }}>
        GRATECH
      </h1>
      
      <p style={{ color: '#94a3b8', fontSize: '20px', margin: '16px 0' }}>
        السيادة الرقمية السعودية
      </p>
      
      <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', marginBottom: '32px' }}>
        Sovereign AI Platform • Multi-Model Intelligence • Enterprise Ready
      </p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
        {['AI Chat', '6 Models', 'Saudi Cloud', 'Real-time'].map((item, i) => (
          <div key={i} style={{
            padding: '16px 24px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#e2e8f0'
          }}>
            {item}
          </div>
        ))}
      </div>
      
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '16px 48px',
          background: 'linear-gradient(90deg, #14b8a6, #22d3ee)',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 40px rgba(20, 184, 166, 0.4)'
        }}
      >
        دخول لوحة التحكم →
      </button>
      
      <p style={{ marginTop: '48px', color: '#475569', fontSize: '12px' }}>
        Built by Sulaiman Alshammari • @Grar00t • 4000+ Hours
      </p>
    </div>
  );
};

// Simple Dashboard
const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/')} style={{
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: '24px' }}>GraTech Dashboard</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {[
          { title: 'AI Chat', desc: 'Chat with multiple AI models', color: '#14b8a6' },
          { title: 'Image Gen', desc: 'Generate images with Imagen', color: '#8b5cf6' },
          { title: 'Video Gen', desc: 'Create videos with Veo 3.1', color: '#f59e0b' },
          { title: 'TTS', desc: 'Text to Speech synthesis', color: '#22d3ee' },
          { title: 'Live Audio', desc: 'Real-time voice chat', color: '#ef4444' },
          { title: 'Grounding', desc: 'Search with citations', color: '#22c55e' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: item.color,
              borderRadius: '12px',
              marginBottom: '16px',
              opacity: 0.8
            }}></div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{item.title}</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </HashRouter>
);

export default App;
