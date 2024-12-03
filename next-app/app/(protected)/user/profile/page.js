"use client";

import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import LogoutForm from "../signout/logout";

export default function ProfileForm() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    updateProfile(user, {
      displayName: formData.displayName,
      photoURL: formData.photoURL,
    })
      .then(() => {
        console.log("Profile updated");
        router.push("/user/profileView");
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error updating profile:", error);
      });
  };

  return (
    <section className="p-6 bg-gray-100 text-gray-900 flex items-center justify-center min-h-screen flex-col">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md p-6 bg-white rounded-md shadow-md space-y-6"
      >
        <h2 className="text-lg font-medium text-center">Profile</h2>

        {/* Warunkowy alert o błędzie */}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Display Name Field */}
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700"
          >
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-violet-500"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            readOnly
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-violet-500"
          />
        </div>

        {/* Photo URL Field */}
        <div>
          <label
            htmlFor="photoURL"
            className="block text-sm font-medium text-gray-700"
          >
            Photo URL
          </label>
          <input
            id="photoURL"
            name="photoURL"
            type="url"
            value={formData.photoURL}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-violet-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 text-sm font-medium text-white bg-violet-500 rounded-md hover:bg-violet-600"
          >
            Update Profile
          </button>
        </div>
      </form>
      <div className="items-center pt-2">
        <LogoutForm />
      </div>
    </section>
  );
}
