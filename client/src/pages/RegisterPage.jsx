import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/slices/authSlice.js';
import { showToast } from '../store/slices/uiSlice.js';
import { registerSchema } from '../schemas/authSchemas.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { User, Mail, Lock, UserPlus, LogIn, ArrowRight, Eye, EyeOff, Check, X, KeyRound, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const initialEmail = location.state?.email || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: initialEmail,
      password: '',
      confirmPassword: '',
      safetyPin: ''
    }
  });

  const enteredEmail = watch('email');
  const enteredPassword = watch('password') || '';
  const enteredConfirmPassword = watch('confirmPassword') || '';

  useEffect(() => {
    if (location.state?.email) {
      setValue('email', location.state.email);
    }
  }, [location.state, setValue]);

  // Strict password strength criteria checks
  const hasMinLength = enteredPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(enteredPassword);
  const hasLowercase = /[a-z]/.test(enteredPassword);
  const hasNumber = /[0-9]/.test(enteredPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(enteredPassword);

  const passedCriteriaCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const passwordsMatch = enteredPassword && enteredConfirmPassword && enteredPassword === enteredConfirmPassword;
  const passwordsMismatch = enteredConfirmPassword && enteredPassword !== enteredConfirmPassword;

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const resultAction = await dispatch(
      registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        safetyPin: data.safetyPin
      })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      dispatch(showToast({ message: 'Welcome to Careerly! Account created successfully.', type: 'success' }));
      navigate('/dashboard', { replace: true });
    }
  };

  const isEmailAlreadyRegistered =
    error &&
    (typeof error === 'string' &&
      (error.toLowerCase().includes('already registered') ||
        error.toLowerCase().includes('already in use') ||
        error.toLowerCase().includes('already exists')));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Create your account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Get started with free unlimited resumes and instant PDF export</p>
      </div>

      {isEmailAlreadyRegistered ? (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 space-y-2.5 animate-in fade-in">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
            This email address is already in use / registered!
          </p>
          <button
            type="button"
            onClick={() =>
              navigate('/login', {
                state: {
                  email: enteredEmail,
                  message: 'This email is already registered. Please sign in with your password.'
                }
              })
            }
            className="w-full flex items-center justify-center gap-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white p-2 text-xs font-semibold shadow-sm transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span>Go to Sign In with this Email</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
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
          label="Full Name"
          type="text"
          placeholder="Alex Morgan"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
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

          {/* Strict Password Requirement Checklist */}
          {enteredPassword && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                <span>Password Requirements:</span>
                <span className={passedCriteriaCount === 5 ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                  {passedCriteriaCount}/5 met
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1 ${hasUppercase && hasLowercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {hasUppercase && hasLowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  <span>Upper & lower case</span>
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  <span>At least 1 number</span>
                </div>
                <div className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {hasSpecial ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  <span>Special character (!@#$)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.confirmPassword?.message || (passwordsMismatch ? 'Passwords do not match' : null)}
            {...register('confirmPassword')}
          />
          {passwordsMatch && (
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Passwords match perfectly
            </p>
          )}
        </div>

        <div>
          <Input
            label="Safety PIN Code (4-6 Digits)"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 1234 or 849201"
            leftIcon={<KeyRound className="h-4 w-4" />}
            helperText="Choose a 4 to 6 digit PIN. You'll use this to easily reset your password anytime without email."
            error={errors.safetyPin?.message}
            {...register('safetyPin')}
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        Already have an account?{' '}
        <Link
          to="/login"
          state={{ email: enteredEmail }}
          className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
