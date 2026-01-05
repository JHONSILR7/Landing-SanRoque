"use client";
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import ProductMenu from '@/components/landing/ProductMenu';
import AboutUs from '@/components/landing/AboutUs';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import ChatBot from '@/components/ChatBot';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-20">
      <Header />
      <Hero />
      <ProductMenu />
      <AboutUs />
      <Contact />
      <Footer />
      <ChatBot />
    </main>
  );
}