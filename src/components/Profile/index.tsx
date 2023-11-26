import Link from "next/link";
import Image from "next/image";
import Github from "@/assets/github.svg";
import Linkedin from "@/assets/linkedin.svg";
import Resume from "@/assets/cv.png";
import Facebook from "@/assets/facebook.svg";

const PROFILES = [
  {
    id: "resume",
    link: "https://moved0311.github.io/resume/",
    icon: Resume,
  },
  {
    id: "github",
    link: "https://github.com/moved0311",
    icon: Github,
  },
  {
    id: "linkedin",
    link: "https://www.linkedin.com/in/jiang-taiyi-7854ba205/",
    icon: Linkedin,
  },
  {
    id: "fb",
    link: "https://www.facebook.com/profile.php?id=100000329876068",
    icon: Facebook,
  },
];

const Profile = () => {
  return (
    <div className="flex items-center gap-1">
      {PROFILES.map(({ id, link, icon }) => (
        <Link href={link} key={id} target="_blank">
          <Image alt={id} src={icon} height={36} width={36} />
        </Link>
      ))}
    </div>
  );
};

export default Profile;
