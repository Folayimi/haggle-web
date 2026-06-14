"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Eye,
  Play,
  Clock,
  TrendingUp,
} from "lucide-react";
import { sellerProfiles } from "@/lib/mock-data";
import { SellerLiveSession } from "@/lib/types";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DashboardPage() {
  // Get all live sessions from mock data
  const allLiveSessions: (SellerLiveSession & {
    sellerName: string;
    sellerAvatar: string;
  })[] = [];
  sellerProfiles.forEach((seller) => {
    seller.ongoingLives.forEach((live) => {
      allLiveSessions.push({
        ...live,
        sellerName: seller.name,
        sellerAvatar: seller.avatarUrl,
      });
    });
    seller.upcomingLives.forEach((live) => {
      allLiveSessions.push({
        ...live,
        sellerName: seller.name,
        sellerAvatar: seller.avatarUrl,
      });
    });
  });

  const products = useMemo(() => sellerProfiles.flatMap((s) => s.products || []), []);
  const services = useMemo(() => sellerProfiles.flatMap((s) => s.services || []), []);
  const [tab, setTab] = useState<"live" | "products" | "services">("live");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-40 bg-surface border-b border-border backdrop-blur-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
              Welcome Back
            </h1>
              <p className="text-sm text-black dark:text-white">
                Discover live negotiations happening right now
              </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/market"
              className="px-4 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary-600 transition-colors hidden sm:inline-flex"
            >
              + Explore Offers
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/saved"
                className="px-3 py-2 rounded-full border border-border text-sm"
              >
                Saved
              </Link>
              <Link
                href="/post-product"
                className="px-3 py-2 rounded-full bg-white text-sm font-semibold"
              >
                Sell
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr,300px] gap-6">
          {/* Main column */}
          <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                {tab === 'live' ? 'Live Now' : tab === 'products' ? 'Products' : 'Services'}
              </h2>
              <p className="text-sm text-black dark:text-white">
                {tab === 'live' ? 'Join negotiations in progress' : tab === 'products' ? 'Browse available products' : 'Browse offered services'}
              </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 bg-white/20 rounded-full p-1">
                  <button onClick={() => setTab('live')} aria-label="Show live sessions" className={`px-3 py-1 rounded-full text-sm ${tab === 'live' ? 'bg-primary text-white' : 'bg-white/10 text-black hover:bg-white/20'}`}>
                    Live
                  </button>
                  <button onClick={() => setTab('products')} aria-label="Show products" className={`px-3 py-1 rounded-full text-sm ${tab === 'products' ? 'bg-primary text-white' : 'bg-white/10 text-black hover:bg-white/20'}`}>
                    Products
                  </button>
                  <button onClick={() => setTab('services')} aria-label="Show services" className={`px-3 py-1 rounded-full text-sm ${tab === 'services' ? 'bg-primary text-white' : 'bg-white/10 text-black hover:bg-white/20'}`}>
                    Services
                  </button>
                </div>
            </div>
          </div>

          {tab === 'live' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {allLiveSessions
                  .filter((s) => s.status === 'Live now' || s.status === 'Ongoing')
                  .map((session, idx) => (
                    <motion.div key={idx} className="group cursor-pointer" variants={fadeInUp} whileHover={{ y: -4 }}>
                      <div className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-surface-secondary">
                        <div className="relative h-64 overflow-hidden">
                          <img src={session.coverImageUrl} alt={session.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
                          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-danger rounded-full">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-white">LIVE</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-dark-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">{session.title}</h3>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundImage: `url(${session.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-dark-900 dark:text-white truncate">{sellerProfiles.find(s => s.id === session.sellerId)?.name || ''}</p>
                              <p className="text-xs text-black dark:text-white flex items-center gap-1"><Clock className="w-3 h-3" />{session.schedule}</p>
                            </div>
                          </div>
                          <div className="mb-4 space-y-1.5">
                            {session.buyerBenefits.slice(0, 2).map((benefit, i) => (
                              <p key={i} className="text-xs text-black dark:text-white flex items-start gap-2"><span className="text-primary font-bold mt-0.5">✓</span>{benefit}</p>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Link href={`/negotiation-room?session=${encodeURIComponent(session.id || '')}`} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-600 transition-colors text-center">Join Now</Link>
                            <Link href={`/seller-profile?name=${encodeURIComponent(sellerProfiles.find(s => s.id === session.sellerId)?.name || '')}`} className="px-4 py-2 border border-primary text-primary text-sm font-semibold rounded-full hover:bg-primary/5 transition-colors text-center">View Profile</Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              <div className="mt-12">
                <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">Coming Soon</h2>
                <motion.div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" variants={staggerContainer} initial="initial" animate="animate">
                  {allLiveSessions.filter((s) => s.status === 'Scheduled' || s.status === 'Upcoming').map((session, idx) => (
                    <motion.div key={idx} className="group cursor-pointer" variants={fadeInUp} whileHover={{ y: -4 }}>
                      <div className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-surface-secondary opacity-90">
                        <div className="relative h-56 overflow-hidden">
                          <img src={session.coverImageUrl} alt={session.title} className="w-full h-full object-cover opacity-75" />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
                          <div className="absolute top-4 left-4 px-3 py-1.5 bg-warning rounded-full"><span className="text-xs font-bold text-dark-900">COMING SOON</span></div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-dark-900 dark:text-white line-clamp-2 mb-2">{session.title}</h3>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundImage: `url(${session.sellerAvatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-dark-900 dark:text-white truncate">{session.sellerName}</p>
                              <p className="text-xs text-black dark:text-white flex items-center gap-1"><Clock className="w-3 h-3" />{session.schedule}</p>
                            </div>
                          </div>
                          <Link href={`/schedule-live?session=${encodeURIComponent(session.id || '')}`} className="w-full px-4 py-2 border-2 border-primary text-primary text-sm font-semibold rounded-full hover:bg-primary/5 transition-colors text-center">Reserve Spot</Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </>
          )}

          {tab === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="panel rounded-2xl p-4">
                  <div className="flex gap-4">
                    <img src={product.imageUrl} alt={product.name} className="w-28 h-20 object-cover rounded-md" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark-900 dark:text-white">{product.name}</h4>
                      <p className="text-sm text-black dark:text-white">{product.category} • {product.stockStatus}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-lg font-bold">{product.price}</div>
                        <div className="flex gap-2">
                          <Link href="/product-detail" className="px-3 py-1 rounded-full border text-sm">View</Link>
                          <Link href={`/negotiation-room?offer=${encodeURIComponent(product.id)}`} className="px-3 py-1 rounded-full bg-primary text-white text-sm">Negotiate</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'services' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div key={svc.id} className="panel rounded-2xl p-4">
                  <div className="flex gap-4">
                    <img src={svc.imageUrl} alt={svc.name} className="w-28 h-20 object-cover rounded-md" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark-900 dark:text-white">{svc.name}</h4>
                      <p className="text-sm text-black dark:text-white">{svc.category} • {svc.deliveryTime}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-lg font-bold">{svc.price}</div>
                        <div className="flex gap-2">
                          <Link href="/service-detail" className="px-3 py-1 rounded-full border text-sm">View</Link>
                          <Link href={`/negotiation-room?service=${encodeURIComponent(svc.id)}`} className="px-3 py-1 rounded-full bg-primary text-white text-sm">Book</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </motion.div>

          {/* Right column / Sidebar */}
          <aside className="hidden lg:block">
            <div className="panel rounded-2xl p-4 space-y-4">
              <h3 className="text-sm font-semibold text-black">Analytics</h3>
              <div className="grid gap-3">
                <div className="rounded-lg bg-background-elevated p-3">
                  <p className="text-xs text-black">Products</p>
                  <p className="text-xl font-bold">{products.length}</p>
                </div>
                <div className="rounded-lg bg-background-elevated p-3">
                  <p className="text-xs text-black">Services</p>
                  <p className="text-xl font-bold">{services.length}</p>
                </div>
                <div className="rounded-lg bg-background-elevated p-3">
                  <p className="text-xs text-black">Live Sessions</p>
                  <p className="text-xl font-bold">{allLiveSessions.length}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-black mb-2">Quick actions</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/post-product" className="px-3 py-2 rounded-full bg-primary text-white text-sm text-center">Add product</Link>
                  <Link href="/create-live" className="px-3 py-2 rounded-full border border-border text-sm text-center">Start live</Link>
                  <Link href="/analytics" className="px-3 py-2 rounded-full bg-white text-sm text-center">View analytics</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
