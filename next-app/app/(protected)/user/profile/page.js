"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import LogoutForm from "../signout/logout";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfileForm() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
    city: "",
    street: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData((prevData) => ({
              ...prevData,
              city: data.address?.city || "",
              street: data.address?.street || "",
              zipCode: data.address?.zipCode || "",
            }));
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Aktualizacja danych profilu użytkownika w Firebase Auth
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      // Aktualizacja danych adresu w Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          address: {
            city: formData.city,
            street: formData.street,
            zipCode: formData.zipCode,
          },
        },
        { merge: true }
      );

      console.log("Profile updated");
      router.push("/user/profileView");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <section className="p-6 bg-gray-100 text-gray-900 flex items-center justify-center min-h-screen flex-col">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md p-6 bg-white rounded-md shadow-md space-y-6"
      >
        <h2 className="text-lg font-medium text-center">Profile</h2>

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

        {/* City Field */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-violet-500"
          />
        </div>

        {/* Street Field */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700"
          >
            Street
          </label>
          <input
            id="street"
            name="street"
            type="text"
            value={formData.street}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-violet-500"
          />
        </div>

        {/* Zip Code Field */}
        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-gray-700"
          >
            Zip Code
          </label>
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={handleChange}
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
