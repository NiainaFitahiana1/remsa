// app/dashboard/account/page.tsx
"use client";

import { useState } from "react";

export default function AccountPage() {
  const [profileImage, setProfileImage] = useState<string>(
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBw86atv-bQ9tvskq5iJbzhSNiDKsbKzlpnK9FK9egFvDA5En4GXoXI6cCcM303TDfFlVgnPIXvx3WusCok7uNQnTryi15_AJ70KcyEC-jVupvCrLc5GCok37xx8rgMO3x9HVnI82jenUJp4ggSM4DPO3SirtLo1PJpzNhCdpl1tPvaJfiwaVZv4ikJ6DBsE3COA8k01ZB3oa4yVaCw-xEdr_2iPGySVROT7OQ4lDxl84k9i4_tNW786_ELvx9uTlKfD2IGnk7ASwI"
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white text-secondary pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
            Account Management
          </h1>
          <p className="mt-2 text-gray-600">
            Update your personal information, preferences and security settings
          </p>
        </div>

        {/* Section Profil principal */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full bg-center bg-cover border-4 border-primary/20 shadow-md"
                style={{ backgroundImage: `url(${profileImage})` }}
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary">Alex Thompson</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full">
                  Level 4 Courier
                </span>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <span className="material-symbols-outlined">check_circle</span>
                  Verified
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Member since</p>
                  <p className="font-medium">March 2024</p>
                </div>
                <div>
                  <p className="text-gray-500">Total deliveries</p>
                  <p className="font-medium">1,247</p>
                </div>
                <div>
                  <p className="text-gray-500">Average rating</p>
                  <p className="font-medium">4.92 ★</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Personal Information
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  defaultValue="Alex Thompson"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  defaultValue="alex.thompson@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>

              <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                Save Changes
              </button>
            </div>
          </div>

          {/* Véhicule & Préférences */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">directions_car</span>
                Vehicle Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
                    <option>Bicycle / E-bike</option>
                    <option>Motorcycle</option>
                    <option>Car</option>
                    <option>Van</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License plate (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="ABC-1234"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications</span>
                Notification Preferences
              </h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                  <span>Push notifications for new urgent requests</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                  <span>Email summary (weekly)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5 accent-primary" />
                  <span>SMS for high-priority deliveries</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8 mb-8">
          <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            Security & Login
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Protect your account with 2FA</p>
              </div>
              <button className="bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition">
                Enable 2FA
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button className="w-full sm:w-auto bg-destructive/10 text-destructive border border-destructive/30 px-8 py-3 rounded-lg font-medium hover:bg-destructive/20 transition">
                Sign out from all devices
              </button>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde global */}
        <div className="flex justify-end">
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-md">
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}