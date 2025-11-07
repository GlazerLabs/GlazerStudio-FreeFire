'use client';

import useAuthStore from '@/store/useAuthStore';
import React, { useState } from 'react';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearError } = useAuthStore();

  const handleSubmit = (event) => {
    event.preventDefault();
    login(email.trim(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-black text-white mb-6 text-center">
          Live Scoring Login
        </h1>

        <label className="block text-slate-300 text-sm font-semibold mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) clearError();
          }}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter your email"
          required
        />

        <label className="block text-slate-300 text-sm font-semibold mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) clearError();
          }}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter your password"
          required
        />

        {error && (
          <p className="text-red-400 text-sm font-semibold mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;