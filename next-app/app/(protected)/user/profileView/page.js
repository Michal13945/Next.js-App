"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileView() {
  const { user } = useAuth();
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      if (user) {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        const addressData = snapshot.data().address;
        setAddress({
          city: addressData.city,
          street: addressData.street,
          zipCode: addressData.zipCode,
        });
      }
    };
    fetchAddress();
  });

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
            City
          </label>
          <p className="mt-1">{address.city || "No display city"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Street
          </label>
          <p className="mt-1">{address.street || "No display street"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Zip Code
          </label>
          <p className="mt-1">{address.zipCode || "No display zipCode"}</p>
        </div>
        <div className="grid place-items-center">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-40 h-35 rounded-full ring-2 ring-offset-4 ring-violet-800"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300"></div>
          )}
        </div>
      </div>
    </section>
  );
}
