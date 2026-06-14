# Haggle Web App AI Build Spec

This file is written for an AI coding agent that needs to build a web app equivalent of the current Flutter `haggle` app.

## Goal

Build a responsive modern web app version of Haggle that preserves the same product idea, screens, features, tone, and visual identity as the Flutter app in this repository.

Haggle is not a generic ecommerce app. It is a negotiation-first marketplace where buyers and sellers discover products, join live sessions, message each other, reserve live reminders, and bargain in real time.

## Core Product Idea

Haggle combines:

- a vertical live discovery feed
- a searchable market for products and services
- direct messaging between buyers and sellers
- seller profiles and public storefronts
- live negotiation rooms for buyers and sellers
- seller creation tools for products, services, live sessions, and room styling
- reserved tickets/reminders for upcoming live sessions

The web version should feel like a polished consumer marketplace product, not an admin dashboard and not a generic SaaS template.

## Source Of Truth In This Repo

Mirror these current Flutter routes and experiences:

- `/login`
- `/signup`
- `/forgot-password`
- `/dashboard`
- `/analytics`
- `/negotiation-room`
- `/seller-profile`
- `/reminders`
- `/conversation`
- `/post-product`
- `/add-service`
- `/schedule-live`
- `/room-styling`
- `/product-detail`
- `/service-detail`
- `/market-search`
- `/edit-profile`

Important note:

- `onboarding_view.dart` is still a placeholder in Flutter. For the web app, replace that placeholder with a polished landing/onboarding gateway that introduces the product and routes users into auth or the app.

## Non-Negotiable Product Requirements

The web app must keep these behaviors:

- buyers can browse live sessions from a rich discovery feed
- buyers can open seller profiles and product or service details
- buyers can reserve tickets for upcoming live sessions
- buyers can enter a live negotiation room and make offers
- buyers can raise a hand in live rooms
- buyers can freeze the seller feed, capture screenshots, and send those references into room chat
- sellers can manage live room participants, accept offers, counter offers, and unmute selected buyers
- sellers have a shipping or accepted-buyers list in the live room
- users can chat directly with sellers using text, voice-note style UI, and shared product cards
- sellers can create product drafts, service drafts, live schedules, and room styling presets
- profiles must support public seller identity, credibility, follower count, rating, response time, and visible listings
- the app must support light and dark theme behavior

## Visual Direction

Use the Flutter app's current design language, then adapt it into a stronger web experience.

### Brand and mood

- warm, premium, human, marketplace-driven
- soft editorial commerce feel
- rounded cards, soft shadows, layered panels
- product-first imagery with live/video emphasis
- not overly corporate
- not cold minimalism
- trust‑first e‑commerce energy (balancing warmth with credibility)

### Design tokens (updated for modern e‑commerce)

- **Primary:** `#F97316` (vibrant, warm orange – action, offers, CTAs)
- **Secondary:** `#2563EB` (trust blue – links, secondary buttons, verification)
- **Accent:** `#FEF3C7` (soft amber – highlights, badges, light backgrounds)
- **Neutral:** `#F9FAFB` (very light gray – cards, backgrounds)
- **Dark:** `#1F2937` (deep slate – text, dark mode base)
- **Success:** `#10B981` (emerald green – confirmations, accepted offers)
- **Warning:** `#F59E0B` (amber – alerts, reminders)
- **Danger:** `#EF4444` (red – errors, destructive actions)

> *Why the change?* The original `#6B4EFF` (purple) felt more experimental than e‑commerce. Blue as secondary adds trust, a proven driver for conversion and marketplace interactions, while the warm primary keeps Haggle’s human, negotiation‑first soul.

### Typography

- Use `Space Grotesk` or the closest equivalent
- Headlines should feel bold, compact, and modern
- Body text should remain calm and readable

### Shape and spacing

- large card radii: 20 to 28px
- pills and chips: fully rounded
- buttons: soft rounded rectangles, usually 14 to 20px radius
- use generous whitespace and layered sections

### Web adaptation rules

- desktop should use a refined app shell with more breathing room
- mobile should keep the app's immersive stacked-card feel
- do not flatten everything into tables
- do not replace the live feed with a boring grid-only homepage
- preserve image-heavy and media-heavy sections
- use subtle motion for route changes, hover states, drawers, and bottom sheets

## Recommended Web Stack

If no stack is specified, use:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui or Radix primitives for accessible overlays and tabs
- Framer Motion for meaningful motion
- Zustand or React Context for local app state
- TanStack Query for async data boundaries

If backend work is not requested yet, build the first version with clean mock data and strong component architecture so real APIs can be attached later.

## App Shell

Build a responsive app shell with:

