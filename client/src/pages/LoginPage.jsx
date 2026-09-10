import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../store/slices/authSlice.js';
import { showToast } from '../store/slices/uiSlice.js';
import { loginSchema } from '../schemas/authSchemas.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const initialEmail = location.state?.email || localStorage.getItem('saved_user_email') || '';
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: initialEmail,
      password: ''
    }
  });

  const currentEmail = watch('email');

  useEffect(() => {
    if (location.state?.email) {
      setValue('email', location.state.email);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data) => {
    dispatch(clearAuthError());

    if (rememberMe) {
      localStorage.setItem('saved_user_email', data.email);
    } else {
      localStorage.removeItem('saved_user_email');
    }

    const resultAction = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(resultAction)) {
      dispatch(showToast({ message: 'Welcome back! Signed in successfully.', type: 'success' }));
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  const isUserNotFound =
    error &&
    typeof error === 'string' &&
    (error.toLowerCase().includes('no account found') || error.toLowerCase().includes('user not found'));

  const isInvalidPassword =
    error &&
    typeof error === 'string' &&
    (error.toLowerCase().includes('incorrect password') || error.toLowerCase().includes('invalid password'));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Welcome Back</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to your account to continue building your resume</p>
      </div>

      {location.state?.message && (
        <div className="rounded-lg bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 p-3 text-xs text-brand-700 dark:text-brand-300 font-medium animate-in fade-in">
          {location.state.message}
        </div>
      )}

      {isUserNotFound ? (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 space-y-2.5 animate-in fade-in">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
            No account found with "{currentEmail || 'this email'}".
          </p>
          <button
            type="button"
            onClick={() =>
              navigate('/register', {
                state: { email: currentEmail }
              })
            }
            className="w-full flex items-center justify-center gap-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white p-2 text-xs font-semibold shadow-sm transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Account with this Email</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : isInvalidPassword ? (
        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 space-y-2 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
          <p className="font-semibold">Incorrect password. Please verify your password and try again.</p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Forgot your password? Click here to reset it
          </Link>
        </div>
      ) : (
        error && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
            {error}
          </div>
        )
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Remember email</span>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        Don't have an account yet?{' '}
        <Link
          to="/register"
          state={{ email: currentEmail }}
          className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
