import { Metadata } from 'next'
import Layout from '@/components/templates/Layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'TheDevClub - Contact Us',
  description: 'Get in touch with TheDevClub team',
}

export default function ContactPage() {
  return (
      <Layout isLoading={false}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  <strong>Email:</strong> info@thedevclub.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p>
                  <strong>Address:</strong><br />
                  123 Developer Street<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
                <p>
                  <strong>Social Media:</strong><br />
                  Twitter: @thedevclub<br />
                  GitHub: github.com/thedevclub<br />
                  LinkedIn: linkedin.com/company/thedevclub
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

