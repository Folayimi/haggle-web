// components/business-profile/BusinessInformation.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Truck,
  CreditCard,
  Shield,
  MessageSquare,
  Languages,
  Edit3,
  Check,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
  FaTelegram,
  FaDiscord,
  FaGithub,
  FaPinterest,
  FaSnapchat,
  FaReddit,
  FaThreads,
} from "react-icons/fa6";

// ============================================
// TYPES
// ============================================
interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface BusinessInformationProps {
  businessName: string;
  hours: BusinessHours[];
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialLinks?: { platform: string; url: string }[];
  deliveryOptions?: string[];
  paymentMethods?: string[];
  returnPolicy?: string;
  faqs?: { question: string; answer: string }[];
  languages?: string[];
  isOwner: boolean;
  onSave: (data: any) => void;
  className?: string;
}

// ============================================
// DAYS SHORT
// ============================================
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ============================================
// HOURS CARD
// ============================================
function HoursCard({
  hours,
  isOwner,
  onEdit,
}: {
  hours: BusinessHours[];
  isOwner: boolean;
  onEdit: () => void;
}) {
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="rounded-xl border border-border/40 bg-background-elevated/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h5 className="text-sm font-semibold text-foreground">Business Hours</h5>
        </div>
        {isOwner && (
          <button
            onClick={onEdit}
            className="text-xs text-muted/50 hover:text-foreground transition flex items-center gap-1"
          >
            <Edit3 className="h-3 w-3" />
            Edit
          </button>
        )}
      </div>
      <div className="space-y-1 text-xs">
        {hours.map((item, index) => {
          const isToday = index === todayIndex;
          const dayLabel = DAYS_SHORT[index] || item.day;
          const isClosed = item.isClosed;

          return (
            <div
              key={item.day}
              className={cn(
                "flex items-center justify-between py-0.5",
                isToday && "text-foreground font-medium"
              )}
            >
              <span className={isToday ? "text-foreground" : "text-muted/60"}>
                {dayLabel}
                {isToday && <span className="ml-1.5 text-[8px] text-primary">• Today</span>}
              </span>
              <span className={isClosed ? "text-muted/30" : "text-foreground/80"}>
                {isClosed ? "Closed" : `${item.open} – ${item.close}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// INFO CARD (generic)
// ============================================
function InfoCard({
  icon,
  title,
  content,
  isOwner,
  onEdit,
}: {
  icon: React.ReactNode;
  title: string;
  content: string | React.ReactNode;
  isOwner: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-background-elevated/10 p-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-muted/40">{icon}</span>
          <h5 className="text-sm font-semibold text-foreground/80">{title}</h5>
        </div>
        {isOwner && (
          <button
            onClick={onEdit}
            className="text-xs text-muted/50 hover:text-foreground transition flex items-center gap-1"
          >
            <Edit3 className="h-3 w-3" />
            Edit
          </button>
        )}
      </div>
      <div className="text-sm text-foreground/70">{content}</div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function BusinessInformation({
  businessName,
  hours,
  location,
  phone,
  email,
  website,
  socialLinks = [],
  deliveryOptions = [],
  paymentMethods = [],
  returnPolicy,
  faqs = [],
  languages = [],
  isOwner,
  onSave,
  className,
}: BusinessInformationProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (field: string) => {
    setEditingField(field);
    // In a real implementation, open a modal or inline edit
    // For now, we'll just toggle
    setEditingField(null);
    // Open a toast or modal
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "rounded-3xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            Business Information
          </h3>
          <p className="text-sm text-muted/70">
            Everything customers need to know about your business
          </p>
        </div>
        {isOwner && (
          <button className="text-sm text-primary hover:text-primary-strong transition flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Info
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hours */}
        <HoursCard hours={hours} isOwner={isOwner} onEdit={() => handleEdit("hours")} />

        {/* Location */}
        {location && (
          <InfoCard
            icon={<MapPin className="h-4 w-4" />}
            title="Location"
            content={location}
            isOwner={isOwner}
            onEdit={() => handleEdit("location")}
          />
        )}

        {/* Contact */}
        <InfoCard
          icon={<Phone className="h-4 w-4" />}
          title="Contact"
          content={
            <div className="space-y-0.5">
              {phone && <p>{phone}</p>}
              {email && <p className="text-muted/60">{email}</p>}
            </div>
          }
          isOwner={isOwner}
          onEdit={() => handleEdit("contact")}
        />

        {/* Website */}
        {website && (
          <InfoCard
            icon={<Globe className="h-4 w-4" />}
            title="Website"
            content={
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            }
            isOwner={isOwner}
            onEdit={() => handleEdit("website")}
          />
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="rounded-xl border border-border/40 bg-background-elevated/10 p-4 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-muted/40">
                  <FaFacebook className="h-4 w-4" />
                </span>
                <h5 className="text-sm font-semibold text-foreground/80">Social Media</h5>
              </div>
              {isOwner && (
                <button
                  onClick={() => handleEdit("social")}
                  className="text-xs text-muted/50 hover:text-foreground transition flex items-center gap-1"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full border border-border/40 px-3 py-1.5 text-xs text-foreground/70 hover:bg-background-elevated/20 transition"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.platform}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Delivery */}
        {deliveryOptions.length > 0 && (
          <InfoCard
            icon={<Truck className="h-4 w-4" />}
            title="Delivery"
            content={deliveryOptions.join(" · ")}
            isOwner={isOwner}
            onEdit={() => handleEdit("delivery")}
          />
        )}

        {/* Payment Methods */}
        {paymentMethods.length > 0 && (
          <InfoCard
            icon={<CreditCard className="h-4 w-4" />}
            title="Payment Methods"
            content={paymentMethods.join(" · ")}
            isOwner={isOwner}
            onEdit={() => handleEdit("payment")}
          />
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <InfoCard
            icon={<Languages className="h-4 w-4" />}
            title="Languages"
            content={languages.join(" · ")}
            isOwner={isOwner}
            onEdit={() => handleEdit("languages")}
          />
        )}

        {/* Return Policy */}
        {returnPolicy && (
          <InfoCard
            icon={<Shield className="h-4 w-4" />}
            title="Return Policy"
            content={returnPolicy}
            isOwner={isOwner}
            onEdit={() => handleEdit("return")}
            className="md:col-span-2"
          />
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="rounded-xl border border-border/40 bg-background-elevated/10 p-4 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted/40" />
                <h5 className="text-sm font-semibold text-foreground/80">FAQs</h5>
              </div>
              {isOwner && (
                <button
                  onClick={() => handleEdit("faqs")}
                  className="text-xs text-muted/50 hover:text-foreground transition flex items-center gap-1"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              )}
            </div>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border/20 last:border-0 pb-2 last:pb-0">
                  <p className="text-sm font-medium text-foreground/80">{faq.question}</p>
                  <p className="text-xs text-muted/60 mt-0.5">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// HELPER: Social Icon
// ============================================
function getSocialIcon(platform: string) {
  const lower = platform.toLowerCase();
  if (lower.includes("facebook")) return FaFacebook;
  if (lower.includes("instagram")) return FaInstagram;
  if (lower.includes("twitter") || lower.includes("x")) return FaXTwitter;
  if (lower.includes("youtube")) return FaYoutube;
  return Globe;
}