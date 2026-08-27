import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { 
  UtensilsCrossed, 
  User, 
  Lock, 
  Mail, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState('Khoa Công Nghệ Thông Tin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsSuccess(true);
    setTimeout(async () => {
      await login(`student_${studentCode || '2110001'}`, 'Password@123');
      navigate('/student/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20 mx-auto">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">DNU SMART CANTEEN</h1>
          <p className="text-xs text-slate-300">Đăng ký tài khoản Sinh viên Đại Học Đại Nam</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl backdrop-blur-md">
          <CardContent className="p-6">
            {isSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white">Đăng Ký Thành Công!</h3>
                <p className="text-xs text-slate-300">
                  Tài khoản của bạn đã được kích hoạt và tự động liên kết với ví sinh viên <span className="text-orange-400 font-semibold">DNU Pay</span>.
                </p>
                <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <span>Đang chuyển hướng vào Cổng Sinh Viên</span>
                  <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mã Sinh Viên (MSSV) *</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={studentCode}
                        onChange={(e) => {
                          setStudentCode(e.target.value);
                          if (!email) setEmail(`${e.target.value}@dainam.edu.vn`);
                        }}
                        placeholder="VD: 2110001"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Khoa Viện</label>
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      aria-label="Chọn khoa viện DNU"
                      className="w-full px-2.5 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Khoa Công Nghệ Thông Tin">Khoa CNTT</option>
                      <option value="Khoa Dược">Khoa Dược</option>
                      <option value="Khoa Y Khoa">Khoa Y Khoa</option>
                      <option value="Khoa Quản Trị Kinh Doanh">Khoa QTKD</option>
                      <option value="Khoa Truyền Thông">Truyền Thông</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và tên sinh viên *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="VD: Nguyễn Thành Nam"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email sinh viên (@dainam.edu.vn) *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mssv@dainam.edu.vn"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nhập lại mật khẩu *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full py-2.5 font-bold bg-orange-600 hover:bg-orange-700 text-white mt-2">
                  Tạo Tài Khoản Sinh Viên
                </Button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Đã có tài khoản?{' '}
                    <Link to="/auth/login" className="text-orange-400 hover:underline font-semibold">
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
