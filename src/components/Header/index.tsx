import Link from "next/link";
import DarkModeSwitch from "@/components/DarkMode/index.client";

const index = () => {
  return (
    <Link href="/" className="flex items-center justify-between">
      <h1 className="text-3xl font-extrabold py-8">Taiyi dev</h1>
      <DarkModeSwitch />
    </Link>
  );
};

export default index;
