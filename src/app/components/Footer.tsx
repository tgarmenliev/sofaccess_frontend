import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <p className="text-sm text-muted-foreground">
            &copy; 2025 SOFaccess. Всички права запазени.
          </p>

          {/* Center */}
          <p className="flex items-center text-sm text-muted-foreground">
            Направено с <Heart className="h-4 w-4 mx-1 text-primary" /> за София.
          </p>

          {/* Right */}
          <div className="flex space-x-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary">
              Политика за поверителност
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              Условия за ползване
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
