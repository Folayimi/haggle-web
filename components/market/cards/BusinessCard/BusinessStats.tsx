"use client";

import {
  Package,
  BriefcaseBusiness,
  MessageCircle,
  Users,
  TrendingUp,
} from "lucide-react";

import { Seller } from "@/types";

interface BusinessStatsProps {
  seller: Seller;
}

export function BusinessStats({
  seller,
}: BusinessStatsProps) {
  const stats = [
    {
      icon: Package,
      label: "Products",
      value: seller.totalProducts,
      color: "text-primary",
    },
    {
      icon: BriefcaseBusiness,
      label: "Services",
      value: seller.totalServices,
      color: "text-secondary",
    },
    {
      icon: MessageCircle,
      label: "Deals",
      value: seller.totalNegotiations,
      color: "text-warning",
    },
    {
      icon: Users,
      label: "Followers",
      value: seller.followers.toLocaleString(),
      color: "text-success",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="
              rounded-2xl
              border
              border-border
              bg-surface
              p-4
              transition-all
              hover:-translate-y-1
              hover:shadow-md
            "
          >
            <div className="flex items-center justify-between">
              <Icon
                className={`h-5 w-5 ${stat.color}`}
              />

              <TrendingUp className="h-4 w-4 text-success" />
            </div>

            <p className="mt-4 text-2xl font-bold">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-muted">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}