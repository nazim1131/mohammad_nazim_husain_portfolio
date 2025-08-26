import { supabase } from '@/lib/supabase';
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, Eye, EyeOff, Lock, Database, Settings, BarChart3 } from "lucide-react";

// -------- helpers --------
const toArray = (v: any): string[] =>
  Array.isArray(v) ? v.filter(Boolean).map(String).map(s => s.trim())
  : typeof v === "string" ? v.split(",").map(s => s.trim()).filter(Boolean)
  : [];

const toComma = (v: any): string => toArray(v).join(", ");

const CATEGORY_OPTIONS = [
  { id: "fullstack", label: "Full Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "design", label: "Design" },
  { id: "ai", label: "AI & ML" },
  { id: "dataanalysis", label: "Data Analysis" },
];

// ======= Skills: canonical keys/labels =======
type SkillCatKey = "frontend" | "backend" | "design" | "ai" | "dataanalysis" | "tools";

const SKILL_CAT_LABELS: Record<SkillCatKey, string> = {
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI-ML",
  design: "Design",
  tools: "tools",
};

// normalize anything to canonical key (DB me yahi keys save hongi)
const toSkillCatKey = (v: any): SkillCatKey => {
  const s = String(v || "").toLowerCase().trim();

  if (["frontend", "backend", "ai", "dataanalysis", "design", "tools"].includes(s)) {
    return s as SkillCatKey;
  }

  // synonyms → canonical
  if (s.includes("front")) return "frontend";
  if (s.includes("back")) return "backend";
  if (s.includes("ai") || s.includes("cloud") || s.includes("ai") || s.includes("ml")) return "ai";
  if (s.includes("dataanalysis")) return "dataanalysis";
  if (s.includes("design") || s.includes("ux") || s.includes("ui")) return "design";

  return "tools";
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingSkill, setEditingSkill] = useState<any>(null);

  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  async function fetchAll() {
    try {
      const { data: proj, error: pErr } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });
      if (pErr) throw pErr;
      setProjects(proj || []);

      const { data: sk, error: sErr } = await supabase
        .from('skills')
        .select('*')
        .order('level', { ascending: false });
      if (sErr) throw sErr;
      setSkills(sk || []);
    } catch (err: any) {
      toast({ title: "Load failed", description: err?.message || "Unable to fetch data", variant: "destructive" });
    }
  }

  // -------- auth --------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword(loginData);
    if (error) return toast({ title: "Login failed", description: error.message, variant: "destructive" });
    setIsAuthenticated(true);
    fetchAll();
    toast({ title: "Login Successful", description: "Welcome to the admin dashboard!" });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ email: "", password: "" });
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  // -------- projects --------
  const handleSaveProject = async () => {
    try {
      const p = editingProject || {};
      if (!p.title || !p.description) {
        return toast({ title: "Validation Error", description: "Title & Description required.", variant: "destructive" });
      }

      const payload = {
        title: p.title,
        description: p.description,
        longDescription: p.longDescription || null,
        image_url: p.image_url || null,
        tags: toArray(p.techTags ?? p.tags),
        highlights: toArray(p.highlights),
        status: p.status || "draft",
        order_index:
          typeof p.order_index === "number" ? p.order_index :
          typeof p.sortOrder === "number" ? p.sortOrder : 0,
        category: p.category || "fullstack",
        date: p.date || null,
        github: p.github || null,
        live: p.live || null,
        team: p.team ? Number(p.team) : null,
        duration: p.duration || null,
      };

      if (p.id) {
        const { error } = await supabase.from('projects').update(payload).eq('id', p.id);
        if (error) throw error;
        toast({ title: "Project Updated", description: "Saved successfully." });
      } else {
        const { data:{ user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('projects').insert({ ...payload, owner_id: user?.id });
        if (error) throw error;
        toast({ title: "Project Created", description: "New project added." });
      }
      setEditingProject(null);
      await fetchAll();
    } catch (err:any) {
      toast({ title: "Save failed", description: err?.message || "Unexpected error", variant: "destructive" });
    }
  };

  const handleDeleteProject = async (id: string|number) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Project Deleted", description: "Removed successfully." });
      await fetchAll();
    } catch (err:any) {
      toast({ title: "Delete failed", description: err?.message || "Unexpected error", variant: "destructive" });
    }
  };

  // -------- skills --------
  const handleSaveSkill = async () => {
    try {
      if (!editingSkill?.name) {
        return toast({ title: "Validation Error", description: "Skill name required.", variant: "destructive" });
      }
      const payload = {
        name: editingSkill.name,
        description: editingSkill.description || null,
        level: typeof editingSkill.level === "number" ? editingSkill.level : Number(editingSkill.level || 0),
        category: toSkillCatKey(editingSkill.category), // save canonical key
      };
      if (editingSkill.id) {
        const { error } = await supabase.from('skills').update(payload).eq('id', editingSkill.id);
        if (error) throw error;
        toast({ title: "Skill Updated", description: "Saved successfully." });
      } else {
        const { data:{ user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('skills').insert({ ...payload, owner_id: user?.id });
        if (error) throw error;
        toast({ title: "Skill Created", description: "New skill added." });
      }
      setEditingSkill(null);
      await fetchAll();
    } catch (err:any) {
      toast({ title: "Save failed", description: err?.message || "Unexpected error", variant: "destructive" });
    }
  };

  const handleDeleteSkill = async (id: string | number) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Skill Deleted", description: "Removed successfully." });
      await fetchAll();
    } catch (err:any) {
      toast({ title: "Delete failed", description: err?.message || "Unexpected error", variant: "destructive" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card className="glass p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">Admin Access</h1>
              <p className="text-muted-foreground">Please sign in to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={loginData.email}
                  onChange={(e)=>setLoginData(prev=>({...prev, email:e.target.value}))}
                  placeholder="admin@portfolio.com" className="mt-2 glass border-border focus:border-neon" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword?"text":"password"} value={loginData.password}
                    onChange={(e)=>setLoginData(prev=>({...prev, password:e.target.value}))}
                    placeholder="Enter your password" className="mt-2 glass border-border focus:border-neon pr-10" required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-2 h-9 w-9"
                    onClick={()=>setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" variant="hero" className="w-full">
                <Lock className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div>
            <h1 className="text-4xl font-bold text-gradient">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your portfolio content</p>
          </div>
          <Button variant="neon" onClick={handleLogout}>Logout</Button>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <Card className="glass p-6 text-center">
            <Database className="w-8 h-8 text-neon mx-auto mb-2" />
            <div className="text-2xl font-bold">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </Card>
          <Card className="glass p-6 text-center">
            <Settings className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{skills.length}</div>
            <div className="text-sm text-muted-foreground">Skills</div>
          </Card>
          <Card className="glass p-6 text-center">
            <Eye className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">{projects.filter(p=>p.status==='published').length}</div>
            <div className="text-sm text-muted-foreground">Published</div>
          </Card>
          <Card className="glass p-6 text-center">
            <BarChart3 className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-muted-foreground">Avg Skill Level</div>
          </Card>
        </motion.div>

        {/* Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Projects */}
          <TabsContent value="projects">
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Manage Projects</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="hero"
                      onClick={() =>
                        setEditingProject({
                          id: null,
                          title: "",
                          description: "",
                          longDescription: "",
                          image_url: "",
                          techTags: "",
                          highlights: "",
                          status: "draft",
                          category: "fullstack",
                          date: "",
                          github: "",
                          live: "",
                          team: 1,
                          duration: "",
                          order_index: (projects?.length || 0) + 1,
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl glass">
                    <DialogHeader><DialogTitle>{editingProject?.id ? "Edit Project" : "Add New Project"}</DialogTitle></DialogHeader>

                    {editingProject && (
                      <div className="space-y-4">
                        <div>
                          <Label>Title *</Label>
                          <Input value={editingProject.title} onChange={(e)=>setEditingProject((p:any)=>({...p, title:e.target.value}))} className="glass" />
                        </div>

                        <div>
                          <Label>Description *</Label>
                          <Textarea value={editingProject.description} onChange={(e)=>setEditingProject((p:any)=>({...p, description:e.target.value}))} className="glass" />
                        </div>

                        <div>
                          <Label>Long Description</Label>
                          <Textarea value={editingProject.longDescription || ""} onChange={(e)=>setEditingProject((p:any)=>({...p, longDescription:e.target.value}))} className="glass" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Category</Label>
                            <Select value={editingProject.category} onValueChange={(v)=>setEditingProject((p:any)=>({...p, category:v}))}>
                              <SelectTrigger className="glass"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {CATEGORY_OPTIONS.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Select value={editingProject.status} onValueChange={(v)=>setEditingProject((p:any)=>({...p, status:v}))}>
                              <SelectTrigger className="glass"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Date</Label>
                            <Input placeholder="YYYY-MM" value={editingProject.date || ""} onChange={(e)=>setEditingProject((p:any)=>({...p, date:e.target.value}))} className="glass" />
                          </div>
                          <div>
                            <Label>Order Index</Label>
                            <Input type="number" value={editingProject.order_index ?? 0} onChange={(e)=>setEditingProject((p:any)=>({...p, order_index: parseInt(e.target.value)||0}))} className="glass" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>GitHub URL</Label>
                            <Input value={editingProject.github || ""} onChange={(e)=>setEditingProject((p:any)=>({...p, github:e.target.value}))} className="glass" />
                          </div>
                          <div>
                            <Label>Live URL</Label>
                            <Input value={editingProject.live || ""} onChange={(e)=>setEditingProject((p:any)=>({...p, live:e.target.value}))} className="glass" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Team Size</Label>
                            <Input type="number" value={editingProject.team ?? 1} onChange={(e)=>setEditingProject((p:any)=>({...p, team: parseInt(e.target.value)||1}))} className="glass" />
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <Input value={editingProject.duration || ""} onChange={(e)=>setEditingProject((p:any)=>({...p, duration:e.target.value}))} className="glass" />
                          </div>
                        </div>

                        <div>
                          <Label>Image URL</Label>
                          <Input value={editingProject.image_url || ""} onChange={(e)=>setEditingProject((p:any)=>({...p, image_url:e.target.value}))} className="glass" />
                        </div>

                        <div>
                          <Label>Tech Stack (comma separated)</Label>
                          <Input value={editingProject.techTags ?? toComma(editingProject.tags)} onChange={(e)=>setEditingProject((p:any)=>({...p, techTags:e.target.value}))} className="glass" />
                        </div>

                        <div>
                          <Label>Highlights (comma separated)</Label>
                          <Input value={typeof editingProject.highlights === "string" ? editingProject.highlights : toComma(editingProject.highlights)} onChange={(e)=>setEditingProject((p:any)=>({...p, highlights:e.target.value}))} className="glass" />
                        </div>

                        <div className="flex gap-3">
                          <Button variant="hero" onClick={handleSaveProject}><Save className="mr-2 h-4 w-4" />Save Project</Button>
                          <Button variant="neon" onClick={()=>setEditingProject(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {projects.map((project) => {
                  const tagList = toArray(project?.tags);
                  return (
                    <Card key={project.id} className="p-4 bg-muted/20 hover-lift">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold">{project.title}</h3>
                            <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>{project.status}</Badge>
                            {project.category && <Badge variant="outline">{project.category}</Badge>}
                            <Badge variant="outline">Order: {project.order_index ?? 0}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {tagList.map((t, i) => <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>)}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="glass"
                                size="icon"
                                onClick={() => setEditingProject({
                                  ...project,
                                  techTags: toComma(project.tags),
                                  highlights: toComma(project.highlights),
                                })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                          <Button variant="glass" size="icon" onClick={() => handleDeleteProject(project.id)} className="hover:border-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills">
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Manage Skills</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    {/* DEFAULT category = canonical 'frontend' */}
                    <Button variant="hero" onClick={() => setEditingSkill({ id:null, name:"", description:"", level:50, category:"frontend" })}>
                      <Plus className="mr-2 h-4 w-4" /> Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass">
                    <DialogHeader><DialogTitle>{editingSkill?.id ? "Edit Skill" : "Add New Skill"}</DialogTitle></DialogHeader>
                    {editingSkill && (
                      <div className="space-y-4">
                        <div>
                          <Label>Skill Name *</Label>
                          <Input value={editingSkill.name} onChange={(e)=>setEditingSkill((s:any)=>({...s, name:e.target.value}))} className="glass" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input value={editingSkill.description} onChange={(e)=>setEditingSkill((s:any)=>({...s, description:e.target.value}))} className="glass" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Level (0-100) *</Label>
                            <Input type="number" min="0" max="100" value={editingSkill.level} onChange={(e)=>setEditingSkill((s:any)=>({...s, level: parseInt(e.target.value)||0}))} className="glass" />
                          </div>
                          <div>
                            <Label>Category</Label>
                            {/* VALUES are canonical lowercase keys */}
                            <Select value={editingSkill.category} onValueChange={(v)=>setEditingSkill((s:any)=>({...s, category:v}))}>
                              <SelectTrigger className="glass"><SelectValue placeholder="Select a category" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="frontend">Frontend</SelectItem>
                                <SelectItem value="backend">Backend</SelectItem>
                                <SelectItem value="devops">DevOps / AI-ML</SelectItem>
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="hero" onClick={handleSaveSkill}><Save className="mr-2 h-4 w-4" />Save Skill</Button>
                          <Button variant="neon" onClick={()=>setEditingSkill(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {skills.map((skill) => (
                  <Card key={skill.id} className="p-4 bg-muted/20 hover-lift">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold">{skill.name}</h3>
                          <Badge variant="outline">
                            {SKILL_CAT_LABELS[toSkillCatKey(skill.category as SkillCatKey)]}
                          </Badge>
                          <Badge variant="secondary" className={`${(skill.level??0)>=90?'text-neon':(skill.level??0)>=80?'text-primary':'text-warning'}`}>
                            {skill.level}%
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{skill.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="glass" size="icon" onClick={()=>setEditingSkill({
                              ...skill,
                              category: toSkillCatKey(skill.category as SkillCatKey), // ensure dialog shows canonical
                            })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        <Button variant="glass" size="icon" onClick={()=>handleDeleteSkill(skill.id)} className="hover:border-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
