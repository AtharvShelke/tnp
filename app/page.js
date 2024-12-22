import Navbar from "@/components/landing page/Navbar";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-[600px]">
        This might be the landing page or better to use the pre-existing one from college's official website
      </div>
    </>
  );
}
