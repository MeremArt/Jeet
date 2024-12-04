"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Updated interface to match the actual API response
interface Bank {
  id: string;
  code: string;
  country: string;
  logo: string;
  name: string;
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
      localStorage.setItem("selectedBankId", bankId);
      router.push("/createbank");
    } catch (error) {
      console.error("Error saving bank selection:", error);
      setError("Failed to save bank selection. Please try again.");
    }
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          "https://mainbackend-production-5606.up.railway.app/bank",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched banks:", data); // Debug log

        // Validate and transform the data
        const validBanks = data.filter(
          (bank: Bank) => bank.id && bank.name && bank.logo
        );

        setBanks(validBanks);
        setFilteredBanks(validBanks);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching banks:", err);
        setError(
          err.message || "Failed to load banks. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchBanks();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Banks
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Select Your Bank
          </h1>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for your bank..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          {filteredBanks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No banks found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {filteredBanks.map((bank) => (
                <motion.div
                  key={bank.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleBankSelection(bank.id)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.onerror = null;
                        imgElement.src = "/fallback-bank-logo.png";
                      }}
                    />
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {bank.name}
                      </h2>
                      <p className="text-sm text-gray-500">{bank.code}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