- desktop left sidebar or compact rail
- mobile bottom navigation
- persistent access to `Home`, `Market`, `Create`, `Messages`, and `Profile`
- secondary access to `Analytics`, `Reminders`, `Settings`, `Theme toggle`, and `Saved deals`

Use the current Flutter dashboard navigation as the baseline:

- Home
- Market
- Create
- Message
- Profile

## Modern E‑commerce UX Principles Applied Throughout

- **Trust first** – display verified badges, response times, return/negotiation policies prominently.
- **Social proof** – show “X people are watching”, “Y offers made”, “Z saved”.
- **Urgency & scarcity** – “Only 3 spots left for this live session”, “Offer ends in 2 hours”.
- **Progressive disclosure** – show key info (price, seller rating) upfront, deeper details on scroll or modal.
- **One‑click actions** – “Make an offer”, “Message seller”, “Reserve ticket” should be immediately reachable.
- **Personalization** – show “Because you liked X”, “Sellers near you”, “Your recent views”.
- **Seamless negotiation** – offer sliders, quick counter buttons, and real‑time feedback.
- **Mobile‑first responsive** – bottom sheets for filters, sticky CTAs on mobile.

---

## Detailed Screen‑by‑Screen UI/UX Specifications

For each screen, follow the modern e‑commerce enhancements described below.

### 1. Landing / Onboarding Gateway

**What to do:** Build a hero section with two value propositions (buyer vs seller). Include a live demo video or animated mock of the negotiation room. Add a floating CTA bar that sticks on scroll.

**How:** 
- Above the fold: headline "Negotiate, don't just buy." Subhead: "Live negotiation marketplace – you set the price."
- Two cards: "I'm a buyer" (leads to live feed) and "I'm a seller" (leads to create hub or signup).
- Scroll section: featured products with real offer counts and “X people negotiating”.
- Footer with trust badges: “100% human support”, “Secure offers”, “No hidden fees”.

### 2. Authentication

**What to do:** Split layout: left side brand story + testimonial carousel, right side form. Add social login (Google, Apple) as primary options, email as secondary.

**How:**
- After successful login, redirect to the feed, not a generic dashboard.
- On signup, ask for role (buyer/seller) and pre‑fill profile with basic info.
- Forgot password: use one‑time code sent to email/phone.

### 3. Home / Live Feed

**What to do:** Make it a TikTok‑style vertical swipe feed on mobile, a three‑column masonry with auto‑play videos on desktop. Each card must show live viewer count and a live “Offer wave” animation when someone makes a new offer.

**How:**
- On mobile: full‑width card, video preview autoplays muted, tap to join live room.
- On desktop: centered feed with left rail for recommended sellers, right rail for trending offers.
- Interaction: swipe up to see next live session, tap “Make offer” to open a bottom sheet with a slider and preset amounts (e.g., -10%, -20%).
- **E‑commerce upgrade:** add a “Notify me when price drops” button below the offer CTA.

### 4. Market (Browse & Discovery)

**What to do:** Replace a simple grid with a smart categorized feed. Use a sticky top bar with filter chips (Price, Category, Live now, Seller rating). Add a “Negotiable only” toggle.

**How:**
- On load: show “Trending now” horizontal scroll, then “Recommended for you” grid.
- Each product card: image, title, seller rating, current price, number of active offers.
- On hover (desktop): show “Quick offer” input and “Message seller” button.
- On mobile: long‑press card to add to watchlist.

### 5. Search

**What to do:** Build a search that understands intent – “used iPhone under $400”, “live session tomorrow”. Include voice search icon (microphone) on mobile.

**How:**
- As user types, show live suggestions with categories and recent searches.
- After search, results page with sort by: “Most offers”, “Ending soon”, “Price low‑high”.
- Add facet filters as a collapsible sidebar on desktop, bottom sheet on mobile.

### 6. Product Detail

**What to do:** Create a layout that puts negotiation front and center. Above the fold: image gallery, price, “Make an offer” button, and a live offer history graph.

**How:**
- Sticky header on scroll: simplified CTA “Offer $X” always visible.
- Offer section: show last 5 offers (anonymized) to build transparency. Example: “User *** made an offer of $45 2 mins ago”.
- Seller section: response time, acceptance rate, “Similar products from this seller”.
- **Modern e‑commerce flow:** Add a “Bundle & save” suggestion – other products from same seller that could be combined for a better offer.
- After making an offer, show pending status and a “Chat with seller” shortcut.

### 7. Service Detail

**What to do:** Focus on scope and delivery. Add a “Request custom quote” button that opens a form with budget, timeline, and description.

