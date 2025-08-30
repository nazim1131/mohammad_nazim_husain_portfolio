// import { useState, useEffect, useMemo } from "react";
// import { supabase } from "@/lib/supabase";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/enhanced-button";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { ExternalLink, Github, Eye, Calendar, Users, Star } from "lucide-react";

// /* ====================== CATEGORY KEYS & HELPERS ====================== */

// type ProjCatKey = "fullstack" | "frontend" | "design" | "ai" | "dataanalysis";

// const PROJ_CAT_LABELS: Record<ProjCatKey, string> = {
//   fullstack: "Full Stack",
//   frontend: "Frontend",
//   design: "Design",
//   ai: "AI & ML",
//   dataanalysis: "Data Analysis",
// };

// // any input -> canonical key
// const toProjectCatKey = (raw: any): ProjCatKey => {
//   const s = String(raw ?? "").toLowerCase().trim();

//   // exact
//   if (s === "fullstack") return "fullstack";
//   if (s === "frontend") return "frontend";
//   if (s === "design") return "design";
//   if (s === "ai") return "ai";
//   if (s === "dataanalysis") return "dataanalysis";

//   // legacy/variants
//   if (s.includes("full")) return "fullstack";
//   if (s.includes("front")) return "frontend";
//   if (s.includes("design")) return "design";
//   if (s.includes("ai & ml") || s.includes("ai/ml") || s.includes("ai-ml") || s === "ml" || s.includes("ai")) return "ai";
//   if (s.includes("data analysis") || s.includes("data-analysis") || s === "data" || s.includes("analytics")) return "dataanalysis";

//   // fallback (safe)
//   return "fullstack";
// };

// /* ====================== SMALL UTILS ====================== */

// const toArray = (v: any): string[] => {
//   if (Array.isArray(v)) return v.filter(Boolean).map(String);
//   if (typeof v === "string") {
//     try {
//       // if someone stored JSON string
//       const maybe = JSON.parse(v);
//       if (Array.isArray(maybe)) return maybe.filter(Boolean).map(String);
//     } catch {}
//     return v.split(",").map((s) => s.trim()).filter(Boolean);
//   }
//   return [];
// };

// const getStatusBadge = (status: string) =>
//   status === "in-progress"
//     ? "bg-warning/20 text-warning"
//     : status === "completed"
//     ? "bg-success/20 text-success"
//     : "bg-muted/20 text-muted-foreground";

// /* ====================== NORMALIZER ====================== */

// const normalizeDbProject = (p: any) => {
//   const cat = toProjectCatKey(p?.category);
//   const status =
//     (p?.status || "").toLowerCase() === "published"
//       ? "completed"
//       : (p?.status || "completed");

//   return {
//     id: p.id,
//     title: p.title,
//     description: p.description || "",
//     longDescription: p.longDescription || p.description || "",
//     image: p.image_url || "/api/placeholder/600/400",
//     tech: toArray(p.tags),
//     category: cat,                        // canonical
//     status,                               // completed | in-progress
//     date: p.date || "",
//     github: p.github || "",
//     live: p.live || "",
//     team: p.team ?? 1,
//     duration: p.duration || "",
//     highlights: toArray(p.highlights),
//     order_index: typeof p.order_index === "number" ? p.order_index : 0,
//   };
// };

// /* ====================== (optional) STATIC PROJECTS ====================== */
// /* Agar chaho to yaha apne static projects rakh sakte ho, par unki
//    category ko bhi normalize karna zaroori hai (neeche merged me ho jayega).
// */
// const staticProjects: any[] = []; // keep empty or add yours

// /* ====================== FILTER TABS ====================== */

// const CATEGORIES: { id: "all" | ProjCatKey; label: string }[] = [
//   { id: "all", label: "All Projects" },
//   { id: "fullstack", label: "Full Stack" },
//   { id: "frontend", label: "Frontend" },
//   { id: "design", label: "Design" },
//   { id: "ai", label: "AI & ML" },
//   { id: "dataanalysis", label: "Data Analysis" },
// ];

// /* ====================== COMPONENT ====================== */

// const Projects = () => {
//   const [dbProjects, setDbProjects] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProject, setSelectedProject] = useState<any>(null);
//   const [filter, setFilter] = useState<"all" | ProjCatKey>("all");

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("projects")
//         .select("*")
//         .eq("status", "published")
//         .order("order_index", { ascending: true });

//       if (!error) setDbProjects(data || []);
//       setLoading(false);
//     })();
//   }, []);

//   // normalize both static + DB
//   const merged = useMemo(() => {
//     const normalizedDb = dbProjects.map(normalizeDbProject);
//     const normalizedStatic = staticProjects.map((p) => ({
//       ...p,
//       category: toProjectCatKey(p?.category),
//       status: p?.status || "completed",
//       tech: toArray(p?.tech),
//       highlights: toArray(p?.highlights),
//     }));
//     return [...normalizedStatic, ...normalizedDb];
//   }, [dbProjects]);

