import { motion } from "framer-motion";
import { Button } from "@/components/ui/enhanced-button";
import { Scene3D } from "@/components/3d/Scene3D";
import { ChevronDown, Github, Linkedin, Mail, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-glow z-10" />

      {/* Hero Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Creative</span>
              <br />
              <span className="text-foreground">Developer</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Crafting seamless digital experiences and exploring the future of
            technology with skills in Full Stack, ML, and Generative AI.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/projects">
              <Button variant="hero" size="xl" className="group">
                View My Work
                <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </Link>
            <a href="/Nazim_Resume.pdf" download="Nazim - Resume.pdf">
              <Button variant="neon" size="xl">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="https://github.com/nazim1131"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="glass" size="icon" className="hover-lift">
                <Github className="h-5 w-5" />
              </Button>
            </a>

            <a
              href="https://www.linkedin.com/in/mohammad-nazim-husain-1ab024246/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="glass" size="icon" className="hover-lift">
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {/* <button
          onClick={scrollToNext}
          className="flex flex-col items-center text-muted-foreground hover:text-neon transition-colors duration-300"
        >
          <span className="text-sm mb-2 font-medium">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </button> */}
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
