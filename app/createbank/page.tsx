"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accountNumber: "",
  });
  const [bankId, setBankId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validatedAccount, setValidatedAccount] = useState<{
    accountName: string;
    accountNumber: string;
    bank: {
      id: string;
      name: string;
      logo: string;
      code: string;
      country: string;
    };
  } | null>(null);

  useEffect(() => {
    const bankId = localStorage.getItem("selectedBankId");
    if (bankId) {
      try {
        setBankId(bankId);
      } catch (err) {
        console.error("Failed to decode JWT:", err);
        setError("Invalid token. Please log in again.");
      }
    } else {
      setError("No JWT found. Please log in.");
    }
  }, []);

  const validateAccountNumber = async (accountNumber: string) => {
    if (!bankId) return;

    setIsValidating(true);
    setError(null);

    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(
        `https://mainbackend-production-5606.up.railway.app/bank-account/confirm?bankId=${bankId}&accountNumber=${accountNumber}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to validate account");
      }

      const data = await response.json();
      setValidatedAccount(data);
      setIsValidating(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        "Failed to validate account number. Please check your account number and try again."
      );
      setIsValidating(false);
      setValidatedAccount(null);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "accountNumber" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "accountNumber" && value.length === 10) {
      await validateAccountNumber(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    if (!bankId) {
      setError("Bank ID is missing. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    if (!validatedAccount) {
      setError("Please enter a valid account number");
      setIsSubmitting(false);
      return;
    }

    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(
        "https://mainbackend-production-5606.up.railway.app/bank-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            bankId,
            accountNumber: validatedAccount.accountNumber,
            accountName: validatedAccount.accountName,
          }),
        }
      );

      if (!response.ok) {
        console.log(response);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to link account");
      }

      setSuccess(true);
      setFormData({
        accountNumber: "",
      });
      localStorage.setItem("accountNumber", validatedAccount.accountNumber);
      router.push("/connect");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to link account. Please try again."
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
              maxLength={10}
              pattern="\d*"
              className="w-full text-black p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            {isValidating && (
              <p className="text-blue-600 text-sm mt-1">
                Validating account...
              </p>
            )}
          </div>

          {validatedAccount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-50 border border-blue-300 p-3 rounded-md mb-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={validatedAccount.bank.logo}
                  alt={validatedAccount.bank.name}
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <p className="text-blue-700 font-medium">
                    {validatedAccount.bank.name}
                  </p>
                  <p className="text-blue-600 text-sm">
                    {validatedAccount.accountName}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
            disabled={!validatedAccount || isValidating || isSubmitting}
            className={`mt-6 w-full p-3 rounded-md shadow-lg transition-all ${
              !validatedAccount || isValidating || isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isSubmitting
              ? "Linking Account..."
              : isValidating
              ? "Validating..."
              : "Link Account"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
