# Haggle Web App — Project Status and Build Guide

This README describes the current web implementation, records completed work, and gives the remaining implementation priorities. The UI/UX specifications later in this document describe the intended product; they are not a claim that every listed feature is already complete.

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

## Project Status

Haggle Web is an active Next.js App Router application connected to the existing API. The app has route coverage for the main marketplace, listing creation and detail, seller profile, messaging, reminders, analytics, and live-room experiences. A route being present does not mean every interaction in the target specification below is complete; use the implementation notes and roadmap in this section to distinguish shipped behavior from remaining work.

### Implemented

- Product and service listing creation/editing, with category and subcategory-specific attributes. Inapplicable attributes are omitted from the form, required attributes are validated, and stale attribute values are removed when category selections change.
- Product and service detail experiences with gallery/media browsing, seller information, reviews, favorites, and related listing content.
- Service detail custom quote requests that open a direct conversation with the request details as the initial message. Both `/service-detail/[id]` and the legacy query-string route are supported.
- Marketplace product/service discovery using the catalog API's latest, trending, and authenticated recommendation feeds, with category filtering and load-more pagination.
- Review summaries and full review lists backed by the catalog API, including create/edit/delete and pagination.
- Catalog-backed save/unsave behavior, authenticated interaction events, and listing-owner engagement metrics.
- The profile's Favorites tab fetches the current user's saved listings from the authenticated, paginated catalog endpoint, renders the existing product and service cards, and supports unsaving listings.
- Profile listing actions to archive listings and republish archived or draft listings after confirmation and required-field/media validation.
- Category applicability regression tests and archive-listing regression tests.

### Next priorities

1. **Complete the core buyer/seller journey:** verify discovery → listing detail → offer or service request → conversation, and fill gaps in state handling, feedback, and navigation.
2. **Close remaining screen-spec gaps:** compare the live feed, search, public seller profile, messages, reminders, analytics, create hub, live scheduling, room styling, and negotiation room against their target sections below. Implement missing interactions rather than assuming route coverage is sufficient.
3. **Finish negotiation and live-session behavior:** connect offer actions and product selections to the negotiation flow; verify buyer and seller room actions, presence, and live updates against the available backend capabilities.
4. **Harden listing and category flows:** test category/subcategory switching and edit/publish behavior for every supported category, including empty, loading, error, and legacy listing data.
5. **Stabilize project validation:** resolve the current TypeScript check blocker (`@/components/workspace-pages` imports), address lint errors, and expand automated tests for the critical user journeys.
6. **Prepare for release:** validate responsive layouts and accessibility, confirm API authorization/error handling, and document required environment configuration and deployment steps.

### Validation commands

```bash
npm run lint
npx tsc --noEmit
npm run test:archive
node --experimental-strip-types --test tests/category-applicability.test.mjs
```

The focused archive and category applicability tests pass. The full TypeScript check currently reports unresolved `@/components/workspace-pages` imports; lint also reports diagnostics in application components and should be treated as unfinished validation rather than a clean release gate.

## Source Of Truth In This Repo

The Flutter app provides product and interaction references for these routes and experiences:

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

## Recently Implemented Marketplace Behavior

The following notes describe behavior present in the web implementation; they should be kept in sync with code changes.

The current web implementation includes the following product and service detail behavior:

- Product posting renders the `Size` requirement as a multi-select control. It offers XS, S, M, L, XL, XXL, XXXL, One Size, and numeric sizes 28 through 46. Chosen sizes appear as removable capsules.
- The posting form stores chosen sizes as a comma-separated value inside the existing pipe-delimited listing tags string, for example `size:XS, M`. This keeps the current backend tags format.
- Product detail maps the saved Size tag into separate available-size buttons. Buyers can select one size at a time. That selection currently changes the button state only; it is not yet passed into the negotiation flow.
- Structured product tags render with their labels, such as `Brand: Nike` and `Condition: Good`. The Size tag is not repeated as a comma-separated feature badge; it appears in the size selector. Unstructured tags remain plain feature badges.
- The product detail cover image uses a fixed responsive height: 320px by default, 380px at the small breakpoint, and 420px on large screens.
- Product and service details show a rating summary, review count, and up to three review previews below the gallery. **Show more** replaces the detail content in the main market panel with the full review list. The existing market header back control returns to the selected detail, and from there it returns to the marketplace. The reviews view has no separate back button.
- Service detail uses the product detail layout pattern with a bounded portfolio gallery, selectable thumbnails and image viewer, catalog-backed saving, service scope and delivery facts, and more published services from the same seller. Buyers can submit a custom quote request with budget, timeline, and project details; it starts a direct conversation and sends the request as the opening message.
- Service detail is available from both `/service-detail/[id]` and the legacy `/service-detail?service=<id>` URL.
- Review summaries and reviews load from the catalog API for products and services. The normalized `ListingReviewData` shape (`rating`, `reviewCount`, `reviews`, and `isSample`) is retained; live API data sets `isSample` to `false`. Reviewers can create, edit, and delete their review, and the full review view supports pagination and uses the marketplace header back control.
- The market uses the catalog's latest, trending, and authenticated recommendation feeds for products and services. Feed order comes from the backend; category filtering is sent with the request, search stays in the existing UI, and browse views support load-more pagination.
- Product and service favorite buttons call the catalog save/unsave endpoints and update the existing persisted saved-item state only after a successful response. The frontend does not invent a saved-list response shape.
- Archived products and services can be republished from the profile listing menu after confirmation. Publishing validates the saved listing's required fields and media; incomplete listings can be edited and saved as drafts, which can then also be published from the menu.
- Category tags can be restricted to applicable subcategories. The product and service creation forms, archive republish validation, and regression tests use the same applicability resolver, so an irrelevant attribute is neither requested nor required for that selection.
- Listing detail requests continue through the existing authenticated API client, which carries the configured `/api/v1` base URL and bearer token. Catalog requests do not send the store's `x-user-id` header; the API identifies the user from the token.
- Authenticated listing selections and completed product-video watches are sent as idempotent interaction events. Listing views come from the normal detail request and backend `view_count`; the UI does not emit separate view events or locally increment counts.
- Listing owners see per-listing engagement metrics on product or service details, with 7, 30, or 90 day windows. The backend remains responsible for authorizing access.

