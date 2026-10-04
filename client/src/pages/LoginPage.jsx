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
      email: location.state?.email || '',
      password: ''
    }
  });

  const currentEmail = watch('email');

  useEffect(() => {
    dispatch(clearAuthError());
    // Clear out any old saved keys or stale session artifacts
    try {
      localStorage.removeItem('saved_user_email');
    } catch (e) {}

    if (location.state?.email) {
      setValue('email', location.state.email);
    }
  }, [dispatch, location.state, setValue]);

  const onSubmit = async (data) => {
    dispatch(clearAuthError());

    const resultAction = await dispatch(
      loginUser({
        email: data.email.trim().toLowerCase(),
        password: data.password
      })
    );

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
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-black dark:text-[#faf5eb]">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-[#756d61] dark:text-[#a39b8e]">
          Sign in to your account to continue building your resume
        </p>
      </div>

      {location.state?.message && (
        <div className="rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 text-xs text-black dark:text-[#faf5eb] font-medium animate-in fade-in">
          {location.state.message}
        </div>
      )}

      {isUserNotFound ? (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 space-y-2.5 animate-in fade-in">
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            No account found with "{currentEmail || 'this email'}".
          </p>
          <button
            type="button"
            onClick={() =>
              navigate('/register', {
                state: { email: currentEmail }
              })
            }
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black p-2.5 text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Account with this Email</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : isInvalidPassword ? (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-3.5 space-y-2 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
          <p className="font-semibold">Incorrect password. Please verify your password and try again.</p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-1 font-semibold text-black dark:text-[#faf5eb] underline underline-offset-2 hover:opacity-80"
          >
            Forgot your password? Click here to reset it
          </Link>
        </div>
      ) : (
        error && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-3 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
            {error}
          </div>
        )
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-black dark:text-[#faf5eb]">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#756d61] hover:text-black dark:text-[#a39b8e] dark:hover:text-[#faf5eb] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#756d61] hover:text-black dark:text-[#a39b8e] dark:hover:text-[#faf5eb] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-3 py-3"
          isLoading={isLoading}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-[#756d61] dark:text-[#a39b8e] pt-4 border-t border-black/10 dark:border-white/10">
        Don't have an account yet?{' '}
        <Link
          to="/register"
          state={{ email: currentEmail }}
          className="font-bold text-black dark:text-[#faf5eb] hover:underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
