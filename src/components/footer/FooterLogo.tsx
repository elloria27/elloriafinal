
import { useLogo } from "@/hooks/use-logo";

export const FooterLogo = () => {
  const logoUrl = useLogo();

  return (
    <a href="/" className="h-8 block">
      <img 
        src={logoUrl || "/lovable-uploads/08d815c8-551d-4278-813a-fe884abd443d.png"}
        alt="Elloria" 
        className="h-full w-auto"
      />
    </a>
  );
};
