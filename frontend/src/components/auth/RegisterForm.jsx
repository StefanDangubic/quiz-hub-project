import React, { useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {RegisterRequest} from '../../models/Auth';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../common/ImageUpload';




export default function RegisterForm() {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [profileImage, setProfileImage] = useState(null);
   const { register: registerUser, loading, error, clearError } = useAuth();
   const navigate = useNavigate();



   const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data) => {
    const registerRequest = new RegisterRequest({
      ...data,
      profileImage
    });
    const success = await registerUser(registerRequest);
    
    if (success) {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    }
  };



  return (  
     
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 mt-2">Join QuizHub today</p>
      </div>
       
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
         {/* Profile Image Upload */}
        <div className="flex justify-center">
          <ImageUpload
            currentImage={profileImage}
            onImageChange={setProfileImage}
            type="profile"
            size="lg"
          />
        </div>
        
          <div>
           <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
             Username
           </label>
           <input
            id="username"
            type="text"
            className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
              errors.username 
                ? 'border-red-500 focus-visible:ring-red-500' 
                : 'border-gray-300 bg-white focus-visible:ring-blue-500 focus-visible:border-blue-500'
            }`}
            placeholder="Choose a username"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              maxLength: {
                value: 50,
                message: 'Username must be less than 50 characters'
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
              }
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

            <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
              errors.email 
                ? 'border-red-500 focus-visible:ring-red-500' 
                : 'border-gray-300 bg-white focus-visible:ring-blue-500 focus-visible:border-blue-500'
            }`}
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`flex h-10 w-full rounded-lg border px-3 py-2 pr-10 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
                errors.password 
                  ? 'border-red-500 focus-visible:ring-red-500' 
                  : 'border-gray-300 bg-white focus-visible:ring-blue-500 focus-visible:border-blue-500'
              }`}
              placeholder="Create a password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
                }
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`flex h-10 w-full rounded-lg border px-3 py-2 pr-10 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
                errors.confirmPassword 
                  ? 'border-red-500 focus-visible:ring-red-500' 
                  : 'border-gray-300 bg-white focus-visible:ring-blue-500 focus-visible:border-blue-500'
              }`}
              placeholder="Confirm your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md h-10 px-4 py-2 w-full gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-4 w-4"></div>
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        </form>

        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:text-blue-800 font-medium transition-colors '>
            Sign in
            </Link>
          </p>
        </div>

















      </div>

     
  );
};
