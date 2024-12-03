"use client";

import { useAuth } from "@/lib/AuthContext";

export default function ProfileView() {
  const { user } = useAuth();

  return (
    <section className="p-6 bg-gray-100 text-gray-900 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md space-y-6">
        <h2 className="text-lg font-medium text-center">Your Profile</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <p className="mt-1">{user.displayName || "No display name"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photo
          </label>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-32 h-32 rounded-full"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300"></div>
          )}
        </div>
      </div>
    </section>
  );
}
