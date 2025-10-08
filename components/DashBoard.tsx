"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';

interface DashboardClientProps {
  user: {
    given_name?: string | null;
    family_name?: string | null;
    email?: string | null;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {

  const t = useTranslations('dashboard');


 

  return (
    <div className="min-h-screen bg-base-100 flex">
      <Sidebar />
      
    </div>
  );
}