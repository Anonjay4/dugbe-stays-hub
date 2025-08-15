import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Bed, 
  Calendar, 
  MapPin, 
  Phone, 
  User,
  Menu,
  X,
  Settings,
  LogIn
} from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/rooms', label: 'Rooms', icon: Bed },
    { to: '/booking', label: 'Book Now', icon: Calendar },
    { to: '/attractions', label: 'Attractions', icon: MapPin },
    { to: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <Bed className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Dugbe Stays</h1>
              <p className="text-xs text-muted-foreground">Luxury Hotel & Suites</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button 
                  variant={isActive(item.to) ? "hero" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
            
            {/* User Account & Admin */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
              {user ? (
                <>
                  <Link to="/account">
                    <Button variant="elegant" size="sm">
                      <User className="h-4 w-4" />
                      <span className="hidden lg:inline">Account</span>
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="hidden lg:inline">Admin</span>
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden lg:inline">Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-md rounded-lg mt-2 border border-border/50">
              {navItems.map((item) => (
                <Link 
                  key={item.to} 
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                >
                  <Button 
                    variant={isActive(item.to) ? "hero" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              <div className="border-t border-border/50 pt-2 mt-2">
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setIsOpen(false)}>
                      <Button variant="elegant" size="sm" className="w-full justify-start mb-1">
                        <User className="h-4 w-4 mr-3" />
                        Account
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-3" />
                          Admin
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" size="sm" className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-3" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;