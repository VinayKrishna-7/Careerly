import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { authApi } from '../services/authApi.js';
import { checkAuth } from '../store/slices/authSlice.js';
import { showToast } from '../store/slices/uiSlice.js';
import { resetWithPinSchema } from '../schemas/authSchemas.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { Mail, Lock, KeyRound, ArrowLeft, Eye, EyeOff, Check, X, ShieldCheck, Sparkles } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialEmail = location.state?.email || localStorage.getItem('saved_user_email') || '';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetWithPinSchema),
    mode: 'onChange',
    defaultValues: {
      email: initialEmail,
      safetyPin: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const enteredEmail = watch('email');
  const enteredPassword = watch('newPassword') || '';
  const enteredConfirmPassword = watch('confirmNewPassword') || '';

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
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await authApi.resetPasswordWithPin({
        email: data.email,
        safetyPin: data.safetyPin,
        newPassword: data.newPassword
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        if (data.email) {
          localStorage.setItem('saved_user_email', data.email);
        }
      }

      await dispatch(checkAuth());
      dispatch(showToast({ message: 'Password reset successfully with your Safety PIN!', type: 'success' }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Please check your email and Safety PIN code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Reset Password</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your Safety PIN code to immediately reset your password with zero waiting
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Account Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Your Safety PIN Code (4-6 Digits)"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="e.g. 1234 or 849201"
          leftIcon={<KeyRound className="h-4 w-4" />}
          helperText="Enter the 4 to 6 digit Safety PIN code you selected when creating your account."
          error={errors.safetyPin?.message}
          {...register('safetyPin')}
        />

        <div>
          <Input
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.newPassword?.message}
            {...register('newPassword')}
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
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter new password"
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
            error={errors.confirmNewPassword?.message || (passwordsMismatch ? 'Passwords do not match' : null)}
            {...register('confirmNewPassword')}
          />
          {passwordsMatch && (
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Passwords match perfectly
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
          leftIcon={<ShieldCheck className="h-4 w-4" />}
        >
          Reset Password with Safety PIN
        </Button>

        <div className="text-center pt-2">
          <Link
            to="/login"
            state={{ email: enteredEmail }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
