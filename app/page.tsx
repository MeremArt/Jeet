"use client";
import { useState } from "react";
import Logo from "./components/Logo";
import Timeline from "./components/Timeline";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist signup
  };

  return (
    <div className="min-h-screen bg-[#ECECEC]">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <Logo />
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between mt-16">
        <div className="max-w-[628px]">
          <h1 className="font-montserrat font-bold text-[56px] leading-[72px] text-[#121212] mb-6">
            <span className="text-[#E64A19]">Fastest</span> way to convert any
            token to Naira.
          </h1>
          <p className="font-montserrat font-medium text-lg text-[#121212] mb-8">
            Off ramp from your favourite wallet.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-[520px]"
          >
            <div className="flex-1 bg-[#121212] rounded px-4 py-5">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[#ECECEC] font-montserrat text-base placeholder:text-[#ECECEC] focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#E64A19] text-[#F5F5F5] font-montserrat text-base px-4 py-5 rounded hover:bg-[#d44315] transition-colors"
            >
              Join Waitlist
            </button>
          </form>
        </div>

        <div className="mt-16 lg:mt-0">
          <div className="relative">
            <img
              src="/placeholder.svg?height=594&width=388"
              alt="Paj.cash App Interface"
              className="w-[388px] h-[594px] object-contain"
            />
            <div className="absolute bottom-[-22px] left-1/2 transform -translate-x-1/2 w-[372px] h-[45px] bg-[#D9D9D9] rounded-full blur-lg" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#121212] mt-32">
        <div className="container mx-auto px-4 py-16">
          <Logo variant="light" />

          <div className="mt-16">
            <nav className="flex gap-40 mb-16">
              <a href="#" className="text-[#F5F5F5] font-montserrat text-base">
                About
              </a>
              <a href="#" className="text-[#F5F5F5] font-montserrat text-base">
                Legal
              </a>
            </nav>

            <Timeline />

            <div className="flex justify-between items-center mt-16">
              <p className="text-[#F5F5F5] font-montserrat font-medium text-base">
                © 2024, paj.cash | All Rights Reserved
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-[#F5F5F5] hover:text-[#E64A19] transition-colors"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#F5F5F5] hover:text-[#E64A19] transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#F5F5F5] hover:text-[#E64A19] transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
