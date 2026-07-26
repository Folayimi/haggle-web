// data/mock/services.ts

import { MarketService } from "@/types";

export const services: MarketService[] = [
  {
    id: "service-1",
    sellerId: "seller-1",
    name: "Logo & Brand Identity Design",
    description:
      "Professional logo creation with a complete brand identity kit including color palette, typography, and social media assets.",
    category: "Creative & Design",
    imageUrl: "/images/mock/services/logo-design.jpg",
    price: 85000,
    deliveryTime: "3 - 5 days",
    audience: "Startups, SMEs, Businesses",
    includes: [
      "Primary Logo",
      "Brand Guidelines",
      "Social Media Kit",
      "Unlimited Revisions",
    ],
    bookingCount: 128,
  },

  {
    id: "service-2",
    sellerId: "seller-2",
    name: "Website Design & Development",
    description:
      "Modern responsive websites built with React, Next.js and Tailwind CSS for businesses and startups.",
    category: "Programming & Tech",
    imageUrl: "/images/mock/services/web-development.jpg",
    price: 250000,
    deliveryTime: "2 - 3 weeks",
    audience: "Businesses & Startups",
    includes: [
      "Responsive Design",
      "Admin Dashboard",
      "SEO Optimization",
      "Deployment",
    ],
    bookingCount: 94,
  },

  {
    id: "service-3",
    sellerId: "seller-3",
    name: "Wedding Photography",
    description:
      "Capture your wedding with cinematic photography and professionally edited albums.",
    category: "Photography & Video",
    imageUrl: "/images/mock/services/wedding-photography.jpg",
    price: 180000,
    deliveryTime: "2 weeks",
    audience: "Couples",
    includes: [
      "Full Day Coverage",
      "Edited Album",
      "Drone Shots",
      "Highlight Video",
    ],
    bookingCount: 76,
  },

  {
    id: "service-4",
    sellerId: "seller-4",
    name: "Social Media Management",
    description:
      "Grow your online presence through content creation, scheduling, analytics, and audience engagement.",
    category: "Digital Marketing",
    imageUrl: "/images/mock/services/social-media.jpg",
    price: 120000,
    deliveryTime: "Monthly",
    audience: "Brands & Businesses",
    includes: [
      "Content Calendar",
      "Graphic Design",
      "Daily Posting",
      "Performance Reports",
    ],
    bookingCount: 163,
  },

  {
    id: "service-5",
    sellerId: "seller-5",
    name: "Home Cleaning Service",
    description:
      "Professional residential and office cleaning services using premium equipment and eco-friendly products.",
    category: "Home & Maintenance",
    imageUrl: "/images/mock/services/home-cleaning.jpg",
    price: 35000,
    deliveryTime: "Same Day",
    audience: "Homes & Offices",
    includes: [
      "Deep Cleaning",
      "Kitchen Cleaning",
      "Bathroom Cleaning",
      "Floor Polishing",
    ],
    bookingCount: 241,
  },

  {
    id: "service-6",
    sellerId: "seller-1",
    name: "UI/UX Design",
    description:
      "Beautiful and user-friendly mobile and web interface designs created in Figma with interactive prototypes.",
    category: "Creative & Design",
    imageUrl: "/images/mock/services/uiux.jpg",
    price: 150000,
    deliveryTime: "1 week",
    audience: "Startups & Product Teams",
    includes: [
      "Wireframes",
      "High Fidelity UI",
      "Interactive Prototype",
      "Design System",
    ],
    bookingCount: 87,
  },
];