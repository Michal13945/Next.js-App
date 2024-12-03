"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function VerifyEmail() {
  const { user } = useAuth();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email);

      signOut(auth)
        .then(() => {
          console.log("User logged out after email verification prompt");
        })
        .catch((error) => {
          console.error("Error during sign out:", error);
        });
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full max-w-lg p-6 bg-white rounded-md shadow-md space-y-6">
        <h1 className="text-xl font-semibold text-center text-gray-700">
          Email not verified.
        </h1>
        <p className="text-center text-gray-600">
          Please verify your email by clicking on the link sent to your email
          address: <strong>{email}</strong>
        </p>
        <p className="text-center text-sm text-gray-500">
          You will be logged out automatically to complete the verification.
        </p>
      </div>
    </div>
  );
}
