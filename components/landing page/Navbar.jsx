import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full flex items-center justify-between px-8 md:px-28 h-20 border-b bg-[#F9F6F2] shadow-sm">
      <Link href="/">
        <div className="flex items-center space-x-2 cursor-pointer">
          <Image
            src="/logo.jpg"
            alt="MGM Logo"
            className="h-auto w-auto"
            width={120}
            height={60}
            priority
          />
        </div>
      </Link>
      <Link
        href="/dashboard"
        className="text-[#5D3A1A] font-semibold hover:text-[#3B2611] transition-colors duration-200"
      >
        Dashboard
      </Link>
    </div>
  );
}
