import { ProtectedRoute } from '@/components/auth/protected-route.component';
import { SiteHeader } from '@/components/site-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        <SiteHeader>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
        </SiteHeader>
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>Number of registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">1,234</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Files</CardTitle>
                  <CardDescription>Number of uploaded files</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">5,678</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Storage Used</CardTitle>
                  <CardDescription>Total storage consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">2.5 GB</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>New user registration</span>
                    <span className="text-sm text-muted-foreground">2 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>File upload completed</span>
                    <span className="text-sm text-muted-foreground">5 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System backup</span>
                    <span className="text-sm text-muted-foreground">1 hour ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
