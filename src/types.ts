/**
 * GraTech Ultimate - Type Definitions
 * Architected by: Sulaiman Alshammari
 * Domain: GRATECH.SA
 */


// ============================================
// 🧭 Navigation & Views
// ============================================

export type View = 
  | 'landing'
  | 'overview'
  | 'chat'
  | 'super-brain'
  | 'video'
  | 'image'
  | 'tts'
  | 'live-audio'
  | 'grounding'
  | 'monitoring'
  | 'dns-monitor'
  | 'endpoint-health'
  | 'disaster-recovery'
  | 'tenant-manager'
  | 'model-registry'
  | 'aiops'
  | 'billing'
  | 'academy'
  | 'analysis'
  | 'settings';

export interface NavigationItem {
  id: View;
  label: string;
  icon: any;
  description?: string;
  badge?: string;
}

// ============================================
// 🔐 Authentication & Authorization
// ============================================


// View types
export type View = 'landing' | 'overview' | 'chat' | 'super-brain' | 'video' | 'image' | 'tts' | 'live-audio' | 'grounding' | 'monitoring' | 'dns-monitor' | 'endpoint-health' | 'disaster-recovery' | 'tenant-manager' | 'model-registry' | 'aiops' | 'billing' | 'academy' | 'analysis' | 'settings';

export interface NavigationItem {
  id: View;
  label: string;
  icon: any;
  description?: string;
  badge?: string;
}


export type UserRole = 'ADMIN' | 'OPERATOR' | 'VIEWER' | 'GUEST';
export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  name_ar?: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  tenant_id?: string;
  created_at: Date;
  last_login?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

// ============================================
// 💬 Chat & Messaging
// ============================================

export type ChatRole = 'user' | 'assistant' | 'system' | 'error';
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'CODE';

export enum AppMode {
  CHAT_FAST = 'CHAT_FAST',       // gemini-2.5-flash
  CHAT_SMART = 'CHAT_SMART',     // gemini-3-pro-preview
  IMAGE_GEN = 'IMAGE_GEN',       // gemini-3-pro-image-preview
  VIDEO_GEN = 'VIDEO_GEN',       // veo-3.1-fast
  TTS = 'TTS',                   // gemini-2.5-flash-preview-tts
  LIVE_AUDIO = 'LIVE_AUDIO',     // gemini-2.5-flash-native-audio
  CODE_GEN = 'CODE_GEN',         // gemini-3-pro-preview
  ANALYSIS = 'ANALYSIS'          // gemini-3-pro-preview
}

export interface Message {
  id: string;
  createdAt: Date;
  conversationId: string;
  role: ChatRole;
  text: string;
  content: {
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    codeBlocks?: CodeBlock[];
  };
  status: 'pending' | 'delivered' | 'error';
  context?: {
    model?: string;
    tokens?: { prompt: number; completion: number; total: number };
    duration_ms?: number;
  };
  type: MessageType;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'code';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  mode: AppMode;
  model?: string;
}

// ============================================
// ⚙️ Configuration
// ============================================

export interface GeminiConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  systemInstruction?: string;
  thinkingBudget?: number;
  safetySettings?: SafetySetting[];
}

export interface SafetySetting {
  category: string;
  threshold: 'BLOCK_NONE' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MED_AND_ABOVE' | 'BLOCK_HIGH_AND_ABOVE';
}

// ============================================
// 🏢 Multi-Tenancy
// ============================================

export type TenantTier = 'standard' | 'enterprise' | 'sovereign';
export type Region = 'riyadh' | 'jeddah' | 'dammam' | 'uae-north' | 'west-europe';
export type ComplianceLevel = 'basic' | 'advanced' | 'sovereign';

export interface Tenant {
  id: string;
  createdAt: Date;
  code: string;
  name_en: string;
  name_ar: string;
  name: { en: string; ar: string };
  region: Region;
  tier: TenantTier;
  limits: {
    storageGB: number;
    apiCalls: number;
    users: number;
  };
  security: {
    encryptionKeyId: string;
    isActive: boolean;
    complianceLevel: ComplianceLevel;
  };
  features: {
    aiops: boolean;
    monitoring: boolean;
    multiRegion: boolean;
  };
  max_storage_gb: number;
  max_api_calls: number;
  encryption_key_id: string;
  is_active: boolean;
}

// ============================================
// 📊 Monitoring & Analytics
// ============================================

export interface MetricPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  latency_ms?: number;
  lastCheck: Date;
  endpoint?: string;
  region?: string;
}

export interface DNSProvider {
  id: string;
  name: string;
  ip: string;
  status: 'resolved' | 'propagating' | 'pending' | 'error';
  region: string;
  latency?: string;
  providerType: 'Global' | 'ISP' | 'Security';
}

// ============================================
// 🛡️ Disaster Recovery
// ============================================

export interface DRConfig {
  primaryRegion: Region;
  secondaryRegion: Region;
  rpoTarget: number; // seconds
  rtoTarget: number; // seconds
  replicationMode: 'sync' | 'async';
  backupRetentionDays: number;
}

export interface BackupStatus {
  id: string;
  type: 'full' | 'incremental' | 'wal';
  status: 'completed' | 'in_progress' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  sizeBytes: number;
  region: Region;
}

// ============================================
// 🎨 UI & Theme
// ============================================

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeConfig {
  mode: Theme;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

// ============================================
// 📁 File System
// ============================================

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  mimeType?: string;
  children?: FileNode[];
  createdAt: Date;
  modifiedAt: Date;
  owner?: string;
}

// ============================================
// 💳 Billing
// ============================================

export type PlanType = 'free' | 'pro' | 'enterprise' | 'sovereign';
export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  id: string;
  name: string;
  name_ar: string;
  type: PlanType;
  price: {
    monthly: number;
    yearly: number;
    currency: 'SAR' | 'USD';
  };
  limits: {
    apiCalls: number;
    storageGB: number;
    users: number;
    models: string[];
  };
  features: string[];
}

export interface Invoice {
  id: string;
  tenant_id: string;
  amount: number;
  currency: 'SAR' | 'USD';
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ============================================
// 🧠 AI Models
// ============================================

export interface AIModel {
  id: string;
  name: string;
  provider: 'google' | 'azure' | 'openai' | 'anthropic' | 'deepseek' | 'meta';
  type: 'chat' | 'image' | 'video' | 'audio' | 'embedding';
  endpoint: string;
  apiVersion?: string;
  maxTokens?: number;
  contextWindow?: number;
  pricing?: {
    inputPer1kTokens: number;
    outputPer1kTokens: number;
    currency: 'USD';
  };
  capabilities: string[];
  isAvailable: boolean;
}

// ============================================
// 📝 API Response Types
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    duration_ms?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// ============================================
// 🔧 Utility Types
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};
