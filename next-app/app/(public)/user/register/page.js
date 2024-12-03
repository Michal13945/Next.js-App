"use client";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const { user } = useAuth();
  const router = useRouter();

  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered!");
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("Email verification sent!");
          router.push("/user/verify");
        });
      })
      .catch((error) => {
        setRegisterError(error.message);
        console.error(error);
      });
  };

  return (
    <section className="p-6 bg-gray-100 text-gray-900 flex items-center justify-center min-h-screen">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-md shadow-md space-y-6"
      >
        <h2 className="text-lg font-medium text-center">Register</h2>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-violet-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-violet-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-violet-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {registerError && (
          <p className="text-red-500 text-sm">{registerError}</p>
        )}

        <div>
          <button
            type="submit"
            className="w-full py-2 text-sm font-medium text-white bg-violet-500 rounded-md hover:bg-violet-600"
          >
            Register
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegisterForm;
