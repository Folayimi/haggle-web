"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  MessageSquareText,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Heart,
  Star,
  Clock,
} from "lucide-react";

import {
  allLiveSessions,
  featuredProduct,
  featuredSeller,
  marketServices,
} from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const heroLive = allLiveSessions[0];
  const service = marketServices[0];

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-white to-orange-50 font-sans text-gray-900">
      <div className="relative">
        <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-green-500 text-white shadow-sm">
                <span className="text-sm font-bold">C</span>
              </div>
              <p className="text-xl font-bold tracking-tight text-green-800">
                Haggle<span className="text-orange-500">.</span>
              </p>
            </div>
            <nav className="hidden items-center gap-3 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-green-600 to-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
              >
                Create account
              </Link>
            </nav>
          </div>
        </header>

        <main>
          {/* Hero Section — Bold, vibrant, action-driven */}
          <section className="px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                  className="flex flex-col justify-center space-y-8"
                >
                  <motion.div
                    variants={fadeUp}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600"
                  >
                    <Sparkles className="h-4 w-4" />
                    Real-time negotiation. Zero friction.
                  </motion.div>
                  <motion.div variants={fadeUp} className="space-y-5">
                    <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                      Meet sellers live.
                      <br />
                      <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                        Negotiate in real time.
                      </span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
                      Haggle is the social marketplace where discovery, live rooms, and direct messaging come together. No more boring checkout — just real conversations and fair deals.
                    </p>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                    <Link
                      href="/signup"
                      className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-green-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                    >
                      Start buying and selling
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
                    >
                      Explore live rooms
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative z-0"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-800 to-green-600 p-1 shadow-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
                    <div className="relative rounded-3xl bg-white p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                          <img
                            src={heroLive.coverImageUrl}
                            alt={heroLive.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                              <span className="relative flex h-2 w-2">
                                <span className="absolute h-2 w-2 animate-ping rounded-full bg-red-400" />
                                <span className="relative h-2 w-2 rounded-full bg-red-600" />
                              </span>
                              LIVE
                            </span>
                            <span className="text-xs text-gray-500">
                              {heroLive.participantCount} watching
                            </span>
                          </div>
                          <h3 className="mt-2 text-lg font-bold text-gray-900">
                            {featuredProduct.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <img
                              src={featuredSeller.avatarUrl}
                              alt={featuredSeller.name}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-600">
                              {featuredSeller.name}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-gray-900">
                                {featuredProduct.price}
                              </span>
                              <span className="ml-1 text-xs text-gray-500">
                                current offer
                              </span>
                            </div>
                            <Link
                              href="/dashboard"
                              className="rounded-full bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 text-sm font-semibold text-white"
                            >
                              Join negotiation
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-rose-500" /> 24 offers
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500" /> 4.9 (2.3k)
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-green-500" /> 15 min left
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 z-10 hidden lg:block">
                    <div className="rounded-2xl bg-orange-500 p-3 text-white shadow-lg">
                      <p className="text-sm font-bold">No bots, no bids</p>
                      <p className="text-xs opacity-90">Real sellers. Real talks.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Trust Stats — Bold, colorful */}
          <section className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { value: "24K+", label: "buyers waiting in live rooms" },
                  { value: "9.8K", label: "tickets reserved this week" },
                  { value: "4.9/5", label: "seller trust rating across the app" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="group rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
                    style={{
                      borderBottom: `3px solid ${i === 0 ? "#ea580c" : i === 1 ? "#16a34a" : "#d97706"}`,
                    }}
                  >
                    <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features — Bold headings, bright cards */}
          <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                  Why it hits different
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">
                  Designed for both sides of <br/>the deal
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-gray-500">
                  Every feature is built to make bargaining feel social, warm, and impossible to scroll past.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Video,
                    title: "Immersive live feed",
                    description:
                      "Full-bleed discovery cards with real seller context instead of flat product grids.",
                    color: "orange",
                  },
                  {
                    icon: MessageSquareText,
                    title: "Direct seller messaging",
                    description:
                      "Text, voice notes, and shared product cards make follow-up feel personal.",
                    color: "green",
                  },
                  {
                    icon: Bell,
                    title: "Ticket reminders",
                    description:
                      "Reserve upcoming lives, get room reminders, and secure your spot before offers begin.",
                    color: "amber",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Trust-forward profiles",
                    description:
                      "Seller credibility, ratings, response time, and listings stay visible throughout.",
                    color: "orange",
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  const colorMap = {
                    orange: "text-orange-600 bg-orange-50 border-l-orange-500",
                    green: "text-green-600 bg-green-50 border-l-green-500",
                    amber: "text-amber-600 bg-amber-50 border-l-amber-500",
                  };
                  const colorClass = colorMap[feature.color as keyof typeof colorMap];

                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -6 }}
                      className={`group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md`}
                    >
                      <div className={`inline-flex rounded-lg p-3 ${colorClass}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Buyer & Seller Flows — Color blocked */}
          <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
              <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-full bg-orange-100 p-3 text-orange-600">
                  <Users className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Buyer energy
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                  Scroll, save, reserve, then bargain when the room opens.
                </h2>
                <div className="mt-6 space-y-3">
                  {[
                    "Browse lives, products, and services in one warm discovery loop.",
                    "Freeze the seller feed, capture references, and send them into room chat.",
                    "Jump from a live room into private messages without losing trust context.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl bg-white/80 p-4 text-sm leading-relaxed text-gray-700 shadow-sm backdrop-blur-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="group rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
                  Seller studio
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                  Build listings, style your room, and host with confidence.
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: "Post products",
                      text: "Draft premium listings with negotiation notes and highlights.",
                    },
                    {
                      title: "Add services",
                      text: "Sell creative work, repairs, consultations, and sessions.",
                    },
                    {
                      title: "Schedule lives",
                      text: "Promote reminder-worthy sessions with angles buyers actually care about.",
                    },
                    {
                      title: "Style the room",
                      text: "Choose calm, focus, or warm vibes before going live.",
                    },
                  ].map((card) => (
                    <div key={card.title} className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                      <h3 className="font-bold text-gray-900">{card.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{card.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Featured Service — Bright spotlight */}
          <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-orange-50 p-8">
                  <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                    Featured service
                  </p>
                  <h2 className="mt-2 text-3xl font-black">Premium seller onboarding</h2>
                  <p className="mt-4 text-gray-600">
                    {service.description ||
                      "Get your storefront optimized, live room designed, and first 10 sales guaranteed within 30 days."}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.includes.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">{service.price}</span>
                    <Link
                      href="/signup"
                      className="rounded-full bg-gradient-to-r from-green-600 to-green-500 px-6 py-2.5 text-sm font-semibold text-white"
                    >
                      Get started →
                    </Link>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-800 to-green-600 p-1 shadow-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
                  <div className="relative rounded-2xl bg-white p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-orange-500">Haggle Pro</p>
                        <h3 className="mt-1 text-xl font-bold">Unlock premium features</h3>
                      </div>
                      <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                        Limited
                      </div>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {[
                        "Priority placement in discovery feed",
                        "Advanced analytics dashboard",
                        "Dedicated account manager",
                        "Custom room branding",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/signup"
                      className="mt-8 block rounded-full bg-gradient-to-r from-green-600 to-green-500 py-3 text-center text-sm font-semibold text-white"
                    >
                      Upgrade now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA — Bold, colorful, urgent */}
          <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-800 via-green-700 to-orange-600 px-6 py-16 text-center text-white shadow-xl transition-all hover:shadow-2xl sm:px-12">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
                <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
                <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-green-500/20 blur-3xl" />
                <div className="relative">
                  <p className="text-sm font-semibold uppercase tracking-wide text-orange-200">
                    Ready to haggle?
                  </p>
                  <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                    Join the live negotiation <br/>revolution
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
                    Thousands of buyers and sellers are already making better deals — live. No bots. No silence. Just real conversations and fair prices.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                      href="/signup"
                      className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-green-700 transition-all hover:bg-gray-100 hover:shadow-lg"
                    >
                      Create your account
                    </Link>
                    <Link
                      href="/dashboard"
                      className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      Explore live rooms
                    </Link>
                  </div>
                  <p className="mt-8 text-sm text-white/60">Free to browse. No credit card required.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}