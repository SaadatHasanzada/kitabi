import { requireGuest } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireGuest();

  return <div className="flex flex-1 flex-col desktop:flex-row">{children}</div>;
}