**How:**
- Show portfolio gallery, average response time, and “Completed X projects”.
- Use a step‑by‑step breakdown: what’s included, what’s extra, typical turnaround.
- Instead of “Make offer”, use “Propose budget” with a slider and a message field.
- **E‑commerce twist:** Show “Similar services you might need” as cross‑sell.

### 8. Messages

**What to do:** Transform into a full negotiation inbox. Each conversation shows the product/service image, last offer amount, and unread count.

**How:**
- Two‑pane desktop: left list, right chat. On mobile: list first, then detail.
- Inside chat, allow quick offer actions: a chip that says “Send new offer” that opens a slider without leaving the conversation.
- Voice notes: show waveform and playback speed control.
- Product cards inside chat are interactive – tapping opens a mini detail sheet with “Accept offer” button.

### 9. Seller Public Profile

**What to do:** Make it a storefront with data‑driven trust signals. Show “Verified by Haggle”, “100% response rate”, “Member since”, and a “Ask a question” button that opens chat.

**How:**
- Cover image can be a video loop of the seller’s best live session.
- Tabs: Products (grid), Live sessions (cards with countdown timers), Reviews (star ratings + written).
- Add a “Follow” button that also enables push notifications for that seller’s upcoming lives.

### 10. User Profile / Seller Workspace

**What to do:** Differentiate between buyer view and seller view. For sellers, add a performance dashboard with quick actions (Start live, Add product).

**How:**
- Buyer view: show “Saved deals”, “My tickets”, “Recent negotiations”.
- Seller view: show “Today’s active deals”, “Conversion rate”, “Pending offers”, and a “Go live now” button.
- Edit profile: inline editing with avatar cropper and business hour settings.

### 11. Reminders / Tickets

**What to do:** Calendar view + list view. Allow adding to Google Calendar / Apple Calendar via .ics file.

**How:**
- Upcoming tickets have a “Join live” button that becomes active 5 minutes before start.
- Past tickets show “Watch recording” (mock for now) and “Rate seller”.
- Send browser push notification 15 minutes before live session.

### 12. Analytics

**What to do:** Seller‑centric analytics with actionable insights. Show “Top performing products”, “Best offer acceptance time”, “Live session attendance rate”.

**How:**
- Use chart library (Recharts) for offer volume over time.
- Add a “Compare to similar sellers” anonymized benchmark.
- Export CSV for sales and offer data.

### 13. Create Hub

**What to do:** Wizard‑style creation. Show a progress tracker for incomplete drafts (“Finish your product listing”).

**How:**
- Four cards: “Post product”, “Add service”, “Schedule live”, “Room styling”. Each card shows completion status.
- After creating a product, immediately suggest “Schedule a live session for this product”.
- Include a “Preview as buyer” button that shows a mock of how the product will appear in feed.

### 14. Post Product

**What to do:** Multi‑step form: 1) Basic info, 2) Pricing & negotiation settings, 3) Media, 4) Preview. Auto‑save draft.

**How:**
- Pricing step: allow “Minimum acceptable offer” (hidden from buyers) and “Auto‑counter offer” rules (e.g., counter 5% below asking).
- Media: drag‑drop upload with priority order. AI alt‑text suggestion.
- After publish, show a success screen with “Share on social” and “Schedule live” CTAs.

### 15. Add Service

**What to do:** Similar multi‑step but with service‑specific fields: delivery time, revisions, required client info.

**How:**
- Use a pricing matrix: “Base price” + “Add‑ons” (e.g., rush delivery extra $20).
- Add a Q&A section where buyers can ask common pre‑sale questions.
- Preview shows a “Request quote” button mock.

### 16. Schedule Live

**What to do:** Calendar picker with timezone detection. Show existing scheduled lives to avoid overlap.

**How:**
- After date/time selection, show a “Set reminder message” that will be sent to followers.
- Allow attaching a product or service from the seller’s existing listings.
- Option to make the live “private” (only ticket holders) or “public”.

### 17. Room Styling

**What to do:** Presets plus a simple customizer: background color, logo overlay, title banner.

**How:**
- Three presets: “Boutique calm” (warm pastel backdrop), “Studio focus” (dark cinematic), “Warm social” (soft orange gradients).
- Preview window shows how it looks in buyer mode.
- Save styling as default for future lives.

### 18. Edit Profile

**What to do:** Inline or full‑page editor with real‑time preview of the public profile.

**How:**
- Fields: profile picture (crop tool), cover photo (recommended aspect ratio 3:1), bio (character limit with emoji support).
- Privacy settings: hide email, show only username, disable direct messages from non‑followers.

### 19. Negotiation Room (Buyer & Seller Modes)

**Most critical screen – get this right.**

#### Buyer Mode

