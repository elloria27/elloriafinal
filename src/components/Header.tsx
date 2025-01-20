import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, User, Globe, DollarSign, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollDirection = useScrollDirection();
  const [currentLanguage, setCurrentLanguage] = useState("EN");
  const [currentCurrency, setCurrentCurrency] = useState("CAD");
  const { items, totalItems, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <AnimatePresence>
      {scrollDirection === "up" && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 text-gray-700"
          >
            <div className="container mx-auto">
              <p className="py-2 text-sm font-light tracking-wider text-center">
                🌟 Free shipping on orders over $50 | Use code WELCOME20 for 20% off your first order
              </p>
            </div>
          </motion.div>

          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white/70 backdrop-blur-xl border-b border-gray-100/20"
          >
            <div className="container mx-auto">
              <div className="flex items-center justify-between h-20 px-4">
                <motion.a 
                  href="/" 
                  className="text-3xl font-extralight tracking-[0.2em] bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  ELLORIA
                </motion.a>

                {/* Main Navigation */}
                <nav className="hidden md:flex items-center space-x-12 ml-auto mr-8">
                  {["Products", "Features", "Sustainability", "Blog"].map((item) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item}
                    </motion.a>
                  ))}
                </nav>

                {/* Right Side Icons */}
                <div className="hidden md:flex items-center space-x-6">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        <User className="h-5 w-5" />
                      </motion.button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-6 bg-white shadow-lg border border-gray-100">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900">Welcome to Elloria</h4>
                        <p className="text-sm text-gray-500">
                          Sign in to access your account or create one to enjoy exclusive benefits and faster checkout.
                        </p>
                        <div className="flex gap-3">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 text-white" 
                            variant="default"
                          >
                            Sign In
                          </Button>
                          <Button 
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900" 
                            variant="outline"
                          >
                            Register
                          </Button>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="text-xs font-medium">{currentLanguage}</span>
                      </motion.button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div className="space-y-2">
                        <button
                          onClick={() => setCurrentLanguage("EN")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            currentLanguage === "EN"
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setCurrentLanguage("FR")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            currentLanguage === "FR"
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          Français
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Currency Selection Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <DollarSign className="h-5 w-5" />
                        <span className="text-xs font-medium">{currentCurrency}</span>
                      </motion.button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div className="space-y-2">
                        <button
                          onClick={() => setCurrentCurrency("CAD")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            currentCurrency === "CAD"
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          CAD ($)
                        </button>
                        <button
                          onClick={() => setCurrentCurrency("USD")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            currentCurrency === "USD"
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          USD ($)
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Shopping Cart */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative cursor-pointer"
                      >
                        <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
                        {totalItems > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                          >
                            {totalItems}
                          </motion.div>
                        )}
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-white shadow-lg border border-gray-100">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Shopping Cart</h4>
                        {items.length === 0 ? (
                          <p className="text-sm text-gray-500">Your cart is empty</p>
                        ) : (
                          <>
                            <div className="space-y-3">
                              {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-contain rounded-md"
                                  />
                                  <div className="flex-1">
                                    <h5 className="text-sm font-medium">{item.name}</h5>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                      >
                                        -
                                      </Button>
                                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= 99}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button className="w-full" onClick={() => console.log('Checkout clicked')}>
                                Checkout
                              </Button>
                              <Button 
                                variant="outline" 
                                className="px-3"
                                onClick={clearCart}
                              >
                                Clear
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden hover:bg-primary/5"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side="right" 
                    className="w-[300px] sm:w-[400px] bg-white/80 backdrop-blur-xl"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-left font-extralight tracking-[0.2em] text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ELLORIA
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col space-y-6 mt-12">
                      {["Products", "Features", "Sustainability", "Blog", "Account", "Language", "Currency"].map((item) => (
                        <motion.a
                          key={item}
                          href={`#${item.toLowerCase().replace(" ", "-")}`}
                          className="text-lg text-gray-600 hover:text-primary transition-colors py-2 tracking-wider font-light"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item}
                        </motion.a>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </motion.header>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