//   const filtered = useMemo(() => {
//     if (filter === "all") return merged;
//     return merged.filter((p) => toProjectCatKey(p.category) === filter);
//   }, [merged, filter]);

//   return (
//     <div className="min-h-screen pt-24 pb-16 px-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <motion.div
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">
//             My <span className="text-gradient">Projects</span>
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             A showcase of my latest work and technical achievements
//           </p>
//         </motion.div>

//         {/* Filters */}
//         <motion.div
//           className="flex flex-wrap justify-center gap-3 mb-12"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//         >
//           {CATEGORIES.map((c) => (
//             <Button
//               key={c.id}
//               variant={filter === c.id ? "hero" : "glass"}
//               onClick={() => setFilter(c.id)}
//               className="transition-all duration-200"
//             >
//               {c.label}
//             </Button>
//           ))}
//         </motion.div>

//         {loading && <div className="opacity-70 mb-4">Loading projects…</div>}

//         {/* Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           <AnimatePresence mode="wait">
//             {filtered.map((project: any, index: number) => (
//               <motion.div
//                 key={`${project.id}-${project.title}`}
//                 layout
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.5, delay: index * 0.06 }}
//               >
//                 <Card
//                   className="glass hover-lift overflow-hidden group cursor-pointer h-full"
//                   onClick={() => setSelectedProject(project)}
//                 >
//                   <div className="relative aspect-video bg-muted/20 overflow-hidden">
//                     <div className="w-full h-full bg-gradient-primary/20 flex items-center justify-center">
//                       <Eye className="w-8 h-8 text-neon opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                     </div>
//                     <Badge
//                       className={`absolute top-3 right-3 ${getStatusBadge(project.status || "completed")}`}
//                     >
//                       {project.status === "in-progress" ? "In Progress" : "Completed"}
//                     </Badge>
//                   </div>

//                   <div className="p-6">
//                     <div className="flex items-start justify-between mb-3">
//                       <h3 className="text-xl font-bold group-hover:text-neon transition-colors">
//                         {project.title}
//                       </h3>
//                       <div className="flex items-center text-muted-foreground text-sm">
//                         <Calendar className="w-4 h-4 mr-1" />
//                         {project.date}
//                       </div>
//                     </div>

//                     <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
//                       {project.description}
//                     </p>

//                     {Array.isArray(project.tech) && project.tech.length > 0 && (
//                       <div className="flex flex-wrap gap-1 mb-4">
//                         {project.tech.slice(0, 3).map((tech: string) => (
//                           <Badge key={tech} variant="secondary" className="text-xs">
//                             {tech}
//                           </Badge>
//                         ))}
//                         {project.tech.length > 3 && (
//                           <Badge variant="secondary" className="text-xs">
//                             +{project.tech.length - 3}
//                           </Badge>
//                         )}
//                       </div>
//                     )}

//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                         <div className="flex items-center">
//                           <Users className="w-4 h-4 mr-1" />
//                           {project.team ?? 1}
//                         </div>
//                         <div className="flex items-center">
//                           <Star className="w-4 h-4 mr-1" />
//                           {(Array.isArray(project.highlights) ? project.highlights.length : 0)}
//                         </div>
//                       </div>

//                       <div className="flex gap-2">
//                         {project.github && (
//                           <Button variant="glass" size="icon" asChild>
//                             <a href={project.github} target="_blank" rel="noopener noreferrer">
//                               <Github className="w-4 h-4" />
//                             </a>
//                           </Button>
//                         )}
//                         {project.live && (
//                           <Button variant="glass" size="icon" asChild>
//                             <a href={project.live} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="w-4 h-4" />
//                             </a>
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* category badge (optional) */}
//                   <div className="px-6 pb-4 -mt-3">
//                     <Badge variant="outline">
//                       {PROJ_CAT_LABELS[toProjectCatKey(project.category)]}
//                     </Badge>
//                   </div>
//                 </Card>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>

//         {/* Modal */}
//         <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass">
//             {selectedProject && (
//               <>
//                 <DialogHeader>
//                   <DialogTitle className="text-2xl font-bold text-gradient">
//                     {selectedProject.title}
//                   </DialogTitle>
//                 </DialogHeader>

//                 <div className="space-y-6">
//                   <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
//                     <div className="text-center text-muted-foreground">
//                       <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                       <p>Project Screenshot</p>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-3 gap-6">
//                     <div className="md:col-span-2 space-y-4">
//                       <div>
//                         <h4 className="font-semibold mb-2">Project Overview</h4>
//                         <p className="text-muted-foreground">
//                           {selectedProject.longDescription || selectedProject.description}
//                         </p>
//                       </div>