**What to do:** Stage area shows seller’s video (or mock image) plus live offer ticker. Bottom bar has offer slider, hand raise, freeze frame, and screenshot.

**How:**
- Offer slider: real‑time feedback “Your offer: $X – seller’s last counter: $Y”. Preset chips: -5%, -10%, match counter.
- Freeze & screenshot: click “Freeze” pauses the stage image, then “Capture” saves frame and automatically attaches to chat with a comment field.
- Raise hand: seller sees notification and can unmute buyer.
- **Modern e‑commerce flow:** when an offer is accepted, show a checkout modal with shipping details and a “Pay deposit” button (mock for now) to secure the deal.

#### Seller Mode

**What to do:** Participant grid with filtering (hand raised, made offer, muted). Drawer for accepted buyers.

**How:**
- Each participant tile shows current offer. Seller can click to counter with a slider.
- Shipping drawer: after accepting an offer, the buyer moves to this list with address collection and order status.
- Live timer: shows elapsed time; seller can extend the live session by 10 minutes.
- **E‑commerce upgrade:** Show “Offer heatmap” – which participants are most active, to prioritize negotiations.

#### Shared Room Features

- Chat: shows system messages like “User raised hand”, “Offer of $50 from @buyer1”.
- Real‑time presence: show who is typing, who is viewing the product.
- For mock implementation, simulate events every 3 seconds with fake data but keep UI ready for WebSocket.

---

## Data Model Baseline

Use these entities as the initial frontend domain model:

```ts
type SellerProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  description: string;
};

type SellerLiveSession = {
  id: string;
  title: string;
  schedule: string;
  status: "Ongoing" | "Scheduled" | "Upcoming" | "Live now";
  preview: string;
  buyerBenefits: string[];
};

type SellerProfile = {
  id: string;
  name: string;
  username: string;
  businessName: string;
  tradeMark: string;
  avatarUrl: string;
  coverImageUrl: string;
  bio: string;
  sellsSummary: string;
  followers: string;
  rating: string;
  responseTime: string;
  products: SellerProduct[];
  ongoingLives: SellerLiveSession[];
  upcomingLives: SellerLiveSession[];
};

type MarketService = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  seller: SellerProfile;
};

type NegotiationParticipant = {
  id: string;
  name: string;
  imageUrl: string;
  offer: number;
  isMuted: boolean;
  isHandRaised: boolean;
};

type ReminderTicket = {
  id: string;
  sellerId: string;
  liveId: string;
};

type ChatMessage = {
  id: string;
  sender: "buyer" | "seller";
  type: "text" | "voice" | "product" | "system" | "screenshot";
  text?: string;
  createdAt: string;
};

Interaction Notes
reserved live tickets should persist in client state

search should keep recent searches

theme toggle should persist

profile sharing should generate a public seller URL pattern

room screenshot capture stores image in IndexedDB for mock demo

voice notes use browser recording API with mock storage

Realtime And Backend Planning
If implementing backend later, design around:

auth

user profiles

seller storefronts

product and service listings

live session scheduling

reminder reservations

direct messaging

room presence

offer and counteroffer events

screenshot attachments

Suggested future services:

WebRTC for live voice or video

WebSocket layer for room presence and offer updates

Postgres for relational data

object storage for media

Modern Web UX Rules
prioritize strong responsive behavior from mobile through wide desktop

use sticky headers, drawers, tabs, sheets, and hover affordances where they improve usability

keep motion tasteful and purposeful

preserve warmth in colors and writing

copy should sound human, calm, and confidence-building

use realistic demo content and media, not placeholder lorem ipsum

Definition Of Done
The web version is successful when:

the main Flutter experiences are visibly represented on web

the app feels like the same Haggle product, not a different redesign

buyers can discover, reserve, message, and negotiate

sellers can present products and services, schedule lives, and manage live interactions

the UI feels modern, premium, and consumer-facing on both desktop and mobile

Build Priority Order
Landing and auth

App shell and navigation

Home live feed

Market and search

Seller profile and product or service detail pages

Messages and conversation experience

Create hub and creation flows

Reminders and analytics

Negotiation room buyer mode

Negotiation room seller mode

Final Instruction To The AI Builder
Do not simplify Haggle into a normal storefront.

Build it as a live negotiation marketplace with:

strong visual identity

media-rich discovery

warm premium consumer UI

buyer and seller flows

negotiation-specific interactions

responsive modern web behavior

Now, also implement the specific UI/UX changes described above for each screen. They are not optional – they define the modern e‑commerce feel. When in doubt, prioritize trust signals, offer transparency, and one‑tap negotiation actions.

When unsure, choose the option that preserves immersion, trust, and live marketplace energy.