import { Metadata } from 'next';
import Layout from '@/components/templates/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'TheDevClub - About Us',
  description: 'Learn more about TheDevClub and our mission',
};

export default function AboutPage() {
  return (
    <Layout isLoading={false}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">About TheDevClub</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                At TheDevClub, we're passionate about empowering developers to
                track their progress, enhance their productivity, and connect
                with like-minded professionals. Our platform is designed to be
                your daily companion in your journey as a developer.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Daily logging to track your progress</li>
                <li>
                  GitHub integration for a comprehensive view of your work
                </li>
                <li>AI-powered insights to boost your productivity</li>
                <li>A supportive community of developers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Founded in 2023, TheDevClub started as a small group of developers
              who wanted to create a better way to track their daily progress
              and share insights. What began as a side project quickly grew into
              a platform used by developers worldwide. Today, we're committed to
              continually improving our platform and helping developers reach
              their full potential.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
