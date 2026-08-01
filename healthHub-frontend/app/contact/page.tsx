import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">Get In Touch</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Have questions? We'd love to hear from you. Our team is here to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
            </div>

            {/* Email */}
            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <a
                    href="mailto:support@healthhub.com"
                    className="text-muted-foreground hover:text-primary transition-colors break-all"
                  >
                    support@healthhub.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                </div>
              </div>
            </Card>

            {/* Phone */}
            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <a href="tel:1-800-4325484" className="text-muted-foreground hover:text-secondary transition-colors">
                    1-800-HEALTH
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Available 24/7</p>
                </div>
              </div>
            </Card>

            {/* Address */}
            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Office</h3>
                  <p className="text-sm text-muted-foreground">123 Medical Center Drive</p>
                  <p className="text-sm text-muted-foreground">Healthcare City, HC 12345</p>
                </div>
              </div>
            </Card>

            {/* Hours */}
            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Mon - Fri: 8:00 AM - 6:00 PM</li>
                    <li>Sat: 9:00 AM - 3:00 PM</li>
                    <li>Sun: Closed</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
              <ContactForm />
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 sm:py-24 px-4 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Visit Us</h2>
          <div className="w-full h-96 rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290357!2d-74.00604!3d40.71282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ0LjIiTiA3NMKwMDAnMjEuOCJX!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="HealthHub Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}
