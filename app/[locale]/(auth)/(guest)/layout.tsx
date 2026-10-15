import { requireGuest } from "@/lib/auth";

export default async function GuestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireGuest();

  return children;
}
