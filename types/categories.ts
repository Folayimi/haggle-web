// types/categories.ts

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  subcategories: Subcategory[];
  requiredTags: Tag[];
  recommendedTags?: Tag[];
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  requiredTags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  type: "text" | "number" | "select" | "boolean" | "range" | "multi-select";
  options?: string[];
  placeholder?: string;
  required: boolean;
  helpText?: string;
}

export const PRODUCT_CATEGORIES: Category[] = [
  // ============================================
  // ELECTRONICS & GADGETS
  // ============================================
  {
    id: "electronics",
    name: "Electronics & Gadgets",
    description: "Phones, laptops, cameras, audio, gaming, and more.",
    icon: "📱",
    subcategories: [
      { id: "phones", name: "Phones & Accessories" },
      { id: "laptops", name: "Laptops & Computers" },
      { id: "tablets", name: "Tablets & E-Readers" },
      { id: "cameras", name: "Cameras & Photography" },
      { id: "audio", name: "Audio & Headphones" },
      { id: "wearables", name: "Wearables & Smartwatches" },
      { id: "gaming", name: "Gaming Consoles & Accessories" },
      { id: "components", name: "Computer Components" },
      { id: "networking", name: "Networking & IT Equipment" },
      { id: "drones", name: "Drones & Accessories" },
      { id: "smart-home", name: "Smart Home Devices" },
      { id: "tv", name: "TVs & Home Theater" },
      { id: "other-electronics", name: "Other Electronics" },
    ],
    requiredTags: [
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: true,
        placeholder: "e.g. Apple, Samsung, Sony",
      },
      {
        id: "model",
        name: "Model",
        type: "text",
        required: true,
        placeholder: "e.g. iPhone 14 Pro Max",
      },
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New", "Like New", "Excellent", "Good", "Fair", "For Parts"],
      },      
      {
        id: "warranty",
        name: "Warranty Status",
        type: "select",
        required: false,
        options: ["In Warranty", "Out of Warranty"],
      },
      {
        id: "accessories",
        name: "Accessories Included",
        type: "text",
        required: false,
        placeholder: "e.g. Charger, Box, Cable",
      },
      {
        id: "color",
        name: "Color",
        type: "text",
        required: false,
        placeholder: "e.g. Space Gray, Gold",
      },
      {
        id: "storage",
        name: "Storage Capacity",
        type: "text",
        required: false,
        placeholder: "e.g. 128GB, 512GB",
      },
    ],
  },

  // ============================================
  // FASHION & APPAREL
  // ============================================
  {
    id: "fashion",
    name: "Fashion & Apparel",
    description: "Clothing, footwear, bags, jewelry, and accessories.",
    icon: "👗",
    subcategories: [
      { id: "mens-clothing", name: "Men's Clothing" },
      { id: "womens-clothing", name: "Women's Clothing" },
      { id: "kids-clothing", name: "Kids' Clothing" },
      { id: "footwear", name: "Footwear" },
      { id: "bags", name: "Bags & Luggage" },
      { id: "jewelry", name: "Jewelry & Watches" },
      { id: "sunglasses", name: "Sunglasses & Eyewear" },
      { id: "hats", name: "Hats & Caps" },
      { id: "scarves", name: "Scarves & Gloves" },
      { id: "traditional-wear", name: "Traditional Wear" },
      { id: "fashion-accessories", name: "Other Accessories" },
      { id: "vintage-fashion", name: "Vintage & Retro" },
    ],
    requiredTags: [
      {
        id: "size",
        name: "Size",
        type: "text",
        required: true,
        placeholder: "e.g. M, L, XL, 34, 42",
      },
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: true,
        placeholder: "e.g. Nike, Zara, Gucci",
      },
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New with Tags", "Like New", "Excellent", "Good", "Fair"],
      },
      {
        id: "clothing-type",
        name: "Clothing Type",
        type: "select",
        required: true,
        options: [
          "Tops",
          "Bottoms",
          "Dresses",
          "Outerwear",
          "Activewear",
          "Other",
        ],
      },
      
      {
        id: "color",
        name: "Color",
        type: "text",
        required: false,
        placeholder: "e.g. Black, Red, Blue",
      },
      {
        id: "material",
        name: "Material",
        type: "text",
        required: false,
        placeholder: "e.g. Cotton, Leather, Silk",
      },
      {
        id: "season",
        name: "Season",
        type: "select",
        required: false,
        options: ["Spring", "Summer", "Fall", "Winter", "All Seasons"],
      },
    ],
  },

  // ============================================
  // HOME & KITCHEN
  // ============================================
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    description: "Furniture, decor, kitchenware, and home essentials.",
    icon: "🏠",
    subcategories: [
      { id: "furniture", name: "Furniture" },
      { id: "home-decor", name: "Home Decor" },
      { id: "kitchenware", name: "Kitchenware & Cookware" },
      { id: "bedding", name: "Bedding & Bath" },
      { id: "storage", name: "Storage & Organization" },
      { id: "lighting", name: "Lighting & Lamps" },
      { id: "rugs", name: "Rugs & Carpets" },
      { id: "wall-art", name: "Wall Art & Decor" },
      { id: "outdoor-living", name: "Outdoor Living" },
      { id: "appliances", name: "Small Appliances" },
      { id: "tools", name: "Home Tools & DIY" },
      { id: "other-home", name: "Other Home Items" },
    ],
    requiredTags: [
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New", "Like New", "Excellent", "Good", "Fair"],
      },
      {
        id: "material",
        name: "Material",
        type: "text",
        required: true,
        placeholder: "e.g. Wood, Metal, Glass",
      },

      
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: false,
        placeholder: "e.g. IKEA, Vitra, Herman Miller",
      },
      {
        id: "color",
        name: "Color",
        type: "text",
        required: false,
        placeholder: "e.g. White, Oak, Walnut",
      },
      {
        id: "dimensions",
        name: "Dimensions",
        type: "text",
        required: false,
        placeholder: "e.g. 120cm x 60cm x 45cm",
      },
    ],
  },

  // ============================================
  // BEAUTY & HEALTH
  // ============================================
  {
    id: "beauty-health",
    name: "Beauty & Health",
    description: "Skincare, makeup, fragrances, wellness, and supplements.",
    icon: "💄",
    subcategories: [
      { id: "skincare", name: "Skincare" },
      { id: "makeup", name: "Makeup" },
      { id: "fragrances", name: "Fragrances" },
      { id: "hair-care", name: "Hair Care" },
      { id: "wellness-devices", name: "Wellness Devices" },
      { id: "supplements", name: "Supplements & Vitamins" },
      { id: "natural-products", name: "Natural & Organic" },
      { id: "bath-body", name: "Bath & Body" },
      { id: "grooming", name: "Grooming & Shaving" },
      { id: "other-beauty", name: "Other Beauty & Health" },
    ],
    requiredTags: [
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: true,
        placeholder: "e.g. Nivea, Maybelline, Neutrogena",
      },
      {
        id: "product-type",
        name: "Product Type",
        type: "select",
        required: true,
        options: [
          "Face",
          "Body",
          "Hair",
          "Fragrance",
          "Supplement",
          "Device",
          "Other",
        ],
      },
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New", "Like New", "Good", "Fair"],
      },
      
      {
        id: "expiry",
        name: "Expiry Date",
        type: "text",
        required: false,
        placeholder: "e.g. 12/2025",
      },
      {
        id: "skin-type",
        name: "Skin Type",
        type: "select",
        required: false,
        options: ["Normal", "Dry", "Oily", "Combination", "Sensitive"],
      },
    ],
  },

  // ============================================
  // AUTOMOTIVE
  // ============================================
  {
    id: "automotive",
    name: "Automotive",
    description: "Cars, motorcycles, parts, accessories, and tools.",
    icon: "🚗",
    subcategories: [
      { id: "cars", name: "Cars" },
      { id: "motorcycles", name: "Motorcycles" },
      { id: "parts", name: "Auto Parts" },
      { id: "accessories", name: "Car Accessories" },
      { id: "tools", name: "Auto Tools & Equipment" },
      { id: "electronics", name: "Car Electronics" },
      { id: "detailing", name: "Detailing & Cleaning" },
      { id: "trucks", name: "Trucks & Vans" },
      { id: "other-auto", name: "Other Automotive" },
    ],
    requiredTags: [
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: true,
        placeholder: "e.g. Toyota, Honda, BMW",
      },
      {
        id: "model",
        name: "Model",
        type: "text",
        required: true,
        placeholder: "e.g. Corolla, Civic, 3 Series",
      },
      {
        id: "year",
        name: "Year",
        type: "text",
        required: true,
        placeholder: "e.g. 2020",
      },
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New", "Used", "Refurbished"],
      },
      
      {
        id: "mileage",
        name: "Mileage",
        type: "text",
        required: false,
        placeholder: "e.g. 45,000 km",
      },
      {
        id: "fuel-type",
        name: "Fuel Type",
        type: "select",
        required: false,
        options: ["Petrol", "Diesel", "Electric", "Hybrid"],
      },
      {
        id: "transmission",
        name: "Transmission",
        type: "select",
        required: false,
        options: ["Manual", "Automatic", "CVT"],
      },
    ],
  },

  // ============================================
  // COLLECTIBLES & ART
  // ============================================
  {
    id: "collectibles-art",
    name: "Collectibles & Art",
    description: "Art, antiques, collectibles, trading cards, and memorabilia.",
    icon: "🎨",
    subcategories: [
      { id: "fine-art", name: "Fine Art" },
      { id: "antiques", name: "Antiques" },
      { id: "trading-cards", name: "Trading Cards" },
      { id: "coins", name: "Coins & Currency" },
      { id: "stamps", name: "Stamps" },
      { id: "memorabilia", name: "Sports Memorabilia" },
      { id: "vintage", name: "Vintage Items" },
      { id: "comics", name: "Comics & Graphic Novels" },
      { id: "figurines", name: "Figurines & Statues" },
      { id: "other-collectibles", name: "Other Collectibles" },
    ],
    requiredTags: [
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["Mint", "Excellent", "Good", "Fair", "Poor"],
      },
      {
        id: "authenticity",
        name: "Authenticity",
        type: "select",
        required: true,
        options: ["Original", "Reproduction", "Unsure"],
      },

      
      {
        id: "year",
        name: "Year",
        type: "text",
        required: false,
        placeholder: "e.g. 1960",
      },
      {
        id: "artist",
        name: "Artist/Maker",
        type: "text",
        required: false,
        placeholder: "e.g. Pablo Picasso",
      },
      {
        id: "certificate",
        name: "Certificate of Authenticity",
        type: "boolean",
        required: false,
      },
    ],
  },

  // ============================================
  // SPORTS & OUTDOORS
  // ============================================
  {
    id: "sports-outdoors",
    name: "Sports & Outdoors",
    description: "Fitness equipment, outdoor gear, bicycles, and water sports.",
    icon: "⚽",
    subcategories: [
      { id: "fitness", name: "Fitness Equipment" },
      { id: "bicycles", name: "Bicycles" },
      { id: "camping", name: "Camping & Hiking" },
      { id: "water-sports", name: "Water Sports" },
      { id: "hunting-fishing", name: "Hunting & Fishing" },
      { id: "sports-gear", name: "Sports Gear & Equipment" },
      { id: "skateboards", name: "Skateboards & Scooters" },
      { id: "outdoor-clothing", name: "Outdoor Clothing" },
      { id: "other-sports", name: "Other Sports & Outdoors" },
    ],
    requiredTags: [
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: true,
        placeholder: "e.g. Nike, Adidas, Specialized",
      },
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New", "Like New", "Excellent", "Good", "Fair"],
      },

      
      {
        id: "size",
        name: "Size",
        type: "text",
        required: false,
        placeholder: "e.g. L, XL, 42",
      },
      {
        id: "sport-type",
        name: "Sport Type",
        type: "text",
        required: false,
        placeholder: "e.g. Football, Tennis, Cycling",
      },
    ],
  },

  // ============================================
  // BOOKS, MOVIES & MUSIC
  // ============================================
  {
    id: "media",
    name: "Books, Movies & Music",
    description: "Books, vinyl, CDs, DVDs, and musical instruments.",
    icon: "📚",
    subcategories: [
      { id: "books", name: "Books" },
      { id: "vinyl", name: "Vinyl Records" },
      { id: "cds", name: "CDs & Audio" },
      { id: "dvds", name: "DVDs & Blu-rays" },
      { id: "instruments", name: "Musical Instruments" },
      { id: "sheet-music", name: "Sheet Music" },
      { id: "collectible-books", name: "Collectible Books" },
      { id: "other-media", name: "Other Media" },
    ],
    requiredTags: [
      {
        id: "title",
        name: "Title",
        type: "text",
        required: true,
        placeholder: "e.g. The Great Gatsby",
      },
      {
        id: "author",
        name: "Author/Artist",
        type: "text",
        required: true,
        placeholder: "e.g. F. Scott Fitzgerald",
      },
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New", "Like New", "Excellent", "Good", "Fair"],
      },
      {
        id: "format",
        name: "Format",
        type: "select",
        required: true,
        options: [
          "Hardcover",
          "Paperback",
          "Vinyl",
          "CD",
          "DVD",
          "Digital",
          "Other",
        ],
      },

      
      {
        id: "edition",
        name: "Edition",
        type: "text",
        required: false,
        placeholder: "e.g. First Edition, Signed Copy",
      },
      {
        id: "year",
        name: "Year",
        type: "text",
        required: false,
        placeholder: "e.g. 1925",
      },
    ],
  },

  // ============================================
  // FOOD & GROCERIES
  // ============================================
  {
    id: "food-groceries",
    name: "Food & Groceries",
    description: "Specialty foods, snacks, beverages, and local artisan goods.",
    icon: "🍎",
    subcategories: [
      { id: "specialty-foods", name: "Specialty Foods" },
      { id: "snacks", name: "Snacks & Treats" },
      { id: "beverages", name: "Beverages" },
      { id: "organic-foods", name: "Organic & Health Foods" },
      { id: "artisan-goods", name: "Local Artisan Goods" },
      { id: "baking", name: "Baking Supplies" },
      { id: "meal-kits", name: "Meal Kits" },
      { id: "other-grocery", name: "Other Grocery Items" },
    ],
    requiredTags: [
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: true,
        placeholder: "e.g. Local Farm, Artisanal Bakery",
      },
      {
        id: "expiry",
        name: "Expiry Date",
        type: "text",
        required: true,
        placeholder: "e.g. 12/2025",
      },
      {
        id: "packaging",
        name: "Packaging",
        type: "select",
        required: true,
        options: ["Sealed", "Open", "Vacuum Packed", "Other"],
      },
      
      {
        id: "quantity",
        name: "Quantity",
        type: "text",
        required: false,
        placeholder: "e.g. 5kg, 10 pieces",
      },
      {
        id: "origin",
        name: "Origin",
        type: "text",
        required: false,
        placeholder: "e.g. Local, Imported",
      },
    ],
  },

  // ============================================
  // BUSINESS & INDUSTRIAL
  // ============================================
  {
    id: "business-industrial",
    name: "Business & Industrial",
    description:
      "Office supplies, commercial equipment, industrial tools, and raw materials.",
    icon: "🏢",
    subcategories: [
      { id: "office-supplies", name: "Office Supplies" },
      { id: "commercial-equipment", name: "Commercial Equipment" },
      { id: "industrial-tools", name: "Industrial Tools" },
      { id: "raw-materials", name: "Raw Materials" },
      { id: "packaging-supplies", name: "Packaging Supplies" },
      { id: "furniture", name: "Office Furniture" },
      { id: "hardware", name: "Hardware & Fasteners" },
      { id: "other-industrial", name: "Other Industrial" },
    ],
    requiredTags: [
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: true,
        placeholder: "e.g. HP, Bosch, 3M",
      },
      {
        id: "model",
        name: "Model",
        type: "text",
        required: true,
        placeholder: "e.g. LaserJet Pro, GWS 750",
      },
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New", "Like New", "Excellent", "Good", "Fair", "For Parts"],
      },

      
      {
        id: "specs",
        name: "Specifications",
        type: "text",
        required: false,
        placeholder: "e.g. 120V, 50Hz, 500W",
      },
      {
        id: "warranty",
        name: "Warranty",
        type: "text",
        required: false,
        placeholder: "e.g. 1 Year, 2 Years",
      },
    ],
  },

  // ============================================
  // PET SUPPLIES
  // ============================================
  {
    id: "pet-supplies",
    name: "Pet Supplies",
    description: "Pet food, accessories, toys, grooming, and health products.",
    icon: "🐾",
    subcategories: [
      { id: "pet-food", name: "Pet Food" },
      { id: "pet-accessories", name: "Pet Accessories" },
      { id: "pet-toys", name: "Pet Toys" },
      { id: "pet-grooming", name: "Grooming Products" },
      { id: "pet-health", name: "Health Products" },
      { id: "pet-beds", name: "Beds & Cages" },
      { id: "pet-collars", name: "Collars & Leashes" },
      { id: "other-pet", name: "Other Pet Supplies" },
    ],
    requiredTags: [
      {
        id: "brand",
        name: "Brand",
        type: "text",
        required: true,
        placeholder: "e.g. Royal Canin, Pedigree",
      },
      {
        id: "animal-type",
        name: "Animal Type",
        type: "select",
        required: true,
        options: ["Dog", "Cat", "Bird", "Fish", "Small Animal", "Other"],
      },
      {
        id: "condition",
        name: "Condition",
        type: "select",
        required: true,
        options: ["New", "Like New", "Excellent", "Good", "Fair"],
      },
      {
        id: "size",
        name: "Size",
        type: "text",
        required: false,
        placeholder: "e.g. Small, Medium, Large",
      },
      {
        id: "flavor",
        name: "Flavor",
        type: "text",
        required: false,
        placeholder: "e.g. Chicken, Beef",
      },
      
    ],
  },
];

