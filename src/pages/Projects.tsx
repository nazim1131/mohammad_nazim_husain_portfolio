import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Github, Eye, Calendar, Users, Star } from "lucide-react";

// ---- helpers ----
const toArray = (v: any): string[] =>
  Array.isArray(v) ? v : (typeof v === "string" ? v.split(",").map(s=>s.trim()).filter(Boolean) : []);

const getStatusBadge = (status: string) =>
  status === "in-progress" ? "bg-warning/20 text-warning" :
  status === "completed" ? "bg-success/20 text-success" :
  "bg-muted/20 text-muted-foreground";

// DB -> UI normalize
const normalizeDbProject = (p:any) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  longDescription: p.longDescription || p.description || "",
  image: p.image_url || "/api/placeholder/600/400",
  tech: toArray(p.tags),
  category: p.category || "fullstack",
  status: p.status === "published" ? "completed" : (p.status || "completed"),
  date: p.date || "",
  github: p.github || "",
  live: p.live || "",
  team: p.team || 1,
  duration: p.duration || "",
  highlights: Array.isArray(p.highlights) ? p.highlights : toArray(p.highlights),
});

// ---- static fallback (unchanged) ----
const staticProjects = [
  // { id: 1, title: "E-Commerce Platform", description: "Modern full-stack e-commerce solution with advanced features", longDescription: "A comprehensive e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing with Stripe, real-time inventory management, admin dashboard, and responsive design. Implemented advanced search functionality, product recommendations using machine learning, and optimized for performance with 99.9% uptime.", image: "/api/placeholder/600/400", tech: ["React","Node.js","PostgreSQL","Stripe","AWS"], category: "fullstack", status: "completed", date: "2024-01", github: "https://github.com/example/ecommerce", live: "https://ecommerce-demo.com", team: 4, duration: "3 months", highlights: ["Processed 10,000+ transactions","99.9% uptime achieved","Mobile-first responsive design","Advanced search with filters"] },
  // { id: 2, title: "AI-Powered Dashboard", description: "Analytics dashboard with machine learning insights", longDescription: "An intelligent analytics dashboard that processes large datasets and provides AI-driven insights. Built with React, Python Flask backend, and integrated with TensorFlow for predictive analytics. Features real-time data visualization, automated reporting, and custom alert systems.", image: "/api/placeholder/600/400", tech: ["React","Python","TensorFlow","D3.js","MongoDB"], category: "frontend", status: "completed", date: "2023-11", github: "https://github.com/example/ai-dashboard", live: "https://ai-dashboard-demo.com", team: 2, duration: "4 months", highlights: ["Reduced analysis time by 70%","Real-time data processing","Custom ML algorithms","Interactive visualizations"] },
  // { id: 3, title: "Mobile Fitness App", description: "Cross-platform fitness tracking application", longDescription: "A comprehensive fitness tracking app built with React Native and Expo. Features include workout planning, progress tracking, social features, and integration with wearable devices. Implemented offline functionality and real-time sync across devices.", image: "/api/placeholder/600/400", tech: ["React Native","Expo","Firebase","Redux"], category: "mobile", status: "completed", date: "2023-09", github: "https://github.com/example/fitness-app", live: "https://apps.apple.com/fitness-tracker", team: 3, duration: "5 months", highlights: ["50,000+ active users","4.8/5 App Store rating","Offline functionality","Wearable device integration"] },
  // { id: 4, title: "Blockchain Portfolio Tracker", description: "DeFi portfolio management with real-time tracking", longDescription: "A sophisticated blockchain portfolio tracker that monitors DeFi investments across multiple chains. Features include real-time price tracking, yield farming analytics, impermanent loss calculations, and automated tax reporting. Built with React, Web3.js, and connected to multiple blockchain networks.", image: "/api/placeholder/600/400", tech: ["React","Web3.js","Solidity","Node.js","GraphQL"], category: "blockchain", status: "completed", date: "2024-03", github: "https://github.com/example/defi-tracker", live: "https://defi-portfolio-tracker.com", team: 2, duration: "6 months", highlights: ["Multi-chain support","Real-time price feeds","Automated tax reports","Advanced DeFi analytics"] },
  // { id: 5, title: "Smart Home IoT Platform", description: "IoT device management and automation system", longDescription: "An intelligent IoT platform for managing smart home devices with automation rules, energy monitoring, and predictive maintenance. Built with React dashboard, Node.js backend, and MQTT for device communication. Features include voice control integration and machine learning for usage optimization.", image: "/api/placeholder/600/400", tech: ["React","Node.js","MQTT","InfluxDB","Docker"], category: "iot", status: "in-progress", date: "2024-06", github: "https://github.com/example/smart-home", live: null, team: 5, duration: "8 months", highlights: ["200+ supported devices","Voice control integration","Energy optimization AI","Predictive maintenance"] },
  // { id: 6, title: "Video Streaming Platform", description: "Netflix-like streaming service with CDN optimization", longDescription: "A scalable video streaming platform similar to Netflix, built with modern web technologies. Features include user profiles, recommendation engine, live streaming capabilities, and global CDN integration. Optimized for 4K streaming with adaptive bitrate technology.", image: "/api/placeholder/600/400", tech: ["Next.js","Node.js","Redis","AWS","FFmpeg"], category: "fullstack", status: "completed", date: "2023-07", github: "https://github.com/example/streaming", live: "https://streaming-demo.com", team: 6, duration: "12 months", highlights: ["1M+ concurrent users","Global CDN deployment","4K streaming support","AI recommendations"] },
];

