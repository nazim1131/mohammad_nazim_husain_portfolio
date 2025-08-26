import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/enhanced-button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-8xl font-bold mb-4 text-gradient"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.div>
        
        <h1 className="text-2xl font-bold mb-4 text-foreground">
          Page Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for seems to have vanished into the digital void.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button variant="neon" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-neon/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
