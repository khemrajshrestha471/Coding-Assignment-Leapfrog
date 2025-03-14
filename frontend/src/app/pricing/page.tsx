"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import { sonner } from "@/components/ui/sonner";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Simple Pricing for <span className="text-blue-600">Everyone</span>
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Choose a plan that fits your needs. Start for free, upgrade anytime.
        </p>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border rounded-lg shadow-sm bg-white">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Free</h3>
            <p className="text-5xl font-bold text-blue-600 mb-4">$0</p>
            <p className="text-gray-600 mb-6">Perfect for individuals</p>
            <ul className="text-gray-600 mb-8">
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Basic note-taking
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                1GB storage
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Sync across 2 devices
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Perform CRUD
              </li>
            </ul>
            <button
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg mb-6 hover:bg-blue-700 cursor-pointer"
              onClick={() =>
                sonner.success(
                  <span className="text-green-500">
                    Congratulations! Your features has been activated.
                  </span>
                )
              }
            >
              Get Started
            </button>
          </div>

          <div className="p-8 border rounded-lg shadow-sm bg-blue-50">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pro</h3>
            <p className="text-5xl font-bold text-blue-600 mb-4">$9/month</p>
            <p className="text-gray-600 mb-6">For power users</p>
            <ul className="text-gray-600 mb-8">
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Advanced features
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                10GB storage
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Sync across unlimited devices
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Priority support
              </li>
            </ul>
            <button
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg mb-6 hover:bg-blue-700 cursor-pointer"
              onClick={() =>
                sonner.success(
                  <span className="text-green-500">
                    Congratulations! Your features has been activated.
                  </span>
                )
              }
            >
              Purchase Now
            </button>
          </div>

          <div className="p-8 border rounded-lg shadow-sm bg-blue-50">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Team</h3>
            <p className="text-5xl font-bold text-blue-600 mb-4">$25/month</p>
            <p className="text-gray-600 mb-6">For teams and collaboration</p>
            <ul className="text-gray-600 mb-8">
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Shared workspaces
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                50GB storage
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Advanced collaboration tools
              </li>
              <li className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Dedicated account manager
              </li>
            </ul>
            <button
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg mb-6 hover:bg-blue-700 cursor-pointer"
              onClick={() =>
                sonner.success(
                  <span className="text-green-500">
                    Congratulations! Your features has been activated.
                  </span>
                )
              }
            >
              Purchase Now
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-gray-900">
                    Feature
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-center text-gray-900">
                    Free
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-center text-gray-900">
                    Pro
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-center text-gray-900">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 border-b border-gray-200 text-left">
                    Basic Note-Taking
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-gray-200 text-left">
                    Cloud Sync
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-gray-200 text-left">
                    Advanced Features
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ❌
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-gray-200 text-left">
                    Collaboration Tools
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ❌
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-gray-200 text-left">
                    Priority Support
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ❌
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    ✅
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
