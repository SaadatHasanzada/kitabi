import Image from "next/image";

import logo from "@/assets/images/logo.png";
import { Link } from "@/i18n/navigation";

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        className="w-14 h-15 md:w-18 md:h-20 object-contain"
        src={logo}
        width={72}
        height={80}
        alt="Logo"
      />
      <span className="font-logo text-brand text-3xl desktop:text-4xl">
        kitabi
      </span>
    </Link>
  );
}
