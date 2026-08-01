import { ArrowRight, Calendar, Lock, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">Welcome to HealthHub</p>
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight text-balance">
                  Your Health, Our Priority
                </h1>
                <p className="text-xl text-muted-foreground text-balance">
                  Experience seamless patient care with our modern healthcare portal. Register, book appointments, and
                  manage your health records all in one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">Secure Portal</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
              <img
                src="/healthcare-professionals-modern-medical-office.jpg"
                alt="Modern healthcare environment"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 sm:py-32 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Our Services</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              We provide everything you need to manage your healthcare journey efficiently and securely.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <Card className="p-8 hover:shadow-lg transition-shadow border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Patient Registration</h3>
              <p className="text-muted-foreground mb-6">
                Simple and secure registration process. Complete your medical profile and health history in minutes.
              </p>
              <Link href="/signup" className="text-primary font-semibold hover:text-primary/90 flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            {/* Service Card 2 */}
            <Card className="p-8 hover:shadow-lg transition-shadow border border-border">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Appointment Scheduling</h3>
              <p className="text-muted-foreground mb-6">
                Book appointments with healthcare professionals at your convenience. Real-time availability and instant
                confirmation.
              </p>
              <Link
                href="/signin"
                className="text-secondary font-semibold hover:text-secondary/90 flex items-center gap-2"
              >
                Schedule Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            {/* Service Card 3 */}
            <Card className="p-8 hover:shadow-lg transition-shadow border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Secure Health Records</h3>
              <p className="text-muted-foreground mb-6">
                Access your medical records anytime, anywhere. End-to-end encryption ensures your data is always
                protected.
              </p>
              <Link href="#" className="text-accent font-semibold hover:text-accent/90 flex items-center gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Trusted by Patients</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">What Our Patients Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Patient",
                text: "HealthHub made managing my healthcare so much easier. The appointment booking is seamless and the secure records feature gives me peace of mind.",
                initials: "SJ",
              },
              {
                name: "Michael Chen",
                role: "Patient",
                text: "I appreciate the user-friendly interface and the 24/7 support. It's exactly what modern healthcare needs.",
                initials: "MC",
              },
              {
                name: "Emily Rodriguez",
                role: "Patient",
                text: "Finally, a healthcare portal that feels like it was designed with patients in mind. Highly recommended!",
                initials: "ER",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-8 border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary text-sm">{testimonial.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Join thousands of patients who trust HealthHub with their healthcare management.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                Register Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
