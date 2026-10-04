import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../store/slices/authSlice.js';
import { showToast, setTheme } from '../store/slices/uiSlice.js';
import { profileSchema } from '../schemas/authSchemas.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';
import { User, Mail, Lock, Shield, Sparkles, Sun, Moon, KeyRound, Eye, EyeOff } from 'lucide-react';
import { getInitials } from '../utils/formatters.js';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const currentTheme = useSelector((state) => state.ui.theme);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      jobTitle: user?.jobTitle || '',
      avatar: user?.avatar || '',
      safetyPin: '',
      currentPassword: '',
      newPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setIsUpdating(true);
    const cleanPayload = {
      name: data.name,
      jobTitle: data.jobTitle,
      avatar: data.avatar
    };

    if (data.safetyPin) {
      cleanPayload.safetyPin = data.safetyPin;
    }

    if (data.newPassword) {
      cleanPayload.currentPassword = data.currentPassword;
      cleanPayload.newPassword = data.newPassword;
    }

    const action = await dispatch(updateUserProfile(cleanPayload));
    setIsUpdating(false);

    if (updateUserProfile.fulfilled.match(action)) {
      dispatch(showToast({ message: 'Profile updated successfully!', type: 'success' }));
      reset({
        name: action.payload.name,
        jobTitle: action.payload.jobTitle || '',
        avatar: action.payload.avatar || '',
        safetyPin: '',
        currentPassword: '',
        newPassword: ''
      });
    } else {
      dispatch(showToast({ message: action.payload || 'Failed to update profile', type: 'error' }));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, appearance, and account credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Overview */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-4 shadow-card">
            <div className="relative mx-auto h-24 w-24 rounded-full bg-brand-600 flex items-center justify-center text-2xl font-bold text-white shadow-md overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              {user?.jobTitle && (
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1">
                  {user.jobTitle}
                </p>
              )}
            </div>
          </div>

          {/* Appearance / Theme Settings Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-card">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Appearance
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => dispatch(setTheme('light'))}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  currentTheme === 'light'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => dispatch(setTheme('dark'))}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  currentTheme === 'dark'
                    ? 'border-brand-500 bg-slate-800 text-white font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Update Form */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Profile Details
                </h4>

                <Input
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Professional Title"
                  placeholder="e.g. Senior Software Engineer"
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  error={errors.jobTitle?.message}
                  {...register('jobTitle')}
                />

                <Input
                  label="Email Address"
                  disabled
                  value={user?.email || ''}
                  leftIcon={<Mail className="h-4 w-4" />}
                  helperText="Email cannot be changed directly"
                />

                <Input
                  label="Avatar Image URL (Optional)"
                  placeholder="https://example.com/avatar.jpg"
                  error={errors.avatar?.message}
                  {...register('avatar')}
                />
              </div>

              {/* Password Change */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-brand-600" />
                  <span>Change Password</span>
                </h4>

                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.currentPassword?.message}
                  {...register('currentPassword')}
                />

                <Input
                  label="New Password"
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.newPassword?.message}
                  {...register('newPassword')}
                />

                <Input
                  label="Safety PIN Code (4-6 Digits)"
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Leave blank to keep unchanged"
                  leftIcon={<KeyRound className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  helperText="Your 4-6 digit recovery PIN for instant password resets without email."
                  error={errors.safetyPin?.message}
                  {...register('safetyPin')}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" size="md" isLoading={isUpdating}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
