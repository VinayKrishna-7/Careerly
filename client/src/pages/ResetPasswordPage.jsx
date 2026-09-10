import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { authApi } from '../services/authApi.js';
import { showToast } from '../store/slices/uiSlice.js';
import { checkAuth } from '../store/slices/authSlice.js';
import { resetPasswordSchema } from '../schemas/authSchemas.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await authApi.resetPassword(token, data.password);
      await dispatch(checkAuth());
      dispatch(showToast({ message: 'Password reset successfully!', type: 'success' }));
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired password reset token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-display font-bold text-slate-900">Set New Password</h2>
        <p className="text-xs text-slate-500">Create a secure new password for your account</p>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          placeholder="At least 6 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Reset Password & Sign In
        </Button>

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
