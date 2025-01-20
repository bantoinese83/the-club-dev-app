'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import Layout from '@/components/templates/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [isLoading] = useState(false);

  return (
    <AuthGuard>
      <Layout isLoading={isLoading}>
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-transparent"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </Layout>
    </AuthGuard>
  );
}
