import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../models/Auth';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';


export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error, clearError, isAuthenticated } = useAuth();

    const navigate = useNavigate();
   
     const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data) => {
    const loginRequest = new LoginRequest(data.usernameOrEmail, data.password);
    const success = await login(loginRequest);
    
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };



  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to your KvizHub account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Username or Email
          </label>
          <input
            id="usernameOrEmail"
            type="text"
            className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
              errors.usernameOrEmail 
                ? 'border-red-500 focus-visible:ring-red-500' 
                : 'border-gray-300 bg-white focus-visible:ring-blue-500 focus-visible:border-blue-500'
            }`}
            placeholder="Enter your username or email"
            {...register('usernameOrEmail', {
              required: 'Username or email is required',
              minLength: {
                value: 3,
                message: 'Must be at least 3 characters'
              }
            })}
          />
          {errors.usernameOrEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.usernameOrEmail.message}</p>
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
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
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

       <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md h-10 px-4 py-2 w-full gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-4 w-4"></div>
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      
    </div>
  )
}