//                       {Array.isArray(selectedProject.highlights) &&
//                         selectedProject.highlights.length > 0 && (
//                           <div>
//                             <h4 className="font-semibold mb-2">Key Highlights</h4>
//                             <ul className="space-y-1">
//                               {selectedProject.highlights.map((h: string, i: number) => (
//                                 <li key={i} className="flex items-center text-muted-foreground">
//                                   <Star className="w-4 h-4 mr-2 text-neon" />
//                                   {h}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                     </div>

//                     <div className="space-y-4">
//                       <Card className="p-4 bg-muted/20">
//                         <h4 className="font-semibold mb-3">Project Details</h4>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-muted-foreground">Status:</span>
//                             <Badge className={getStatusBadge(selectedProject.status || "completed")}>
//                               {selectedProject.status === "in-progress" ? "In Progress" : "Completed"}
//                             </Badge>
//                           </div>
//                           {selectedProject.duration && (
//                             <div className="flex justify-between">
//                               <span className="text-muted-foreground">Duration:</span>
//                               <span>{selectedProject.duration}</span>
//                             </div>
//                           )}
//                           <div className="flex justify-between">
//                             <span className="text-muted-foreground">Team Size:</span>
//                             <span>{selectedProject.team ?? 1} members</span>
//                           </div>
//                           {selectedProject.date && (
//                             <div className="flex justify-between">
//                               <span className="text-muted-foreground">Date:</span>
//                               <span>{selectedProject.date}</span>
//                             </div>
//                           )}
//                           <div className="flex justify-between">
//                             <span className="text-muted-foreground">Category:</span>
//                             <span>{PROJ_CAT_LABELS[toProjectCatKey(selectedProject.category)]}</span>
//                           </div>
//                         </div>
//                       </Card>

//                       {Array.isArray(selectedProject.tech) && selectedProject.tech.length > 0 && (
//                         <div>
//                           <h4 className="font-semibold mb-3">Technologies Used</h4>
//                           <div className="flex flex-wrap gap-1">
//                             {selectedProject.tech.map((t: string) => (
//                               <Badge key={t} variant="secondary">
//                                 {t}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       <div className="flex flex-col gap-2">
//                         {selectedProject.github && (
//                           <Button variant="neon" className="w-full" asChild>
//                             <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
//                               <Github className="mr-2 w-4 h-4" /> View Source Code
//                             </a>
//                           </Button>
//                         )}
//                         {selectedProject.live && (
//                           <Button variant="hero" className="w-full" asChild>
//                             <a href={selectedProject.live} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="mr-2 w-4 h-4" /> Visit Live Site
//                             </a>
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default Projects;

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Github, Calendar, Users, Star } from "lucide-react";

/* ---------------- helpers ---------------- */

const toArray = (v: any): string[] =>
  Array.isArray(v) ? v : typeof v === "string" ? v.split(",").map(s => s.trim()).filter(Boolean) : [];

const getStatusBadge = (status: string) =>
  status === "in-progress" ? "bg-warning/20 text-warning"
  : status === "completed"  ? "bg-success/20 text-success"
  :                           "bg-muted/20 text-muted-foreground";

type CanonCat = "fullstack" | "frontend" | "design" | "ai" | "dataanalysis";
const normalizeCategory = (raw: any): CanonCat => {
  const s = String(raw || "").toLowerCase().trim();
  if (["fullstack", "frontend", "design", "ai", "dataanalysis"].includes(s)) return s as CanonCat;
  if (s.includes("full")) return "fullstack";
  if (s.includes("front")) return "frontend";
  if (s.includes("design")) return "design";
  if (s.includes("ai") || s.includes("ml")) return "ai";
  if (s.includes("data")) return "dataanalysis";
  return "fullstack";
};

// Convert common share links to direct-view image URLs
const toDisplayImage = (raw?: string): string => {
  const u = (raw || "").trim();
  if (!u) return "/api/placeholder/800/450";
  const withProto = u.startsWith("http") ? u : `https://${u}`;

  try {
    const url = new URL(withProto);

    // Google Drive
    if (url.hostname.includes("drive.google.com")) {
      let m = withProto.match(/\/d\/([^/]+)/);
      if (!m) m = withProto.match(/[?&]id=([^&]+)/);
      const id = m?.[1];
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    // Dropbox
    if (url.hostname.includes("dropbox.com")) {
      url.searchParams.set("dl", "1");
      return url.toString();
    }
    return withProto;
  } catch {
    return withProto;
  }
};

// Image that *sticks* to a working src (prevents flicker loops)
const ImgWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: "lazy" | "eager";
}> = ({ src, alt, className, placeholder = "/api/placeholder/800/450", loading = "lazy" }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  useEffect(() => {
    // only update if the incoming src actually changed
    setCurrentSrc(src || placeholder);
  }, [src, placeholder]);
  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (currentSrc !== placeholder) setCurrentSrc(placeholder);
      }}
      // avoid alt flicker in some browsers when rapidly swapping src
      style={{ willChange: "transform" }}
    />
  );
};

