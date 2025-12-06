"use client";

import { useEffect, useState } from "react";
import { buyerService } from "@/services/buyer.service";

export default function BuyerMePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    buyerService
      .getProfile()
      .then(setProfile)
      .catch((err) => console.error("Error:", err.message));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Buyer Profile</h1>

      <div className="mt-4">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
}
