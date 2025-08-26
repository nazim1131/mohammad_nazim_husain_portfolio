import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter,
  Send,
  Clock,
  MessageSquare,
  CheckCircle,
  Dribbble
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // spam trap
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "husainmohammadnazim@gmail.com",
      href: "mailto:husainmohammadnazim@gmail.com",
      color: "text-neon"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8299648581",
      href: "tel:+91 8299648581",
      color: "text-primary"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "New Delhi,India",
      href: "https://maps.app.goo.gl/TgHetD2D1kBaLkid7",
      color: "text-warning"
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/nazim1131",
      color: "text-foreground"
    },
    {
      icon: Linkedin,
      label: "LinkedIn", 
      href: "https://www.linkedin.com/in/mohammad-nazim-husain-1ab024246/",
      color: "text-neon"
    },
    {
      icon: Dribbble,
      label: "Dribbble",
      href: "https://dribbble.com/savitar_1106",
      color: "text-primary"
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ---- Web3Forms submit via fetch ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // honeypot: bots fill this; bail out silently
    if (honeypot) return;

    setIsSubmitting(true);
    try {
      const payload = {
        access_key: "0f4fa610-5305-4260-89d3-28e64662d4d2",
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "New message from portfolio",
        message: formData.message,

        // helpful extras
        from_name: formData.name,
        reply_to: formData.email,
        // redirect: "https://your-site.com/thanks" // (optional)
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to send");
      }

      setSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you within 24 hours.",
      });

      // reset
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      toast({
        title: "Failed to send",
        description: err?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss your next project or just say hello. I'm always open to new opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Contact Details */}
            <Card className="glass p-6">
              <h3 className="text-2xl font-bold mb-6 text-gradient">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <div className={`p-2 rounded-lg bg-muted/20 mr-4 group-hover:scale-110 transition-transform`}>
                      <info.icon className={`h-5 w-5 ${info.color}`} />
                    </div>
                    <div>
                      <div className="font-medium">{info.label}</div>
                      <div className="text-sm text-muted-foreground group-hover:text-neon transition-colors">
                        {info.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4">Follow Me</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <Button 
                      variant="glass" 
                      size="icon" 
                      className="hover-lift" 
                      asChild
                    >
                      <a 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <social.icon className={`h-5 w-5 ${social.color}`} />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Availability */}
            <Card className="glass p-6">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-neon mr-2" />
                <h3 className="font-bold">Availability</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-neon">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-success">Available for projects</span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone:</span>
                  <span>India (GMT+5:30)</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="glass p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-neon mr-3" />
                <h3 className="text-2xl font-bold">Send Me a Message</h3>
              </div>

              {submitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. I'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                // NOTE: no action/method; JS handles submit
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot (hidden) */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    autoComplete="off"
                    tabIndex={-1}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="mt-2 glass border-border focus:border-neon"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="mt-2 glass border-border focus:border-neon"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="mt-2 glass border-border focus:border-neon"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, ideas, or just say hello..."
                      className="mt-2 glass border-border focus:border-neon min-h-32"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      variant="hero"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="neon"
                      onClick={() => setFormData({ name: "", email: "", subject: "", message: "" })}
                      disabled={isSubmitting}
                    >
                      Clear Form
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    * Required fields. Your information will be kept private and used only to respond to your message.
                  </p>
                </form>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="glass p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gradient">Let's Build Something Amazing Together</h3>
            <p className="text-muted-foreground mb-6">
              Whether you have a project in mind, need technical consultation, or just want to connect, 
              I'm here to help. I love working on challenging problems and creating solutions that make a real difference.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;


