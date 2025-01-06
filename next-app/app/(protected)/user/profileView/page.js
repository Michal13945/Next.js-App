"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import LogoutForm from "../signout/logout";

export default function ProfileView() {
  const { user } = useAuth();
  const [address, setAddress] = useState({
    city: "",
    street: "",
    zipCode: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (user) {
          const snapshot = await getDoc(doc(db, "users", user.uid));
          if (snapshot.exists()) {
            const addressData = snapshot.data().address || {};
            setAddress({
              city: addressData.city || "No display city",
              street: addressData.street || "No display street",
              zipCode: addressData.zipCode || "No display zipCode",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user address:", error);
      }
    };
    fetchAddress();
  }, [user]);

  const EditProfile = () => {
    router.push("/user/profile");
  };

  return (
    <section className="bg-gray-100 text-gray-900 flex items-center justify-center min-h-5">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Your Profile
        </h2>

        <div className="flex justify-center">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="rounded-full ring-4 ring-offset-4 ring-violet-600"
              width={120}
              height={120}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300"></div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <p className="mt-1 text-lg">
              {user?.displayName || "No display name"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-lg">
              {user?.email || "No email available"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <p className="mt-1 text-lg">{address.city}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street
            </label>
            <p className="mt-1 text-lg">{address.street}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Zip Code
            </label>
            <p className="mt-1 text-lg">{address.zipCode}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <button
              className="w-full px-8 py-3 text-sm font-semibold text-white bg-violet-600 rounded-md hover:bg-violet-700"
              onClick={EditProfile}
            >
              Edit Profile
            </button>
          </div>
          <div className="items-center pt-2">
            <LogoutForm />
          </div>
        </div>
      </div>
    </section>
  );
}
