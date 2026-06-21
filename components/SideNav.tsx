"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SideNav = () => {
  return (
    <>
      <div className="w-full cflexbm p-5 bg-red-500 h-full">
        <div className="w-full bg-green-500">
          <Image src="/h-logo.png" className="object-contain w-[" width={500} height={300} alt="haggle-logo" />
        </div>

        <h1>Menus</h1>

        <h1>Profile</h1>
      </div>
    </>
  );
};

export default SideNav;
