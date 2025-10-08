import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
// import DashboardClient from "@/components/DashBoard";
import { useTranslations } from 'next-intl';

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }


  return (
    <div>
      Dashboard
    </div>
  );
}