const categories = [
  { id: "all", label: "All Projects" },
  { id: "fullstack", label: "Full Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "designs", label: "Design" },
  { id: "ai & ml", label: "AI & ML" },
  { id: "data analysis", label: "Data Analysis" },
];

const Projects = () => {
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("status","published").order("order_index",{ ascending:true });
      if (!error) setDbProjects(data || []);
      setLoading(false);
    })();
  }, []);

  const merged = useMemo(() => {
    const normalizedDb = dbProjects.map(normalizeDbProject);
    return [...staticProjects, ...normalizedDb];
  }, [dbProjects]);

  const filtered = useMemo(() => {
    return filter === "all" ? merged : merged.filter(p => (p.category || "fullstack") === filter);
  }, [merged, filter]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">My <span className="text-gradient">Projects</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">A showcase of my latest work and technical achievements</p>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-wrap justify-center gap-3 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {categories.map((c) => (
            <Button key={c.id} variant={filter === c.id ? "hero" : "glass"} onClick={() => setFilter(c.id)} className="transition-all duration-200">
              {c.label}
            </Button>
          ))}
        </motion.div>

        {loading && <div className="opacity-70 mb-4">Loading projects…</div>}

        {/* Single grid: static + DB */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filtered.map((project:any, index:number) => (
              <motion.div key={`${project.id}-${project.title}`} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="glass hover-lift overflow-hidden group cursor-pointer h-full" onClick={() => setSelectedProject(project)}>
                  <div className="relative aspect-video bg-muted/20 overflow-hidden">
                    <div className="w-full h-full bg-gradient-primary/20 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-neon opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <Badge className={`absolute top-3 right-3 ${getStatusBadge(project.status || "completed")}`}>
                      {project.status === "in-progress" ? "In Progress" : "Completed"}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold group-hover:text-neon transition-colors">{project.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {project.date}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

                    {Array.isArray(project.tech) && project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tech.slice(0, 3).map((tech:string) => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                        {project.tech.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{project.tech.length - 3}</Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {project.team ?? 1}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {(Array.isArray(project.highlights) ? project.highlights.length : 0)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {project.github && (
                          <Button variant="glass" size="icon" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {project.live && (
                          <Button variant="glass" size="icon" asChild>
                            <a href={project.live} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass">
            {selectedProject && (
              <>
                <DialogHeader><DialogTitle className="text-2xl font-bold text-gradient">{selectedProject.title}</DialogTitle></DialogHeader>

                <div className="space-y-6">
                  <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Project Screenshot</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Project Overview</h4>
                        <p className="text-muted-foreground">{selectedProject.longDescription || selectedProject.description}</p>
                      </div>

                      {Array.isArray(selectedProject.highlights) && selectedProject.highlights.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Key Highlights</h4>
                          <ul className="space-y-1">
                            {selectedProject.highlights.map((h:string, i:number) => (
                              <li key={i} className="flex items-center text-muted-foreground">
                                <Star className="w-4 h-4 mr-2 text-neon" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Card className="p-4 bg-muted/20">
                        <h4 className="font-semibold mb-3">Project Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className={getStatusBadge(selectedProject.status || "completed")}>
                              {selectedProject.status === "in-progress" ? "In Progress" : "Completed"}
                            </Badge>
                          </div>
                          {selectedProject.duration && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Duration:</span>
                              <span>{selectedProject.duration}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Team Size:</span>
                            <span>{selectedProject.team ?? 1} members</span>
                          </div>
                          {selectedProject.date && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date:</span>
                              <span>{selectedProject.date}</span>
                            </div>
                          )}
                        </div>
                      </Card>

                      {Array.isArray(selectedProject.tech) && selectedProject.tech.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Technologies Used</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedProject.tech.map((t:string) => (
                              <Badge key={t} variant="secondary">{t}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        {selectedProject.github && (
                          <Button variant="neon" className="w-full" asChild>
                            <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 w-4 h-4" /> View Source Code
                            </a>
                          </Button>
                        )}
                        {selectedProject.live && (
                          <Button variant="hero" className="w-full" asChild>
                            <a href={selectedProject.live} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 w-4 h-4" /> Visit Live Site
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Projects;
