"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Account() {
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();

  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch accountNumber from local storage
  useEffect(() => {
    const storedAccountNumber = localStorage.getItem("accountNumber");
    if (storedAccountNumber) {
      setAccountNumber(storedAccountNumber);
    } else {
      setError("No account number found. Please log in again.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!publicKey) {
      setError("Wallet is not connected. Please connect your wallet.");
      return;
    }

    if (!accountNumber) {
      setError("Account number is missing. Please log in again.");
      return;
    }

    try {
      const payload = {
        publicKey: publicKey.toBase58(),
        accountNumber,
        timestamp: Date.now(),
      };

      // Sign the payload
      const encodedPayload = new TextEncoder().encode(JSON.stringify(payload));
      const signature = await signMessage!(encodedPayload);

      const response = await fetch(
        "https://mainbackend-production-5606.up.railway.app/account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            payload,
            signature: Buffer.from(signature).toString("base64"),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
        return;
      }

      setSuccess(true);
      router.push("/bank");
    } catch (error) {
      setError("Failed to connect to the server. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-md rounded-lg p-6 max-w-md w-full"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            🚀 You&apos;re almost there—link your wallet to finish up
          </h1>
          <div className="flex items-center justify-center mb-6">
            <WalletMultiButton />
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
              Account successfully linked!
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-500 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 transition-all"
          >
            Link Wallet
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
