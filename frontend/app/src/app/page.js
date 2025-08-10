'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

import "./globals.css";

export default function Home() {
  const handleBookNowClick = (vehicleId) => {
    alert(vehicleId ? `Book Now: ${vehicleId}` : "Find EVs clicked");
  };
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main id="home">
        {/* Hero Section */}
        <Hero />
        {/* Features Section */}
        <Features />
        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
