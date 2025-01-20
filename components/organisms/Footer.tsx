import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">TheDevClub</h3>
            <p className="text-muted-foreground">Track your progress, boost productivity, and connect with fellow developers.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-foreground hover:text-foreground/80">Home</Link></li>
              <li><Link href="/dashboard" className="text-foreground hover:text-foreground/80">Dashboard</Link></li>
              <li><Link href="/about" className="text-foreground hover:text-foreground/80">About</Link></li>
              <li><Link href="/contact" className="text-foreground hover:text-foreground/80">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://twitter.com/thedevclub" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80">Twitter</a></li>
              <li><a href="https://github.com/thedevclub" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80">GitHub</a></li>
              <li><a href="https://discord.gg/thedevclub" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80">Discord</a></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} TheDevClub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