// DB → UI
const normalizeDbProject = (p: any) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  longDescription: p.longDescription || p.description || "",
  image: toDisplayImage(p.image_url) || "/api/placeholder/800/450",
  tech: toArray(p.tags),
  category: normalizeCategory(p.category),
  status: p.status === "published" ? "completed" : (p.status || "completed"),
  date: p.date || "",
  github: p.github || "",
  live: p.live || "",
  team: p.team || 1,
  duration: p.duration || "",
  highlights: Array.isArray(p.highlights) ? p.highlights : toArray(p.highlights),
});

/* ---------- optional static ---------- */
const staticProjects: any[] = [];

/* ---------- filters ---------- */
const CATEGORIES = [
  { id: "all",          label: "All Projects" },
  { id: "fullstack",    label: "Full Stack" },
  { id: "frontend",     label: "Frontend" },
  { id: "design",       label: "Design" },
  { id: "ai",           label: "AI & ML" },
  { id: "dataanalysis", label: "Data Analysis" },
];

const Projects = () => {
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("order_index", { ascending: true });

      if (!error) setDbProjects(data || []);
      setLoading(false);
    })();
  }, []);

  const merged = useMemo(() => {
    const normalizedDb = dbProjects.map(normalizeDbProject);
    return [...staticProjects, ...normalizedDb];
  }, [dbProjects]);

  const filtered = useMemo(
    () => (filter === "all" ? merged : merged.filter(p => normalizeCategory(p.category) === filter)),
    [merged, filter],
  );

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
          {CATEGORIES.map((c) => (
            <Button key={c.id} variant={filter === c.id ? "hero" : "glass"} onClick={() => setFilter(c.id)} className="transition-all duration-200">
              {c.label}
            </Button>
          ))}
        </motion.div>

        {loading && <div className="opacity-70 mb-4">Loading projects…</div>}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filtered.map((project: any, index: number) => (
              <motion.div
                key={`${project.id}-${project.title}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass hover-lift overflow-hidden group cursor-pointer h-full" onClick={() => setSelectedProject(project)}>
                  <div className="relative aspect-video bg-muted/10 overflow-hidden">
                    <ImgWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      placeholder="/api/placeholder/800/450"
                    />
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
                        {project.tech.slice(0, 3).map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                        {project.tech.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{project.tech.length - 3}</Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center"><Users className="w-4 h-4 mr-1" />{project.team ?? 1}</div>
                        <div className="flex items-center"><Star className="w-4 h-4 mr-1" />{(Array.isArray(project.highlights) ? project.highlights.length : 0)}</div>
                      </div>

                      <div className="flex gap-2">
                        {project.github && (
                          <Button variant="glass" size="icon" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" /></a>
                          </Button>
                        )}
                        {project.live && (
                          <Button variant="glass" size="icon" asChild>
                            <a href={project.live} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a>
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
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gradient">{selectedProject.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="aspect-video bg-muted/10 rounded-lg overflow-hidden">
                    <ImgWithFallback
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                      placeholder="/api/placeholder/800/450"
                      loading="eager"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Project Overview</h4>
                        <p className="text-muted-foreground">
                          {selectedProject.longDescription || selectedProject.description}
                        </p>
                      </div>

                      {Array.isArray(selectedProject.highlights) && selectedProject.highlights.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Key Highlights</h4>
                          <ul className="space-y-1">
                            {selectedProject.highlights.map((h: string, i: number) => (
                              <li key={i} className="flex items-center text-muted-foreground">
                                <Star className="w-4 h-4 mr-2 text-neon" />{h}
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
                            <div className="flex justify-between"><span className="text-muted-foreground">Duration:</span><span>{selectedProject.duration}</span></div>
                          )}
                          <div className="flex justify-between"><span className="text-muted-foreground">Team Size:</span><span>{selectedProject.team ?? 1} members</span></div>
                          {selectedProject.date && (
                            <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span>{selectedProject.date}</span></div>
                          )}
                          {selectedProject.category && (
                            <div className="flex justify-between"><span className="text-muted-foreground">Category:</span><span className="capitalize">{normalizeCategory(selectedProject.category)}</span></div>
                          )}
                        </div>
                      </Card>

                      {Array.isArray(selectedProject.tech) && selectedProject.tech.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Technologies Used</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedProject.tech.map((t: string) => (
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