// types/service-categories.ts

export const SERVICE_CATEGORIES: Category[] = [
  // ============================================
  // CREATIVE & DESIGN
  // ============================================
  {
    id: "creative-design",
    name: "Creative & Design",
    description: "Graphic design, branding, web design, photography, and more.",
    icon: "🎨",
    subcategories: [
      { id: "graphic-design", name: "Graphic Design" },
      { id: "logo-design", name: "Logo Design" },
      { id: "branding", name: "Branding & Identity" },
      { id: "web-design", name: "Web Design" },
      { id: "ux-ui-design", name: "UX/UI Design" },
      { id: "video-editing", name: "Video Editing" },
      { id: "photography", name: "Photography" },
      { id: "illustration", name: "Illustration" },
      { id: "animation", name: "Animation" },
      { id: "motion-graphics", name: "Motion Graphics" },
      { id: "interior-design", name: "Interior Design" },
      { id: "fashion-design", name: "Fashion Design" },
      { id: "architecture", name: "Architecture & 3D Rendering" },
      { id: "other-design", name: "Other Creative & Design" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "One-Time Project",
          "Ongoing Retainer",
          "Package Deal",
          "Hourly Consultation",
        ],
      },
      {
        id: "delivery-time",
        name: "Delivery Time",
        type: "text",
        required: true,
        placeholder: "e.g. 3-5 days, 2 weeks",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "portfolio",
        name: "Portfolio Samples",
        type: "boolean",
        required: false,
      },
      {
        id: "experience",
        name: "Years of Experience",
        type: "text",
        required: false,
        placeholder: "e.g. 5+ years",
      },
      {
        id: "software",
        name: "Software/Stack",
        type: "text",
        required: false,
        placeholder: "e.g. Figma, Adobe Suite, Blender",
      },
    ],
  },

  // ============================================
  // DIGITAL MARKETING
  // ============================================
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    description: "SEO, social media, content, email, PPC, and analytics.",
    icon: "📈",
    subcategories: [
      { id: "seo", name: "SEO (Search Engine Optimization)" },
      { id: "social-media", name: "Social Media Marketing" },
      { id: "content-marketing", name: "Content Marketing" },
      { id: "email-marketing", name: "Email Marketing" },
      { id: "ppc", name: "PPC Advertising" },
      { id: "influencer-marketing", name: "Influencer Marketing" },
      { id: "analytics", name: "Analytics & Data" },
      { id: "growth-hacking", name: "Growth Hacking" },
      { id: "brand-strategy", name: "Brand Strategy" },
      { id: "other-marketing", name: "Other Digital Marketing" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "One-Time Campaign",
          "Ongoing Management",
          "Strategy Consultation",
          "Monthly Retainer",
        ],
      },
      {
        id: "delivery-time",
        name: "Delivery Time",
        type: "text",
        required: true,
        placeholder: "e.g. 4 weeks, Monthly",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "specialization",
        name: "Specialization",
        type: "text",
        required: false,
        placeholder: "e.g. B2B, E-commerce, SaaS",
      },
      {
        id: "tools",
        name: "Tools Used",
        type: "text",
        required: false,
        placeholder: "e.g. Google Analytics, SEMrush, HubSpot",
      },
    ],
  },

  // ============================================
  // WRITING & TRANSLATION
  // ============================================
  {
    id: "writing-translation",
    name: "Writing & Translation",
    description:
      "Copywriting, content writing, translation, editing, and proofreading.",
    icon: "✍️",
    subcategories: [
      { id: "copywriting", name: "Copywriting" },
      { id: "content-writing", name: "Content Writing" },
      { id: "proofreading", name: "Proofreading" },
      { id: "editing", name: "Editing" },
      { id: "translation", name: "Translation" },
      { id: "transcription", name: "Transcription" },
      { id: "technical-writing", name: "Technical Writing" },
      { id: "creative-writing", name: "Creative Writing" },
      { id: "grant-writing", name: "Grant Writing" },
      { id: "other-writing", name: "Other Writing & Translation" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "Per Word",
          "Per Page",
          "Per Project",
          "Hourly",
          "Monthly Retainer",
        ],
      },
      {
        id: "delivery-time",
        name: "Delivery Time",
        type: "text",
        required: true,
        placeholder: "e.g. 2 days, 1 week",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "language",
        name: "Language(s)",
        type: "text",
        required: false,
        placeholder: "e.g. English, French, Yoruba",
      },
      {
        id: "niche",
        name: "Niche/Specialty",
        type: "text",
        required: false,
        placeholder: "e.g. Tech, Legal, Medical",
      },
    ],
  },

  // ============================================
  // PROGRAMMING & TECH
  // ============================================
  {
    id: "programming-tech",
    name: "Programming & Tech",
    description:
      "Web development, app development, software, IT support, and more.",
    icon: "💻",
    subcategories: [
      { id: "web-dev", name: "Web Development" },
      { id: "mobile-dev", name: "Mobile App Development" },
      { id: "software-dev", name: "Software Development" },
      { id: "it-support", name: "IT Support & Helpdesk" },
      { id: "data-science", name: "Data Science" },
      { id: "ai-ml", name: "AI & Machine Learning" },
      { id: "cybersecurity", name: "Cybersecurity" },
      { id: "blockchain", name: "Blockchain & Web3" },
      { id: "qa-testing", name: "QA & Software Testing" },
      { id: "devops", name: "DevOps & Cloud" },
      { id: "database", name: "Database Administration" },
      { id: "other-tech", name: "Other Programming & Tech" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "One-Time Project",
          "Ongoing Support",
          "Fixed Price",
          "Hourly",
          "Monthly Retainer",
        ],
      },
      {
        id: "delivery-time",
        name: "Delivery Time",
        type: "text",
        required: true,
        placeholder: "e.g. 4 weeks, 3 months",
      },
      {
        id: "tech-stack",
        name: "Tech Stack",
        type: "text",
        required: true,
        placeholder: "e.g. React, Node.js, Python",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "experience",
        name: "Years of Experience",
        type: "text",
        required: false,
        placeholder: "e.g. 5+ years",
      },
      { id: "portfolio", name: "Portfolio", type: "boolean", required: false },
      {
        id: "certifications",
        name: "Certifications",
        type: "text",
        required: false,
        placeholder: "e.g. AWS, Google Cloud, Microsoft",
      },
    ],
  },

  // ============================================
  // CONSULTING & COACHING
  // ============================================
  {
    id: "consulting-coaching",
    name: "Consulting & Coaching",
    description:
      "Business, management, finance, marketing, career, and life coaching.",
    icon: "🎯",
    subcategories: [
      { id: "business-consulting", name: "Business Consulting" },
      { id: "management-consulting", name: "Management Consulting" },
      { id: "financial-consulting", name: "Financial Consulting" },
      { id: "marketing-consulting", name: "Marketing Consulting" },
      { id: "strategy-consulting", name: "Strategy Consulting" },
      { id: "career-coaching", name: "Career Coaching" },
      { id: "life-coaching", name: "Life Coaching" },
      { id: "executive-coaching", name: "Executive Coaching" },
      { id: "other-consulting", name: "Other Consulting & Coaching" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "One-Time Session",
          "Monthly Retainer",
          "Package Deal",
          "Hourly",
          "Half-Day Workshop",
        ],
      },
      {
        id: "delivery-time",
        name: "Delivery Time",
        type: "text",
        required: true,
        placeholder: "e.g. 1 hour, 2 days",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "industry",
        name: "Industry Focus",
        type: "text",
        required: false,
        placeholder: "e.g. Tech, Healthcare, Finance",
      },
      {
        id: "certification",
        name: "Certification",
        type: "text",
        required: false,
        placeholder: "e.g. ICF, CPCC, MBA",
      },
      {
        id: "experience",
        name: "Years of Experience",
        type: "text",
        required: false,
        placeholder: "e.g. 10+ years",
      },
    ],
  },

  // ============================================
  // HOME & MAINTENANCE SERVICES
  // ============================================
  {
    id: "home-maintenance",
    name: "Home & Maintenance Services",
    description:
      "Cleaning, plumbing, electrical, carpentry, painting, landscaping, and repairs.",
    icon: "🔧",
    subcategories: [
      { id: "cleaning", name: "Cleaning Services" },
      { id: "plumbing", name: "Plumbing" },
      { id: "electrical", name: "Electrical Work" },
      { id: "carpentry", name: "Carpentry" },
      { id: "painting", name: "Painting" },
      { id: "landscaping", name: "Landscaping" },
      { id: "moving", name: "Moving Services" },
      { id: "appliance-repair", name: "Appliance Repair" },
      { id: "pest-control", name: "Pest Control" },
      { id: "handyman", name: "Handyman Services" },
      { id: "other-maintenance", name: "Other Home & Maintenance" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: ["One-Time", "Recurring", "Emergency", "Project-Based"],
      },
      {
        id: "delivery-time",
        name: "Availability",
        type: "text",
        required: true,
        placeholder: "e.g. Same day, 2 days notice",
      },

      {
        id: "location",
        name: "Service Area",
        type: "text",
        required: true,
        placeholder: "e.g. Lagos Island, Ikeja, Abuja",
      },
    ],
    recommendedTags: [
      {
        id: "equipment",
        name: "Equipment Provided",
        type: "boolean",
        required: false,
      },
      {
        id: "materials",
        name: "Materials Cost",
        type: "text",
        required: false,
        placeholder: "e.g. Included, Extra",
      },
      { id: "insurance", name: "Insured", type: "boolean", required: false },
    ],
  },

  // ============================================
  // HEALTH & WELLNESS
  // ============================================
  {
    id: "health-wellness",
    name: "Health & Wellness",
    description:
      "Personal training, yoga, nutrition, massage, and mental health.",
    icon: "🧘",
    subcategories: [
      { id: "personal-training", name: "Personal Training" },
      { id: "yoga", name: "Yoga Instruction" },
      { id: "nutrition", name: "Nutrition Counseling" },
      { id: "life-coaching", name: "Life Coaching" },
      { id: "massage", name: "Massage Therapy" },
      { id: "mental-health", name: "Mental Health Counseling" },
      { id: "fitness-classes", name: "Group Fitness Classes" },
      { id: "wellness-retreats", name: "Wellness Retreats" },
      { id: "other-wellness", name: "Other Health & Wellness" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "One-Time Session",
          "Monthly Package",
          "Group Class",
          "Online",
          "In-Person",
        ],
      },
      {
        id: "delivery-time",
        name: "Availability",
        type: "text",
        required: true,
        placeholder: "e.g. Weekdays, Evenings, Weekends",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "certification",
        name: "Certification",
        type: "text",
        required: false,
        placeholder: "e.g. ACE, NASM, RYT",
      },
      {
        id: "experience",
        name: "Years of Experience",
        type: "text",
        required: false,
        placeholder: "e.g. 3+ years",
      },
      {
        id: "specialty",
        name: "Specialty",
        type: "text",
        required: false,
        placeholder: "e.g. Weight Loss, Yoga Therapy, Prenatal",
      },
    ],
  },

  // ============================================
  // EDUCATION & TUTORING
  // ============================================
  {
    id: "education-tutoring",
    name: "Education & Tutoring",
    description:
      "Academic tutoring, music lessons, language lessons, test prep, and professional development.",
    icon: "📖",
    subcategories: [
      { id: "academic-tutoring", name: "Academic Tutoring" },
      { id: "music-lessons", name: "Music Lessons" },
      { id: "language-lessons", name: "Language Lessons" },
      { id: "test-prep", name: "Test Prep" },
      { id: "coding-bootcamp", name: "Coding Bootcamps" },
      { id: "professional-development", name: "Professional Development" },
      { id: "art-lessons", name: "Art Lessons" },
      { id: "dance-lessons", name: "Dance Lessons" },
      { id: "other-education", name: "Other Education & Tutoring" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "One-Time Session",
          "Weekly Package",
          "Monthly Program",
          "Online",
          "In-Person",
        ],
      },
      {
        id: "delivery-time",
        name: "Availability",
        type: "text",
        required: true,
        placeholder: "e.g. Weekdays, Evenings, Weekends",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "qualifications",
        name: "Qualifications",
        type: "text",
        required: false,
        placeholder: "e.g. B.Ed, Master's, Certified Teacher",
      },
      {
        id: "experience",
        name: "Years of Experience",
        type: "text",
        required: false,
        placeholder: "e.g. 3+ years",
      },
      {
        id: "age-group",
        name: "Age Group",
        required: false,
        placeholder: "e.g. Kids (6-12), Teens (13-17), Adults (18+)",
        type: "select",
        options: ["Kids (6-12)", "Teens (13-17)", "Adults (18+)"],
      },
    ],
  },

  // ============================================
  // EVENT PLANNING & SERVICES
  // ============================================
  {
    id: "event-planning",
    name: "Event Planning & Services",
    description:
      "Wedding planning, corporate events, party planning, decor, and catering.",
    icon: "🎉",
    subcategories: [
      { id: "wedding-planning", name: "Wedding Planning" },
      { id: "corporate-events", name: "Corporate Event Planning" },
      { id: "party-planning", name: "Party Planning" },
      { id: "event-decor", name: "Event Decor" },
      { id: "catering", name: "Catering" },
      { id: "entertainment", name: "Entertainment Booking" },
      { id: "photography", name: "Event Photography" },
      { id: "event-rentals", name: "Event Rentals" },
      { id: "other-event", name: "Other Event Services" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "Full Planning",
          "Day-of Coordination",
          "Decor Only",
          "Catering Only",
          "Package Deal",
        ],
      },
      {
        id: "delivery-time",
        name: "Lead Time",
        type: "text",
        required: true,
        placeholder: "e.g. 2 weeks notice, 3 months advance",
      },

      {
        id: "location",
        name: "Service Area",
        type: "text",
        required: true,
        placeholder: "e.g. Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "event-type",
        name: "Event Type",
        type: "text",
        required: false,
        placeholder: "e.g. Wedding, Birthday, Corporate",
      },
      {
        id: "capacity",
        name: "Guest Capacity",
        type: "text",
        required: false,
        placeholder: "e.g. Up to 100, Up to 500",
      },
      { id: "portfolio", name: "Portfolio", type: "boolean", required: false },
    ],
  },

  // ============================================
  // LEGAL & FINANCIAL SERVICES
  // ============================================
  {
    id: "legal-financial",
    name: "Legal & Financial Services",
    description:
      "Legal advice, document preparation, tax, accounting, and financial planning.",
    icon: "⚖️",
    subcategories: [
      { id: "legal-advice", name: "Legal Advice" },
      { id: "document-prep", name: "Document Preparation" },
      { id: "tax-prep", name: "Tax Preparation" },
      { id: "accounting", name: "Accounting" },
      { id: "bookkeeping", name: "Bookkeeping" },
      { id: "financial-planning", name: "Financial Planning" },
      { id: "business-formation", name: "Business Formation" },
      { id: "contract-review", name: "Contract Review" },
      { id: "other-legal", name: "Other Legal & Financial" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: [
          "One-Time Consultation",
          "Monthly Retainer",
          "Project-Based",
          "Hourly",
        ],
      },
      {
        id: "delivery-time",
        name: "Turnaround",
        type: "text",
        required: true,
        placeholder: "e.g. 24 hours, 1 week",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "specialty",
        name: "Specialty",
        type: "text",
        required: false,
        placeholder: "e.g. Corporate Law, Tax Law, Estate Planning",
      },
      {
        id: "certification",
        name: "Certification",
        type: "text",
        required: false,
        placeholder: "e.g. CPA, JD, CFP",
      },
      {
        id: "experience",
        name: "Years of Experience",
        type: "text",
        required: false,
        placeholder: "e.g. 5+ years",
      },
    ],
  },

  // ============================================
  // PHOTOGRAPHY & VIDEO
  // ============================================
  {
    id: "photography-video",
    name: "Photography & Video",
    description:
      "Wedding photography, portrait, event videography, product photography, and more.",
    icon: "📷",
    subcategories: [
      { id: "wedding-photography", name: "Wedding Photography" },
      { id: "portrait-photography", name: "Portrait Photography" },
      { id: "event-videography", name: "Event Videography" },
      { id: "product-photography", name: "Product Photography" },
      { id: "real-estate-photography", name: "Real Estate Photography" },
      { id: "drone", name: "Drone Videography" },
      { id: "corporate-photography", name: "Corporate Photography" },
      { id: "photo-editing", name: "Photo Editing & Retouching" },
      { id: "other-photography", name: "Other Photography & Video" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: ["Per Event", "Per Hour", "Package Deal", "Remote Editing"],
      },
      {
        id: "delivery-time",
        name: "Delivery Time",
        type: "text",
        required: true,
        placeholder: "e.g. 2 weeks, 1 week",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Lagos, Nigeria (or Remote)",
      },
    ],
    recommendedTags: [
      {
        id: "style",
        name: "Style",
        type: "text",
        required: false,
        placeholder: "e.g. Documentary, Fine Art, Candid",
      },
      {
        id: "equipment",
        name: "Equipment",
        type: "text",
        required: false,
        placeholder: "e.g. Sony A7III, DJI Drone",
      },
      { id: "portfolio", name: "Portfolio", type: "boolean", required: false },
    ],
  },

  // ============================================
  // VOICE & AUDIO SERVICES
  // ============================================
  {
    id: "voice-audio",
    name: "Voice & Audio Services",
    description:
      "Voice over, podcast production, audio editing, music production, and sound design.",
    icon: "🎙️",
    subcategories: [
      { id: "voice-over", name: "Voice Over" },
      { id: "podcast-production", name: "Podcast Production" },
      { id: "audio-editing", name: "Audio Editing" },
      { id: "music-production", name: "Music Production" },
      { id: "sound-design", name: "Sound Design" },
      { id: "audiobook-narration", name: "Audiobook Narration" },
      { id: "other-audio", name: "Other Voice & Audio" },
    ],
    requiredTags: [
      {
        id: "service-type",
        name: "Service Type",
        type: "select",
        required: true,
        options: ["Per Project", "Per Hour", "Per Minute", "Package Deal"],
      },
      {
        id: "delivery-time",
        name: "Delivery Time",
        type: "text",
        required: true,
        placeholder: "e.g. 2 days, 1 week",
      },

      {
        id: "location",
        name: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Remote, Lagos, Nigeria",
      },
    ],
    recommendedTags: [
      {
        id: "language",
        name: "Language(s)",
        type: "text",
        required: false,
        placeholder: "e.g. English, French, Yoruba",
      },
      {
        id: "accent",
        name: "Accent",
        type: "text",
        required: false,
        placeholder: "e.g. British, American, Nigerian",
      },
      {
        id: "equipment",
        name: "Equipment",
        type: "text",
        required: false,
        placeholder: "e.g. Neumann U87, Rode NT1",
      },
    ],
  },
];

// ============================================
// EXPORT ALL CATEGORIES
// ============================================
export const ALL_CATEGORIES = {
  products: PRODUCT_CATEGORIES,
  services: SERVICE_CATEGORIES,
};

export const getCategoryById = (id: string) => {
  const all = [...PRODUCT_CATEGORIES, ...SERVICE_CATEGORIES];
  return all.find((c) => c.id === id);
};

export const getSubcategoryById = (
  categoryId: string,
  subcategoryId: string,
) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find((s) => s.id === subcategoryId);
};
