import React from 'react';
import useSWR from 'swr';
import {
  FileText,
  Folder,
  MessageSquare,
  Star,
  Plus,
  ExternalLink,
  Clock,
  User
} from "lucide-react";
import { Link } from "react-router-dom";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Table from "@/components/shared/table/Table";
import TableHeader from "@/components/shared/table/TableHeader";
import TableRow from "@/components/shared/table/TableRow";
import TableCell from "@/components/shared/table/TableCell";
import { adminClient } from "@/lib/api/adminClient";
import { format } from "date-fns";
import { notify } from "@/lib/toast/notify";
import PageTransition from '@/components/shared/PageTransition';

const fetcher = (url) => adminClient.get(url).then(res => res.data);

const StatCard = ({ title, value, icon: Icon, description, colorClass }) => (
  <Card className="overflow-hidden transition-all hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="size-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

function Dashboard() {
  const { data: stats, error, isLoading, mutate } = useSWR('/dashboard/stats', fetcher);

  const markAsRead = async (id) => {
    try {
      await adminClient.patch(`/dashboard/messages/${id}/read`);
      notify("Message marked as read", "success");
      mutate();
    } catch (error) {
      notify("Failed to update message", "error");
    }
  };

  if (isLoading) return (
    <PageContainer>
      <PageHeader title="Overview" description="Loading metrics..." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32 animate-pulse bg-muted/50" />
        ))}
      </div>
    </PageContainer>
  );

  const counts = stats?.counts || {};
  const recent = stats?.recent || {};

  return (
    <PageTransition>
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description={`Welcome back. You have ${counts.messages?.unread || 0} unread inquiries.`}
        />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Blogs"
            value={counts.blogs || 0}
            icon={FileText}
            colorClass="bg-blue-500/10 text-blue-600"
            description="Articles published"
          />
          <StatCard
            title="Projects"
            value={counts.projects || 0}
            icon={Folder}
            colorClass="bg-purple-500/10 text-purple-600"
            description="Portfolio items"
          />
          <StatCard
            title="Inquiries"
            value={counts.messages?.unread || 0}
            icon={MessageSquare}
            colorClass="bg-amber-500/10 text-amber-600"
            description={`${counts.messages?.total || 0} total messages`}
          />
          <StatCard
            title="Testimonials"
            value={counts.testimonials || 0}
            icon={Star}
            colorClass="bg-emerald-500/10 text-emerald-600"
            description="Client feedback"
          />
        </div>

        <div className="grid gap-6 mt-6 lg:grid-cols-3">
          {/* Recent Messages */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Inquiries</CardTitle>
                  <CardDescription>Latest messages from your portfolio contact form.</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/cms/messages">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader columns={["Sender", "Message", "Date", "Status"]} />
                  <tbody>
                    {recent.messages?.length > 0 ? (
                      recent.messages.map((msg) => (
                        <TableRow key={msg._id} onClick={() => !msg.isRead && markAsRead(msg._id)}>
                          <TableCell>
                            <div className="font-medium">{msg.name}</div>
                            <div className="text-xs text-muted-foreground">{msg.email}</div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {msg.message}
                          </TableCell>
                          <TableCell className="text-xs">
                            {format(new Date(msg.createdAt), 'MMM dd, HH:mm')}
                          </TableCell>
                          <TableCell>
                            {msg.isRead ? (
                              <Badge variant="outline">Read</Badge>
                            ) : (
                              <Badge variant="warning">New</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No inquiries yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild className="justify-start shadow-sm" variant="outline">
                  <Link to="/cms/blogs">
                    <Plus className="mr-2 size-4" /> New Blog Post
                  </Link>
                </Button>
                <Button asChild className="justify-start shadow-sm" variant="outline">
                  <Link to="/cms/projects">
                    <Plus className="mr-2 size-4" /> Add Project
                  </Link>
                </Button>
                <Button asChild className="justify-start shadow-sm" variant="outline">
                  <Link to="/cms/about">
                    <User className="mr-2 size-4" /> Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recently Published</CardTitle>
                <Clock className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recent.blogs?.map(blog => (
                    <div key={blog._id} className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                          {blog.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Blog • {format(new Date(blog.createdAt), 'MMM dd')}
                        </p>
                      </div>
                      <Button size="icon-sm" variant="ghost" asChild>
                        <Link to={`/cms/blogs/${blog._id}/edit`}>
                          <ExternalLink className="size-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {recent.projects?.map(project => (
                    <div key={project._id} className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                          {project.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Project • {format(new Date(project.createdAt), 'MMM dd')}
                        </p>
                      </div>
                      <Button size="icon-sm" variant="ghost" asChild>
                        <Link to={`/cms/projects/${project._id}/edit`}>
                          <ExternalLink className="size-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </PageTransition>
  );
}

export default Dashboard;
