import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Card, CardContent } from '../../components/ui/Card.js';
import { 
  UtensilsCrossed, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credential, setCredential] = useState('admin_super');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential || !password) {
      setErrorMessage('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(credential, password);
      // Determine redirection based on login credential
      if (credential.includes('student')) {
        navigate('/student/home');
      } else if (credential.includes('cashier')) {
        navigate('/admin/pos');
      } else if (credential.includes('chef')) {
        navigate('/admin/kitchen');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (user: string, defaultPath: string) => {
    setCredential(user);
    setPassword('Password@123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 items-center justify-center text-white shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/20">
            <UtensilsCrossed className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SMART CANTEEN SYSTEM</h1>
          <p className="text-xs text-slate-400 font-medium">Hệ Thống Quản Lý Căng Tin Thông Minh Bách Khoa</p>
        </div>

        {/* Main Login Card */}
        <Card className="border-slate-700/80 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Tài khoản / Email / SĐT
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    placeholder="admin_super, cashier_01, student_2110001..."
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Mật khẩu
                  </label>
                  <a href="#" className="text-[11px] text-emerald-400 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full py-2.5 text-sm font-semibold" isLoading={isLoading}>
                Đăng Nhập Vào Hệ Thống
              </Button>
            </form>

            {/* Quick Demo Credentials Switcher */}
            <div className="pt-4 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 font-semibold mb-2 flex items-center gap-1.5 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Chọn tài khoản Demo kiểm thử:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin_super', '/admin/dashboard')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                >
                  <p className="text-xs font-semibold text-white">Quản Trị Viên</p>
                  <p className="text-[10px] text-emerald-400">admin_super</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('cashier_01', '/admin/pos')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                >
                  <p className="text-xs font-semibold text-white">Thu Ngân (POS)</p>
                  <p className="text-[10px] text-blue-400">cashier_01</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('chef_01', '/admin/kitchen')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                >
                  <p className="text-xs font-semibold text-white">Đầu Bếp (KDS)</p>
                  <p className="text-[10px] text-amber-400">chef_01</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('student_2110001', '/student/home')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                >
                  <p className="text-xs font-semibold text-white">Sinh Viên K21</p>
                  <p className="text-[10px] text-purple-400">student_2110001</p>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Badge Footer */}
        <div className="text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Hệ thống bảo mật chuẩn JWT + Role-Based Access Control</span>
        </div>
      </div>
    </div>
  );
};
