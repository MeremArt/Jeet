import React from "react";

export default function Header() {
  return (
    <header className="px-20 py-10 flex flex-col md:flex-row gap-5 items-start">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Paj.cash</h1>

        <div className="max-w-md mb-8">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-[#FF5722]">Fastest</span> way to convert any
            token to Naira.
          </h2>
          <p className="text-gray-600">Off ramp from your favourite wallet.</p>
        </div>

        <form className="flex gap-4 max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-black text-white rounded"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#FF5722] text-white rounded hover:bg-[#F4511E] transition-colors"
          >
            Join Waitlist
          </button>
        </form>
      </div>

      <div className="relative w-[300px] h-[600px]">
        <img
          src="/placeholder.svg?height=600&width=300"
          alt="Paj.cash mobile app interface"
          className="w-full h-full object-contain"
        />
      </div>
    </header>
  );
}
