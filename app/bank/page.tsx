"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Bank {
  _id: string;
  code: string;
  country: string;
  createdAt: string;
  logo: string;
  name: string;
  updatedAt: string;
}

export default function BankSelection() {
  const router = useRouter();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = banks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(query) ||
          bank.country.toLowerCase().includes(query) ||
          bank.code.toLowerCase().includes(query)
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks(banks);
    }
  };

  const handleBankSelection = (bankId: string) => {
    try {
      // Store the selected bank ID in localStorage
      localStorage.setItem("selectedBankId", bankId);

      // Navigate to the next page (adjust the route as needed)
      router.push("/createbank");
    } catch (error) {
      console.error("Error saving bank selection:", error);
    }
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          // Redirect to login if no token is found
          router.push("/login");
          return;
        }

        const response = await fetch(
          "https://mainbackend-production-5606.up.railway.app/bank",
          {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Bank[] = await response.json();

        // Validate bank data
        const validBanks = data.filter(
          (bank) => bank._id && bank.name && bank.logo
        );

        setBanks(validBanks);
        setFilteredBanks(validBanks);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(
          err.message || "Failed to load banks. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchBanks();
  }, [router]);

  const renderLoading = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-lg font-bold flex items-center"
      >
        <svg
          className="animate-spin h-5 w-5 mr-3 text-purple-500"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading banks...
      </motion.div>
    </div>
  );

  const renderError = () => (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );

  const renderBankList = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Select Your Bank
        </h1>
        <input
          type="text"
          placeholder="Search for your bank (name, country, code)..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
        />
        {filteredBanks.length === 0 ? (
          <p className="text-center text-gray-500">No banks found</p>
        ) : (
          <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
            {filteredBanks.map((bank) => (
              <motion.li
                key={bank._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-gray-100 rounded-md shadow-sm cursor-pointer hover:bg-gray-200"
                onClick={() => handleBankSelection(bank._id)}
              >
                <img
                  src={bank.logo}
                  alt={bank.name}
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.onerror = null;
                    imgElement.src = "/fallback-bank-logo.png";
                  }}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    {bank.name}
                  </h2>
                  <p className="text-gray-500 text-sm">{bank.country}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );

  if (loading) return renderLoading();
  if (error) return renderError();

  return renderBankList();
}
