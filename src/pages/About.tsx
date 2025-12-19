import { motion } from "framer-motion";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Gamepad,
  Zap,
} from "lucide-react";

const About = () => {
  const interests = [
    { icon: Code, label: "Clean Code", color: "text-neon" },
    { icon: Gamepad, label: "Gaming", color: "text-primary" },
    { icon: Zap, label: "Innovation", color: "text-warning" },
  ];

  const stats = [
    { number: "10+", label: "Projects Completed" },
    { number: "20+", label: "Technologies" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate developer crafting digital experiences that make a
            difference
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass hover-lift p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-primary mb-6 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-foreground">
                    {/* MN */}
                    <img src="/profile.jpg" alt="" />

                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Mohammad Nazim Husain
                </h2>
                <p className="text-muted-foreground mb-4">
                  Full-Stack Developer,ML Engineer,UI/UX Designer,Data Analyst
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  {/* <Button variant="glass" size="icon" className="hover-lift">
                    <Github className="h-4 w-4"/>
                  </Button>
                  <Button variant="glass" size="icon" className="hover-lift">
                    <Linkedin className="h-4 w-4" href="https://www.linkedin.com/in/mohammad-nazim-husain-1ab024246/"/>
                  </Button> */}
                  {/* <Button variant="glass" size="icon" className="hover-lift">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="glass" size="icon" className="hover-lift">
                    <ExternalLink className="h-4 w-4" />
                  </Button> */}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-3 rounded-lg bg-muted/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-neon">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Content Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Bio */}
            <Card className="glass hover-lift p-8">
              <h3 className="text-2xl font-bold mb-4 text-gradient">
                My Story
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  A dedicated and curious professional, I bring a unique blend
                  of skills in Full Stack Development, UI/UX Design, Data
                  Analysis, and Machine Learning. 
                </p>
                <p>
                  I am currently pursuing my MCA
                  at Bennett University and have a solid foundation in Java.
                </p>
                <p>
                  Beyond my core skills, I am keen on exploring the potential of
                  Generative AI and applying it to real-world challenges. I am
                  seeking new job and internship opportunities to collaborate on
                  impactful projects and expand my expertise.
                </p>
              </div>
            </Card>

            {/* Interests */}
            <Card className="glass hover-lift p-8">
              <h3 className="text-2xl font-bold mb-6 text-gradient">
                What Drives Me
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {interests.map((interest, index) => (
                  <motion.div
                    key={interest.label}
                    className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <interest.icon
                      className={`h-8 w-8 mb-2 ${interest.color}`}
                    />
                    <span className="font-medium">{interest.label}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Technologies */}
            <Card className="glass hover-lift p-8">
              <h3 className="text-2xl font-bold mb-6 text-gradient">
                Core Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "HTML5",
                  "CSS",
                  "JavaScript",
                  "ReactJS",
                  "NextJS",
                  "NodeJS",
                  "ExpressJS",
                  "PostgreSQL",
                  "MongoDB",
                  "TailwindCSS",
                  "Java",
                  "Python",
                  "Figma",
                  "Numpy",
                  "Pandas",
                  "Matplotlib",
                  "TensorFlow",
                  "PyTorch",
                  "Machine Learning",
                  "Deep Learning",
                  "Generative AI"
                ].map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="hover:border-neon hover:text-neon transition-colors cursor-default"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* CTA */}
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Get In Touch
              </Button>
              <Button variant="neon" className="flex-1">
                Download Resume
              </Button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
