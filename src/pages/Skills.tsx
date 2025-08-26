import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Code, Palette, Database, Wrench, Computer } from "lucide-react";

// ---- Canonical categories used in DB ----
// Store these EXACT keys in DB: frontend | backend | devops | mobile | design | other
type CatKey = "frontend" | "backend" | "devops" | "mobile" | "design" | "other";
type UISkill = { name: string; level: number; description?: string };

const CAT_META: {
  key: CatKey;
  title: string;
  icon: any;
  color: string;
  skills: UISkill[];
}[] = [
  {
    key: "frontend",
    title: "Frontend Development",
    icon: Code,
    color: "text-neon",
    skills: [],
  },
  {
    key: "backend",
    title: "Backend Development",
    icon: Database,
    color: "text-primary",
    skills: [],
  },
  {
    key: "devops", // we show it as AI/ML, but key stays "devops"
    title: "AI & Machine Learning",
    icon: Computer,
    color: "text-warning",
    skills: [],
  },
  {
    key: "design",
    title: "Design & UX",
    icon: Palette,
    color: "text-neon-bright",
    skills: [],
  },
  {
    key: "other",
    title: "Tools & Others",
    icon: Wrench,
    color: "text-accent-bright",
    skills: [],
  },
];

// Map any messy text from DB to our canonical keys
const normalizeCatKey = (raw: any): CatKey => {
  const v = String(raw || "").toLowerCase().trim();
  if (v.includes("front")) return "frontend";
  if (v.includes("back")) return "backend";
  // treat ai/ml also as the "devops" bucket (your AI & ML card)
  if (v.includes("devops") || v.includes("cloud") || v.includes("ai") || v.includes("ml")) return "devops";
  if (v.includes("mobile")) return "mobile";
  if (v.includes("design") || v.includes("ux") || v.includes("ui")) return "design";
  return "other";
};

const getSkillColor = (level: number) => {
  if (level >= 90) return "text-neon";
  if (level >= 80) return "text-primary";
  if (level >= 70) return "text-warning";
  return "text-muted-foreground";
};
const getProgressColor = (level: number) => {
  if (level >= 90) return "bg-neon";
  if (level >= 80) return "bg-primary";
  if (level >= 70) return "bg-warning";
  return "bg-muted-foreground";
};

const Skills = () => {
  const [dbSkills, setDbSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("id, name, description, level, category")
        .order("level", { ascending: false });
      if (!error) setDbSkills(data || []);
      setLoading(false);
    })();
  }, []);

  // Group DB skills by canonical category key
  const byKey: Record<CatKey, UISkill[]> = {
    frontend: [],
    backend: [],
    devops: [],
    mobile: [],
    design: [],
    other: [],
  };
  dbSkills.forEach((s) => {
    const key = normalizeCatKey(s?.category);
    byKey[key].push({
      name: s?.name || "Untitled",
      level: typeof s?.level === "number" ? s.level : Number(s?.level || 0),
      description: s?.description || "",
    });
  });

  // Merge DB skills (top) + static skills (bottom), and sort by level desc
  const categories = CAT_META.map((c) => {
    const merged = [...byKey[c.key], ...c.skills].sort((a, b) => (b.level || 0) - (a.level || 0));
    return { ...c, skills: merged };
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            My <span className="text-gradient">Skills</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
          {loading && <div className="mt-3 opacity-70 text-sm">Loading skills…</div>}
        </motion.div>

        {/* Category Cards (DB + Static merged) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
            >
              <Card className="glass hover-lift p-6 h-full">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-muted/20 mr-3">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={`${skill.name}-${skillIndex}`}
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{skill.name}</span>
                        <Badge variant="secondary" className={`${getSkillColor(skill.level)} text-xs`}>
                          {skill.level}%
                        </Badge>
                      </div>

                      <div className="relative">
                        <Progress value={skill.level} className="h-2 bg-muted/30" />
                        <motion.div
                          className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(skill.level)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{
                            duration: 1,
                            delay: categoryIndex * 0.2 + skillIndex * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      </div>

                      {skill.description && (
                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