Relevant implementation files:

- Product creation: `appPages/PostProductPage.tsx`
- Product detail: `components/market/sections/MarketProductDetail.tsx`
- Product and service detail routes: `app/product-detail/[id]/page.tsx`, `app/service-detail/[id]/page.tsx`
- Service detail: `components/market/sections/MarketServiceDetail.tsx`
- Shared review views: `components/market/sections/ListingReviews.tsx`
- Review data boundary and hook: `services/listing-reviews.ts`, `components/market/hooks/useListingReviews.ts`
- Catalog API contracts: `services/catalog.ts`
- Discovery and save hooks: `components/market/hooks/useListingFeed.ts`, `components/market/hooks/useListingSave.ts`
- Owner metrics: `components/market/sections/ListingAnalytics.tsx`
- Product tag normalization: `services/mappers.ts`, `types/product.ts`

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

## Current Web Stack

- Next.js App Router (`next` 16.2.6) and React 19
- TypeScript and Tailwind CSS
- Zustand for shared client state and TanStack Query for asynchronous data
- Framer Motion for selected UI transitions
- Existing authenticated API client and catalog endpoints for marketplace data

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

These sections are the target experience and acceptance guidance for the remaining work. Some details below are implemented, some are partial, and some are still planned; consult **Project Status** above and inspect the relevant screen before changing it.

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
- Available sizes from the listing's `size:` tag are displayed as individually selectable buttons. Render keyed attributes with their labels (for example, `Brand: Nike`) and omit the combined Size tag from generic feature badges.
- Keep the lead product image at a bounded responsive height so it does not stretch alongside long descriptions.
- Below the product images, show the rating, total review count, and the first three reviews. “Show more” replaces the main market detail panel with the full review list. The market header back control returns to product details.
- **Modern e‑commerce flow:** Add a “Bundle & save” suggestion – other products from same seller that could be combined for a better offer.
- After making an offer, show pending status and a “Chat with seller” shortcut.

### 7. Service Detail

**What to do:** Focus on scope and delivery. Add a “Request custom quote” button that opens a form with budget, timeline, and description.

**How:**
- Show portfolio gallery, average response time, and “Completed X projects”.
- Below the service gallery, show the rating, total review count, and the first three reviews. “Show more” replaces the main market detail panel with the full review list. Use the market header back control to return to service details.
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
- Render the Size requirement as a multi-select dropdown with removable selected-size capsules. Serialize selected sizes as comma-separated text in the existing tags string so the backend format stays compatible.
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

The following types are a conceptual domain reference from the original build brief. Prefer the current API contracts and application types when implementing or changing data flows.

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

type Seller = {
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
  seller: Seller;
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

## Interaction and Integration Notes

Treat these as product requirements to verify against the implementation, not assumptions that they are all shipped:

- Reserved live tickets, recent searches, and theme preferences should persist according to the existing app behavior.
- Profile sharing should use a public seller URL.
- Screenshot attachments and voice notes must follow current browser support and backend capabilities; do not rely on mock-only storage for production behavior.

The app already uses the existing API for marketplace and listing operations. Further live-session integrations should be designed around the backend's actual capabilities and contracts:

- WebRTC or an equivalent provider for live audio/video, if not provided by the backend.
- WebSocket or another realtime channel for room presence, chat, and offers, if not provided by the backend.
- The backend's relational data and media-storage systems; avoid adding duplicate client-side persistence or services without a concrete requirement.

## Modern Web UX Rules

- Prioritize responsive behavior from mobile through wide desktop.
- Use sticky headers, drawers, tabs, sheets, and hover affordances where they improve usability.
- Keep motion tasteful and purposeful.
- Preserve warmth in colors and writing.
- Copy should sound human, calm, and confidence-building.
- Use realistic content and media, not placeholder lorem ipsum.

## Definition Of Done

The web version is complete when:

- The main Haggle experiences are represented on web and their primary journeys work end to end.
- The app feels like the same Haggle product, not a generic storefront redesign.
- Buyers can discover listings, reserve live sessions, message, and negotiate.
- Sellers can present products and services, schedule lives, and manage live interactions.
- Critical flows have loading, empty, success, and error states, and pass targeted automated tests.
- The UI is accessible, responsive, and polished on both desktop and mobile.

## Product Acceptance Criteria

Do not simplify Haggle into a normal storefront. The completed product should preserve a strong visual identity, media-rich discovery, a warm premium consumer UI, buyer and seller flows, negotiation-specific interactions, and responsive modern web behavior.

Use the screen specifications above as the target when implementing the next priorities. Prioritize trust signals, offer transparency, and direct negotiation actions while preserving the marketplace's warm, live feel.
