"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
  });
  const [bankId, setBankId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch bankId from JWT in localStorage
  useEffect(() => {
    const bankId = localStorage.getItem("selectedBankId");
    if (bankId) {
      try {
        setBankId(bankId); // Assuming the `bankId` is stored in the JWT payload
      } catch (err) {
        console.error("Failed to decode JWT:", err);
        setError("Invalid token. Please log in again.");
      }
    } else {
      setError("No JWT found. Please log in.");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!bankId) {
      setError("Bank ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        "https://mainbackend-production-5606.up.railway.app/bank",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            bankId,
            accountNumber: formData.accountNumber,
            accountName: formData.accountName,
          }),
        }
      );
      localStorage.setItem("accountNumber", formData.accountNumber);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
        return;
      }

      // const responseData = await response.json();

      setSuccess(true);
      setFormData({
        accountNumber: "",
        accountName: "",
      });
      router.push("/connect");
    } catch (error) {
      setError("Failed to connect to the server. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-md rounded-lg p-6 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Link Your Bank Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              placeholder="Enter your account number"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full text-black p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">
              Account Name
            </label>
            <input
              type="text"
              name="accountName"
              placeholder="Enter your account name"
              value={formData.accountName}
              onChange={handleInputChange}
              className="w-full text-black p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-700 border border-red-300 p-3 rounded-md text-sm mb-4"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 text-green-700 border border-green-300 p-3 rounded-md text-sm mb-4"
            >
              Bank account linked successfully!
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-6 w-full bg-blue-500 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 transition-all"
          >
            Link Account
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
