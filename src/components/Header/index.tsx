import Link from "next/link";
import DarkModeSwitch from "@/components/DarkMode/index.client";

const index = () => {
  return (
    <div className="flex items-center justify-between text-[#007acc]">
      <Link href="/">
        <h1 className="text-3xl font-extrabold py-8">Taiyi dev</h1>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/notes" className="font-bold">
          Notes
        </Link>
        <DarkModeSwitch />
      </div>
    </div>
  );
};

export default index;
