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
    <div className="flex flex-col items-center m-auto max-w-md p-6 rounded-md sm:p-10 bg-white text-gray-800 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-4xl font-bold">Register</h1>
        <p className="text-sm text-gray-600">Create a new account</p>
      </div>

      {registerError && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{registerError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-12 w-full">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm text-gray-600">
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-2 text-sm text-gray-600"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <button
              type="submit"
              className="w-full py-3 text-sm font-semibold rounded-md bg-violet-600 text-gray-50 hover:bg-violet-700 focus:ring-2 focus:ring-violet-500"
            >
              Register
            </button>
          </div>

          <p className="px-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a
              rel="noopener noreferrer"
              href="/user/signin"
              className="hover:underline text-violet-600"
            >
              Sign in
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
