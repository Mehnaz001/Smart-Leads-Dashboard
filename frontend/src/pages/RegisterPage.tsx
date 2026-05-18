import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User } from 'lucide-react';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await authApi.register(form);
      if (res.data.success && res.data.data) {
        setAuth(res.data.data.user, res.data.data.token);
        toast.success('Account created!');
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-DEFAULT flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">SmartLeads</span>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-6">Get started with SmartLeads</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" placeholder="Rahul Sharma" value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              error={errors.name} icon={<User size={15} />} />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={errors.email} icon={<Mail size={15} />} />
            <Input label="Password" type="password" placeholder="Min 6 characters" value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              error={errors.password} icon={<Lock size={15} />} />
            <Select label="Role" value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              options={[{ value: 'sales', label: 'Sales User' }, { value: 'admin', label: 'Admin' }]} />
            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
