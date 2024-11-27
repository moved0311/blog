import Profile from "@/components/Profile";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Profile />
      {children}
    </div>
  );
};

export default Layout;
