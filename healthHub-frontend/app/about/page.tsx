import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Heart, Users, Zap } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Emily Richardson",
      role: "Chief Medical Officer",
      bio: "15+ years in healthcare innovation",
      initials: "ER",
    },
    {
      name: "David Thompson",
      role: "CEO & Founder",
      bio: "Healthcare tech entrepreneur",
      initials: "DT",
    },
    {
      name: "Sarah Mitchell",
      role: "Head of Patient Care",
      bio: "Dedicated to patient experience",
      initials: "SM",
    },
    {
      name: "Michael Zhang",
      role: "Chief Technology Officer",
      bio: "Healthcare software specialist",
      initials: "MZ",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Patient-Centered",
      description: "Every decision we make prioritizes patient well-being and satisfaction.",
    },
    {
      icon: Users,
      title: "Collaborative",
      description: "We work closely with healthcare providers and patients to deliver the best care.",
    },
    {
      icon: Zap,
      title: "Innovative",
      description: "We embrace technology to make healthcare more accessible and efficient.",
    },
    {
      icon: CheckCircle,
      title: "Reliable",
      description: "Trust and security are at the foundation of everything we do.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">About HealthHub</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Transforming healthcare delivery through modern technology and patient-centered design.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Our Story</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Reimagining Patient Care</h2>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2020, HealthHub emerged from a simple realization: patients deserve better access to their
                healthcare. Our team of healthcare professionals and technology experts came together with a mission to
                bridge the gap between patients and healthcare providers.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we serve thousands of patients and healthcare facilities worldwide, providing them with a secure,
                intuitive platform for managing appointments, medical records, and health information all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Join HealthHub</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="bg-transparent">
                    Get In Touch
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <img
                src="/healthcare-professionals-modern-medical-office.jpg"
                alt="HealthHub team collaboration"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-24 px-4 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower patients and healthcare providers with accessible, secure, and intuitive technology that
                simplifies healthcare management and improves patient outcomes.
              </p>
            </Card>

            <Card className="p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where healthcare is seamlessly integrated into daily life, enabling everyone to take control of
                their health and receive care when and where they need it.
              </p>
            </Card>

            <Card className="p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Our Commitment</h3>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to maintaining the highest standards of security, privacy, and compliance while
                continuously innovating to serve our users better.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Our Values</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">What Drives Us</h2>
            <p className="text-lg text-muted-foreground text-balance">
              These core values guide every decision we make and shape our company culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <Card key={idx} className="p-8 border border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-24 px-4 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Our Team</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">Meet Our Leadership</h2>
            <p className="text-lg text-muted-foreground text-balance">
              A team of healthcare and technology experts passionate about transforming patient care.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className="p-6 border border-border text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <span className="font-semibold text-white text-lg">{member.initials}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Active Patients" },
              { number: "500+", label: "Healthcare Providers" },
              { number: "50+", label: "Hospitals & Clinics" },
              { number: "24/7", label: "Customer Support" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <p className="text-muted-foreground text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Experience the future of healthcare management with HealthHub today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                Get Started Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
