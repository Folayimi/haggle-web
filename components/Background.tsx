// components/Background.tsx
import React from 'react';
import styles from './Background.module.css';

export default function Background() {
  return (
    <div className={styles.backgroundContainer}>
      <svg
        viewBox="0 0 1200 800"
        className={styles.backgroundSvg}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ background: 'transparent' }}
      >
        {/* ============================================ */}
        {/* LAYER 1: HANDSHAKE ICONS (Negotiation) */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Handshake 1 */}
          <path d="M80 120 C80 105, 95 100, 100 110 C105 105, 115 105, 115 115 C120 110, 130 115, 125 125 C135 125, 135 135, 125 135 C130 140, 125 150, 115 145 C115 155, 105 155, 105 145 C95 150, 90 140, 95 135 C85 135, 85 125, 95 125 C90 115, 85 120, 80 120Z" strokeWidth="1.2"/>
          <path d="M100 110 C105 100, 115 100, 120 110" strokeWidth="0.8"/>
          <path d="M105 145 C105 155, 115 155, 115 145" strokeWidth="0.8"/>
          <path d="M80 120 L90 115" strokeWidth="0.6"/>
          
          {/* Handshake 2 */}
          <path d="M680 180 C680 165, 695 160, 700 170 C705 165, 715 165, 715 175 C720 170, 730 175, 725 185 C735 185, 735 195, 725 195 C730 200, 725 210, 715 205 C715 215, 705 215, 705 205 C695 210, 690 200, 695 195 C685 195, 685 185, 695 185 C690 175, 685 180, 680 180Z" strokeWidth="1.2"/>
          <path d="M700 170 C705 160, 715 160, 720 170" strokeWidth="0.8"/>
          <path d="M705 205 C705 215, 715 215, 715 205" strokeWidth="0.8"/>

          {/* Handshake 3 */}
          <path d="M380 720 C380 705, 395 700, 400 710 C405 705, 415 705, 415 715 C420 710, 430 715, 425 725 C435 725, 435 735, 425 735 C430 740, 425 750, 415 745 C415 755, 405 755, 405 745 C395 750, 390 740, 395 735 C385 735, 385 725, 395 725 C390 715, 385 720, 380 720Z" strokeWidth="1.2"/>
          <path d="M400 710 C405 700, 415 700, 420 710" strokeWidth="0.8"/>
          <path d="M405 745 C405 755, 415 755, 415 745" strokeWidth="0.8"/>

          {/* Handshake 4 (additional) */}
          <path d="M1000 580 C1000 565, 1015 560, 1020 570 C1025 565, 1035 565, 1035 575 C1040 570, 1050 575, 1045 585 C1055 585, 1055 595, 1045 595 C1050 600, 1045 610, 1035 605 C1035 615, 1025 615, 1025 605 C1015 610, 1010 600, 1015 595 C1005 595, 1005 585, 1015 585 C1010 575, 1005 580, 1000 580Z" strokeWidth="1.2"/>
          <path d="M1020 570 C1025 560, 1035 560, 1040 570" strokeWidth="0.8"/>
          <path d="M1025 605 C1025 615, 1035 615, 1035 605" strokeWidth="0.8"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 2: WAVE / VOICE COMMUNICATION ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Wave 1 - Sound waves */}
          <path d="M120 280 Q130 260 140 280 Q150 300 160 280" strokeWidth="2"/>
          <path d="M110 290 Q120 260 130 290 Q140 320 150 290 Q160 260 170 290" strokeWidth="1.5"/>
          <path d="M100 300 Q110 260 120 300 Q130 340 140 300 Q150 260 160 300 Q170 340 180 300" strokeWidth="1"/>
          
          {/* Wave 2 */}
          <path d="M650 320 Q660 300 670 320 Q680 340 690 320" strokeWidth="2"/>
          <path d="M640 330 Q650 300 660 330 Q670 360 680 330 Q690 300 700 330" strokeWidth="1.5"/>
          <path d="M630 340 Q640 300 650 340 Q660 380 670 340 Q680 300 690 340 Q700 380 710 340" strokeWidth="1"/>

          {/* Wave 3 */}
          <path d="M280 680 Q290 660 300 680 Q310 700 320 680" strokeWidth="2"/>
          <path d="M270 690 Q280 660 290 690 Q300 720 310 690 Q320 660 330 690" strokeWidth="1.5"/>

          {/* Wave 4 */}
          <path d="M900 480 Q910 460 920 480 Q930 500 940 480" strokeWidth="2"/>
          <path d="M890 490 Q900 460 910 490 Q920 520 930 490 Q940 460 950 490" strokeWidth="1.5"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 3: MICROPHONE / VOICE NOTE ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Mic 1 */}
          <rect x="300" y="180" width="12" height="18" rx="3" strokeWidth="1.5"/>
          <path d="M306 198 C306 208, 312 208, 312 198" strokeWidth="1.2"/>
          <path d="M300 195 C300 200, 312 200, 312 195" strokeWidth="0.8"/>
          <path d="M306 180 C306 170, 312 170, 312 180" strokeWidth="1"/>
          
          {/* Mic 2 */}
          <rect x="850" y="180" width="12" height="18" rx="3" strokeWidth="1.5"/>
          <path d="M856 198 C856 208, 862 208, 862 198" strokeWidth="1.2"/>
          <path d="M850 195 C850 200, 862 200, 862 195" strokeWidth="0.8"/>
          <path d="M856 180 C856 170, 862 170, 862 180" strokeWidth="1"/>

          {/* Mic 3 */}
          <rect x="520" y="620" width="12" height="18" rx="3" strokeWidth="1.5"/>
          <path d="M526 638 C526 648, 532 648, 532 638" strokeWidth="1.2"/>
          <path d="M520 635 C520 640, 532 640, 532 635" strokeWidth="0.8"/>
          <path d="M526 620 C526 610, 532 610, 532 620" strokeWidth="1"/>

          {/* Mic 4 */}
          <rect x="150" y="550" width="12" height="18" rx="3" strokeWidth="1.5"/>
          <path d="M156 568 C156 578, 162 578, 162 568" strokeWidth="1.2"/>
          <path d="M150 565 C150 570, 162 570, 162 565" strokeWidth="0.8"/>
          <path d="M156 550 C156 540, 162 540, 162 550" strokeWidth="1"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 4: VIDEO CALL / CAMERA ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Video 1 */}
          <rect x="530" y="80" width="35" height="25" rx="4" strokeWidth="1.5"/>
          <circle cx="547" cy="92" r="7" strokeWidth="1.2"/>
          <path d="M565 85 L580 78 L580 106 L565 99" strokeWidth="1.5"/>
          
          {/* Video 2 */}
          <rect x="200" y="420" width="35" height="25" rx="4" strokeWidth="1.5"/>
          <circle cx="217" cy="432" r="7" strokeWidth="1.2"/>
          <path d="M235 425 L250 418 L250 446 L235 439" strokeWidth="1.5"/>

          {/* Video 3 */}
          <rect x="950" y="550" width="35" height="25" rx="4" strokeWidth="1.5"/>
          <circle cx="967" cy="562" r="7" strokeWidth="1.2"/>
          <path d="M985 555 L1000 548 L1000 576 L985 569" strokeWidth="1.5"/>

          {/* Video 4 */}
          <rect x="70" y="700" width="35" height="25" rx="4" strokeWidth="1.5"/>
          <circle cx="87" cy="712" r="7" strokeWidth="1.2"/>
          <path d="M105 705 L120 698 L120 726 L105 719" strokeWidth="1.5"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 5: BROADCAST / MEGAPHONE ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Broadcast 1 */}
          <path d="M80 380 L80 410 L95 410 L95 380 Z" strokeWidth="2"/>
          <path d="M60 395 L80 395" strokeWidth="2"/>
          <path d="M60 388 L60 402" strokeWidth="2"/>
          <path d="M110 388 C120 380, 130 380, 130 395 C130 410, 120 410, 110 402" strokeWidth="1.5"/>
          <path d="M100 375 L105 380" strokeWidth="1"/>
          <path d="M100 410 L105 405" strokeWidth="1"/>
          
          {/* Broadcast 2 */}
          <path d="M750 620 L750 650 L765 650 L765 620 Z" strokeWidth="2"/>
          <path d="M730 635 L750 635" strokeWidth="2"/>
          <path d="M730 628 L730 642" strokeWidth="2"/>
          <path d="M780 628 C790 620, 800 620, 800 635 C800 650, 790 650, 780 642" strokeWidth="1.5"/>

          {/* Broadcast 3 */}
          <path d="M420 320 L420 350 L435 350 L435 320 Z" strokeWidth="2"/>
          <path d="M400 335 L420 335" strokeWidth="2"/>
          <path d="M400 328 L400 342" strokeWidth="2"/>
          <path d="M450 328 C460 320, 470 320, 470 335 C470 350, 460 350, 450 342" strokeWidth="1.5"/>

          {/* Broadcast 4 */}
          <path d="M1050 280 L1050 310 L1065 310 L1065 280 Z" strokeWidth="2"/>
          <path d="M1030 295 L1050 295" strokeWidth="2"/>
          <path d="M1030 288 L1030 302" strokeWidth="2"/>
          <path d="M1080 288 C1090 280, 1100 280, 1100 295 C1100 310, 1090 310, 1080 302" strokeWidth="1.5"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 6: CHAT / MESSAGE BUBBLE ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Chat 1 */}
          <rect x="600" y="450" width="45" height="28" rx="6" strokeWidth="1.5"/>
          <path d="M610 478 L605 490 L625 478" strokeWidth="1.2"/>
          <circle cx="615" cy="464" r="2.5" strokeWidth="1"/>
          <circle cx="628" cy="464" r="2.5" strokeWidth="1"/>
          <circle cx="641" cy="464" r="2.5" strokeWidth="1"/>
          
          {/* Chat 2 */}
          <rect x="280" y="550" width="45" height="28" rx="6" strokeWidth="1.5"/>
          <path d="M290 578 L285 590 L305 578" strokeWidth="1.2"/>
          <circle cx="295" cy="564" r="2.5" strokeWidth="1"/>
          <circle cx="308" cy="564" r="2.5" strokeWidth="1"/>
          <circle cx="321" cy="564" r="2.5" strokeWidth="1"/>

          {/* Chat 3 */}
          <rect x="850" y="250" width="45" height="28" rx="6" strokeWidth="1.5"/>
          <path d="M860 278 L855 290 L875 278" strokeWidth="1.2"/>
          <circle cx="865" cy="264" r="2.5" strokeWidth="1"/>
          <circle cx="878" cy="264" r="2.5" strokeWidth="1"/>
          <circle cx="891" cy="264" r="2.5" strokeWidth="1"/>

          {/* Chat 4 */}
          <rect x="100" y="480" width="45" height="28" rx="6" strokeWidth="1.5"/>
          <path d="M110 508 L105 520 L125 508" strokeWidth="1.2"/>
          <circle cx="115" cy="494" r="2.5" strokeWidth="1"/>
          <circle cx="128" cy="494" r="2.5" strokeWidth="1"/>
          <circle cx="141" cy="494" r="2.5" strokeWidth="1"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 7: CART / SHOPPING CART ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Cart 1 */}
          <path d="M100 200 L110 200 L115 220 L150 220 L155 200 L165 200" strokeWidth="1.5"/>
          <path d="M115 210 L150 210" strokeWidth="1.2"/>
          <circle cx="120" cy="235" r="5" strokeWidth="1.2"/>
          <circle cx="145" cy="235" r="5" strokeWidth="1.2"/>
          <path d="M150 200 L160 190" strokeWidth="1"/>
          
          {/* Cart 2 */}
          <path d="M700 500 L710 500 L715 520 L750 520 L755 500 L765 500" strokeWidth="1.5"/>
          <path d="M715 510 L750 510" strokeWidth="1.2"/>
          <circle cx="720" cy="535" r="5" strokeWidth="1.2"/>
          <circle cx="745" cy="535" r="5" strokeWidth="1.2"/>
          <path d="M750 500 L760 490" strokeWidth="1"/>

          {/* Cart 3 */}
          <path d="M450 100 L460 100 L465 120 L500 120 L505 100 L515 100" strokeWidth="1.5"/>
          <path d="M465 110 L500 110" strokeWidth="1.2"/>
          <circle cx="470" cy="135" r="5" strokeWidth="1.2"/>
          <circle cx="495" cy="135" r="5" strokeWidth="1.2"/>

          {/* Cart 4 */}
          <path d="M350 400 L360 400 L365 420 L400 420 L405 400 L415 400" strokeWidth="1.5"/>
          <path d="M365 410 L400 410" strokeWidth="1.2"/>
          <circle cx="370" cy="435" r="5" strokeWidth="1.2"/>
          <circle cx="395" cy="435" r="5" strokeWidth="1.2"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 8: BASKET / SHOPPING BASKET ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Basket 1 */}
          <path d="M120 350 L135 345 L165 345 L180 350 L170 380 L130 380 Z" strokeWidth="1.5"/>
          <path d="M135 345 L140 330 L160 330 L165 345" strokeWidth="1.2"/>
          <path d="M125 355 L175 355" strokeWidth="1"/>
          <path d="M145 360 L145 375" strokeWidth="0.8"/>
          <path d="M155 360 L155 375" strokeWidth="0.8"/>
          
          {/* Basket 2 */}
          <path d="M850 400 L865 395 L895 395 L910 400 L900 430 L860 430 Z" strokeWidth="1.5"/>
          <path d="M865 395 L870 380 L890 380 L895 395" strokeWidth="1.2"/>
          <path d="M855 405 L905 405" strokeWidth="1"/>

          {/* Basket 3 */}
          <path d="M550 280 L565 275 L595 275 L610 280 L600 310 L560 310 Z" strokeWidth="1.5"/>
          <path d="M565 275 L570 260 L590 260 L595 275" strokeWidth="1.2"/>
          <path d="M555 285 L605 285" strokeWidth="1"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 9: OFFER / PRICE TAG ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Tag 1 */}
          <path d="M250 270 L275 270 L290 285 L290 310 L265 310 L250 295 Z" strokeWidth="1.5"/>
          <text x="257" y="295" fontSize="10" fill="#1F2937" fontWeight="bold">$</text>
          <path d="M275 270 L285 260" strokeWidth="1"/>
          
          {/* Tag 2 */}
          <path d="M800 720 L825 720 L840 735 L840 760 L815 760 L800 745 Z" strokeWidth="1.5"/>
          <text x="807" y="745" fontSize="10" fill="#1F2937" fontWeight="bold">₦</text>
          <path d="M825 720 L835 710" strokeWidth="1"/>

          {/* Tag 3 */}
          <path d="M480 480 L505 480 L520 495 L520 520 L495 520 L480 505 Z" strokeWidth="1.5"/>
          <text x="487" y="505" fontSize="10" fill="#1F2937" fontWeight="bold">$</text>

          {/* Tag 4 */}
          <path d="M1050 700 L1075 700 L1090 715 L1090 740 L1065 740 L1050 725 Z" strokeWidth="1.5"/>
          <text x="1057" y="725" fontSize="10" fill="#1F2937" fontWeight="bold">₦</text>
        </g>

        {/* ============================================ */}
        {/* LAYER 10: TICKET / REMINDER ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Ticket 1 */}
          <rect x="150" y="200" width="35" height="24" rx="3" strokeWidth="1.5"/>
          <path d="M155 200 L155 224" strokeWidth="1.2"/>
          <path d="M180 200 L180 224" strokeWidth="1.2"/>
          <text x="160" y="216" fontSize="7" fill="#F97316">TICKET</text>
          
          {/* Ticket 2 */}
          <rect x="1000" y="420" width="35" height="24" rx="3" strokeWidth="1.5"/>
          <path d="M1005 420 L1005 444" strokeWidth="1.2"/>
          <path d="M1030 420 L1030 444" strokeWidth="1.2"/>
          <text x="1010" y="436" fontSize="7" fill="#F97316">TICKET</text>

          {/* Ticket 3 */}
          <rect x="680" y="700" width="35" height="24" rx="3" strokeWidth="1.5"/>
          <path d="M685 700 L685 724" strokeWidth="1.2"/>
          <path d="M710 700 L710 724" strokeWidth="1.2"/>
          <text x="690" y="716" fontSize="7" fill="#F97316">TICKET</text>
        </g>

        {/* ============================================ */}
        {/* LAYER 11: STAR / RATING ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Star 1 */}
          <path d="M650 650 L655 662 L668 662 L658 670 L662 682 L650 674 L638 682 L642 670 L632 662 L645 662 Z" strokeWidth="1.5"/>
          
          {/* Star 2 */}
          <path d="M330 330 L335 342 L348 342 L338 350 L342 362 L330 354 L318 362 L322 350 L312 342 L325 342 Z" strokeWidth="1.5"/>

          {/* Star 3 */}
          <path d="M850 800 L855 812 L868 812 L858 820 L862 832 L850 824 L838 832 L842 820 L832 812 L845 812 Z" strokeWidth="1.5"/>

          {/* Star 4 */}
          <path d="M150 680 L155 692 L168 692 L158 700 L162 712 L150 704 L138 712 L142 700 L132 692 L145 692 Z" strokeWidth="1.5"/>

          {/* Star 5 */}
          <path d="M1050 100 L1055 112 L1068 112 L1058 120 L1062 132 L1050 124 L1038 132 L1042 120 L1032 112 L1045 112 Z" strokeWidth="1.5"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 12: USER / PROFILE ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* User 1 */}
          <circle cx="450" cy="150" r="10" strokeWidth="1.5"/>
          <path d="M435 168 C440 158, 460 158, 465 168" strokeWidth="1.2"/>
          <path d="M448 150 L452 150" strokeWidth="1"/>
          <path d="M450 148 L450 152" strokeWidth="1"/>
          
          {/* User 2 */}
          <circle cx="750" cy="450" r="10" strokeWidth="1.5"/>
          <path d="M735 468 C740 458, 760 458, 765 468" strokeWidth="1.2"/>

          {/* User 3 */}
          <circle cx="200" cy="780" r="10" strokeWidth="1.5"/>
          <path d="M185 798 C190 788, 210 788, 215 798" strokeWidth="1.2"/>

          {/* User 4 */}
          <circle cx="950" cy="300" r="10" strokeWidth="1.5"/>
          <path d="M935 318 C940 308, 960 308, 965 318" strokeWidth="1.2"/>

          {/* User 5 */}
          <circle cx="550" cy="780" r="10" strokeWidth="1.5"/>
          <path d="M535 798 C540 788, 560 788, 565 798" strokeWidth="1.2"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 13: SCHEDULE / CALENDAR ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Calendar 1 */}
          <rect x="550" y="550" width="30" height="24" rx="4" strokeWidth="1.5"/>
          <path d="M555 556 L555 562" strokeWidth="1.2"/>
          <path d="M575 556 L575 562" strokeWidth="1.2"/>
          <path d="M555 568 L575 568" strokeWidth="1.2"/>
          <text x="558" y="566" fontSize="6" fill="#1F2937">MON</text>
          
          {/* Calendar 2 */}
          <rect x="950" y="150" width="30" height="24" rx="4" strokeWidth="1.5"/>
          <path d="M955 156 L955 162" strokeWidth="1.2"/>
          <path d="M975 156 L975 162" strokeWidth="1.2"/>
          <path d="M955 168 L975 168" strokeWidth="1.2"/>
          <text x="958" y="166" fontSize="6" fill="#1F2937">WED</text>

          {/* Calendar 3 */}
          <rect x="100" y="620" width="30" height="24" rx="4" strokeWidth="1.5"/>
          <path d="M105 626 L105 632" strokeWidth="1.2"/>
          <path d="M125 626 L125 632" strokeWidth="1.2"/>
          <path d="M105 638 L125 638" strokeWidth="1.2"/>
          <text x="108" y="636" fontSize="6" fill="#1F2937">FRI</text>
        </g>

        {/* ============================================ */}
        {/* LAYER 14: HEART / SAVE / FAVORITE ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Heart 1 */}
          <path d="M500 520 C500 508, 518 508, 518 520 C518 532, 500 545, 500 545 C500 545, 482 532, 482 520 C482 508, 500 508, 500 520Z" strokeWidth="1.5"/>
          
          {/* Heart 2 */}
          <path d="M150 320 C150 308, 168 308, 168 320 C168 332, 150 345, 150 345 C150 345, 132 332, 132 320 C132 308, 150 308, 150 320Z" strokeWidth="1.5"/>

          {/* Heart 3 */}
          <path d="M800 100 C800 88, 818 88, 818 100 C818 112, 800 125, 800 125 C800 125, 782 112, 782 100 C782 88, 800 88, 800 100Z" strokeWidth="1.5"/>

          {/* Heart 4 */}
          <path d="M1050 450 C1050 438, 1068 438, 1068 450 C1068 462, 1050 475, 1050 475 C1050 475, 1032 462, 1032 450 C1032 438, 1050 438, 1050 450Z" strokeWidth="1.5"/>

          {/* Heart 5 */}
          <path d="M350 780 C350 768, 368 768, 368 780 C368 792, 350 805, 350 805 C350 805, 332 792, 332 780 C332 768, 350 768, 350 780Z" strokeWidth="1.5"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 15: LOCATION / PROXIMITY / PIN ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Location 1 */}
          <circle cx="650" cy="300" r="7" strokeWidth="1.5"/>
          <path d="M650 307 L650 318" strokeWidth="1.2"/>
          <path d="M646 314 L654 314" strokeWidth="1"/>
          <path d="M647 318 L653 318" strokeWidth="1"/>
          
          {/* Location 2 */}
          <circle cx="350" cy="650" r="7" strokeWidth="1.5"/>
          <path d="M350 657 L350 668" strokeWidth="1.2"/>
          <path d="M346 664 L354 664" strokeWidth="1"/>

          {/* Location 3 */}
          <circle cx="850" cy="150" r="7" strokeWidth="1.5"/>
          <path d="M850 157 L850 168" strokeWidth="1.2"/>
          <path d="M846 164 L854 164" strokeWidth="1"/>

          {/* Location 4 */}
          <circle cx="100" cy="100" r="7" strokeWidth="1.5"/>
          <path d="M100 107 L100 118" strokeWidth="1.2"/>
          <path d="M96 114 L104 114" strokeWidth="1"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 16: NOTIFICATION / BELL ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Bell 1 */}
          <path d="M380 200 C380 185, 400 185, 400 200 L405 215 L375 215 Z" strokeWidth="1.5"/>
          <circle cx="390" cy="220" r="3" strokeWidth="1.2"/>
          <path d="M375 215 L405 215" strokeWidth="1"/>
          
          {/* Bell 2 */}
          <path d="M900 600 C900 585, 920 585, 920 600 L925 615 L895 615 Z" strokeWidth="1.5"/>
          <circle cx="910" cy="620" r="3" strokeWidth="1.2"/>
          <path d="M895 615 L925 615" strokeWidth="1"/>

          {/* Bell 3 */}
          <path d="M250 450 C250 435, 270 435, 270 450 L275 465 L245 465 Z" strokeWidth="1.5"/>
          <circle cx="260" cy="470" r="3" strokeWidth="1.2"/>
          <path d="M245 465 L275 465" strokeWidth="1"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 17: LINK / SHARE / CONNECT ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Link 1 */}
          <path d="M450 700 C460 685, 480 685, 485 700 L485 710 C485 725, 465 725, 460 710" strokeWidth="1.5"/>
          <path d="M460 705 C450 720, 470 720, 475 705 L475 695 C475 680, 455 680, 450 695" strokeWidth="1.2"/>
          
          {/* Link 2 */}
          <path d="M750 250 C760 235, 780 235, 785 250 L785 260 C785 275, 765 275, 760 260" strokeWidth="1.5"/>
          <path d="M760 255 C750 270, 770 270, 775 255 L775 245 C775 230, 755 230, 750 245" strokeWidth="1.2"/>

          {/* Link 3 */}
          <path d="M150 400 C160 385, 180 385, 185 400 L185 410 C185 425, 165 425, 160 410" strokeWidth="1.5"/>
          <path d="M160 405 C150 420, 170 420, 175 405 L175 395 C175 380, 155 380, 150 395" strokeWidth="1.2"/>
        </g>

        {/* ============================================ */}
        {/* LAYER 18: SMILE / EMOJI / REVIEW ICONS */}
        {/* ============================================ */}
        <g fill="none" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          {/* Smile 1 */}
          <circle cx="750" cy="350" r="12" strokeWidth="1.5"/>
          <circle cx="745" cy="346" r="2" strokeWidth="1"/>
          <circle cx="755" cy="346" r="2" strokeWidth="1"/>
          <path d="M742 355 C746 362, 754 362, 758 355" strokeWidth="1.2"/>
          
          {/* Smile 2 */}
          <circle cx="250" cy="600" r="12" strokeWidth="1.5"/>
          <circle cx="245" cy="596" r="2" strokeWidth="1"/>
          <circle cx="255" cy="596" r="2" strokeWidth="1"/>
          <path d="M242 605 C246 612, 254 612, 258 605" strokeWidth="1.2"/>

          {/* Smile 3 */}
          <circle cx="950" cy="200" r="12" strokeWidth="1.5"/>
          <circle cx="945" cy="196" r="2" strokeWidth="1"/>
          <circle cx="955" cy="196" r="2" strokeWidth="1"/>
          <path d="M942 205 C946 212, 954 212, 958 205" strokeWidth="1.2"/>
        </g>
      </svg>

      {/* ============================================ */}
      {/* OVERLAY: Warm gradient for cohesion */}
      {/* ============================================ */}
      <div className={styles.overlay} />
    </div>
  );
}