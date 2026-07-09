import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAdmin, isAdminAuthed } from '@/lib/admin';
import { cn } from '@/lib/utils';

const inputCls =
  'bg-white dark:bg-white/10 text-gray-900 dark:text-white border-gray-300 dark:border-white/15 placeholder:text-gray-400 dark:placeholder:text-gray-500';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAdminAuthed()) {
    navigate('/admin/roadmap', { replace: true });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (loginAdmin(username, password)) {
      navigate('/admin/roadmap', { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </button>

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aicc-purple to-aicc-violet flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Access
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign in to edit the roadmap data.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className={inputCls}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className={cn(inputCls, 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full btn-gradient text-white">
              <LogIn className="w-4 h-4" />
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
