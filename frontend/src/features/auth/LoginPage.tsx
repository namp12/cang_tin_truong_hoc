import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { dnuStore } from '../../services/dnuStore.js';
import { Button } from '../../components/ui/Button.js';
import { Card, CardContent } from '../../components/ui/Card.js';
import { 
  UtensilsCrossed, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'locked') {
      setErrorMessage('Tài khoản của bạn vừa bị Khóa bởi Quản trị viên. Phiên làm việc đã kết thúc.');
    } else if (reason === 'deleted') {
      setErrorMessage('Tài khoản của bạn đã bị Xóa khỏi hệ thống.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập / email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(credential.trim(), password);
      // Smart Role-Based Redirection
      const lower = credential.toLowerCase();
      if (lower.includes('student') || /^\d{7,10}$/.test(lower)) {
        navigate('/student/home');
      } else if (lower.includes('cashier')) {
        navigate('/admin/pos');
      } else if (lower.includes('chef') || lower.includes('kitchen')) {
        navigate('/admin/kitchen');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const allUsers = dnuStore.getUsers();
      const studentUser = allUsers.find(
        (u) => u.role === 'STUDENT' || u.username.includes('student')
      );
      if (!studentUser) {
        throw new Error('Tài khoản sinh viên không tồn tại hoặc đã bị xóa khỏi hệ thống.');
      }
      if (studentUser.status === 'LOCKED') {
        throw new Error(`Tài khoản sinh viên (${studentUser.username}) đã bị Khóa bởi Quản trị viên.`);
      }
      // Simulate Google DNU SSO Authentication
      await login(studentUser.username, 'Password@123');
      navigate('/student/home');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể xác thực tài khoản Google DNU');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
      <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-500 items-center justify-center text-white shadow-xl shadow-orange-500/25 ring-4 ring-orange-500/20">
            <UtensilsCrossed className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">DNU SMART CANTEEN</h1>
          <p className="text-xs text-slate-300 font-medium">
            Hệ Thống Quản Lý Căng Tin Thông Minh — Trường Đại Học Đại Nam
          </p>
        </div>

        {/* Main Login Card */}
        <Card className="border-slate-800/80 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Tài khoản / Email DNU / Mã SV
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    placeholder="Nhập username, MSSV hoặc email @dainam.edu.vn"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Mật khẩu
                  </label>
                  <a href="#" className="text-[11px] text-orange-400 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-orange-500 focus:ring-orange-500"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20"
                isLoading={isLoading}
              >
                Đăng Nhập
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-semibold">Hoặc</span>
              </div>
            </div>

            {/* Google DNU Single Sign-On Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Đăng nhập với Email DNU (@dainam.edu.vn)</span>
            </button>

            {/* Register Link for Students */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Chưa có tài khoản sinh viên?{' '}
                <Link to="/auth/register" className="text-orange-400 hover:underline font-bold">
                  Đăng ký tài khoản ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Badge & Subtle Hint */}
        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hệ thống bảo mật chuẩn JWT & Xác thực đa tầng DNU</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Mật khẩu mặc định hệ thống: <span className="font-mono text-slate-400">Password@123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
