import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, AuthProvider as AuthProviderType, Tenant } from '../types';
import { logger } from '../services/loggerService';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  login: (provider: AuthProviderType) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  checkPermission: (requiredRole: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'nexus-user',
  TENANT: 'nexus-tenant',
  SESSION: 'nexus-session',
  LAST_LOGIN: 'nexus-last-login'
};

const MOCK_TENANTS: Record<string, Tenant> = {
  'admin-tenant': {
    id: 't-root-001',
    createdAt: new Date(),
    code: 'GRATECH-HQ',
    name_en: 'GraTech Headquarters',
    name_ar: 'شركة جراتك',
    name: { en: 'GraTech Headquarters', ar: 'شركة جراتك' },
    region: 'riyadh',
    tier: 'sovereign',
    limits: { storageGB: 10000, apiCalls: 1000000, users: 50 },
    security: { encryptionKeyId: 'kv-gratech-root-01', isActive: true, complianceLevel: 'sovereign' },
    features: { aiops: true, monitoring: true, multiRegion: true },
    max_storage_gb: 10000,
    max_api_calls: 1000000,
    encryption_key_id: 'kv-gratech-root-01',
    is_active: true
  },
  'moh-tenant': {
    id: 't-moh-002',
    createdAt: new Date(),
    code: 'MOH-SA',
    name_en: 'Ministry of Health',
    name_ar: 'وزارة الصحة',
    name: { en: 'Ministry of Health', ar: 'وزارة الصحة' },
    region: 'riyadh',
    tier: 'enterprise',
    limits: { storageGB: 5000, apiCalls: 500000, users: 1000 },
    security: { encryptionKeyId: 'kv-moh-sa-02', isActive: true, complianceLevel: 'advanced' },
    features: { aiops: true, monitoring: true, multiRegion: false },
    max_storage_gb: 5000,
    max_api_calls: 500000,
    encryption_key_id: 'kv-moh-sa-02',
    is_active: true
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        const tenantData = localStorage.getItem(STORAGE_KEYS.TENANT);
        const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
        
        if (userData && sessionData && tenantData) {
          const savedUser = JSON.parse(userData);
          const savedTenant = JSON.parse(tenantData);
          const session = JSON.parse(sessionData);
          
          if (Date.now() - session.createdAt < 24 * 60 * 60 * 1000) {
            setUser(savedUser);
            setTenant(savedTenant);
            logger.info("User & Tenant loaded from persistent storage", "AuthContext");
          } else {
            logout(); // Clear expired session
            logger.info("Session expired, user logged out", "AuthContext");
          }
        }
      } catch (error) {
        logger.error("Error loading user from storage", "AuthContext", error);
        logout();
      }
    };

    loadUserFromStorage();
  }, []);

  const saveSession = (userData: User, tenantData: Tenant) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.TENANT, JSON.stringify(tenantData));
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
        createdAt: Date.now(),
        provider: userData.security.provider
      }));
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
    } catch (error) {
      logger.error("Error saving user to storage", "AuthContext", error);
    }
  };

  const login = async (provider: AuthProviderType) => {
    setIsLoading(true);
    logger.info(`Initiating authentication with ${provider}`, "AuthContext");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      let mockUser: User;
      let mockTenant: Tenant;
      const timestamp = new Date();

      switch (provider) {
        case 'corporate':
          // Admin login assumes Root Tenant
          mockTenant = MOCK_TENANTS['admin-tenant'];
          mockUser = {
            id: 'admin-001',
            createdAt: timestamp,
            name: 'Sulaiman Alshammari',
            email: 'admin@gratech.sa',
            role: 'admin',
            provider: 'corporate',
            avatar: 'https://ui-avatars.com/api/?name=Sulaiman+Alshammari&background=14b8a6&color=fff',
            tenantId: mockTenant.id,
            lastLogin: timestamp,
            personalInfo: {
                name: 'Sulaiman Alshammari',
                email: 'admin@gratech.sa',
                avatar: 'https://ui-avatars.com/api/?name=Sulaiman+Alshammari&background=14b8a6&color=fff',
                language: 'ar'
            },
            security: {
                role: 'admin',
                provider: 'corporate',
                lastLogin: timestamp,
                mfaEnabled: true
            },
            preferences: {
                theme: 'dark',
                defaultModel: 'smart',
                notifications: { email: true, push: true }
            }
          };
          break;
        case 'google':
          // Standard login assumes Health Ministry Tenant for demo
          mockTenant = MOCK_TENANTS['moh-tenant'];
          mockUser = {
            id: 'user-g-001',
            createdAt: timestamp,
            name: 'Dr. Sarah Ahmed',
            email: 'sarah.ahmed@moh.gov.sa',
            role: 'standard',
            provider: 'google',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Ahmed&background=0ea5e9&color=fff',
            tenantId: mockTenant.id,
            lastLogin: timestamp,
            personalInfo: {
                name: 'Dr. Sarah Ahmed',
                email: 'sarah.ahmed@moh.gov.sa',
                avatar: 'https://ui-avatars.com/api/?name=Sarah+Ahmed&background=0ea5e9&color=fff',
                language: 'en'
            },
            security: {
                role: 'standard',
                provider: 'google',
                lastLogin: timestamp,
                mfaEnabled: false
            },
            preferences: {
                theme: 'dark',
                defaultModel: 'standard',
                notifications: { email: true, push: false }
            }
          };
          break;
        case 'microsoft':
          // Standard login
          mockTenant = MOCK_TENANTS['moh-tenant'];
          mockUser = {
            id: 'user-ms-001',
            createdAt: timestamp,
            name: 'IT Support',
            email: 'support@moh.gov.sa',
            role: 'standard',
            provider: 'microsoft',
            avatar: 'https://ui-avatars.com/api/?name=IT+Support&background=8b5cf6&color=fff',
            tenantId: mockTenant.id,
            lastLogin: timestamp,
            personalInfo: {
                name: 'IT Support',
                email: 'support@moh.gov.sa',
                avatar: 'https://ui-avatars.com/api/?name=IT+Support&background=8b5cf6&color=fff',
                language: 'en'
            },
            security: {
                role: 'standard',
                provider: 'microsoft',
                lastLogin: timestamp,
                mfaEnabled: true
            },
            preferences: {
                theme: 'dark',
                defaultModel: 'standard',
                notifications: { email: true, push: true }
            }
          };
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }

      setUser(mockUser);
      setTenant(mockTenant);
      saveSession(mockUser, mockTenant);
      
      logger.info(`User authenticated successfully`, "AuthContext", {
        email: mockUser.personalInfo.email,
        role: mockUser.security.role,
        tenant: mockTenant.code
      });
      
    } catch (error) {
      logger.error("Authentication failed", "AuthContext", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const userEmail = user?.personalInfo.email;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    setUser(null);
    setTenant(null);
    logger.info("User logged out successfully", "AuthContext", { email: userEmail });
  };

  const updateUser = (updates: Partial<User>) => {
    if (user && tenant) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveSession(updatedUser, tenant);
      logger.info("User profile updated", "AuthContext", { updates });
    }
  };

  const checkPermission = (requiredRole: string): boolean => {
    if (!user) return false;
    const userRole = user.security.role;
    if (userRole === 'admin') return true;
    return userRole.toUpperCase() === requiredRole.toUpperCase();
  };

  const value: AuthContextType = {
    user,
    tenant,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    checkPermission,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};