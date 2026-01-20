import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent } from '../components/ui/card';
import { 
  BookOpen, 
  MessageSquare, 
  HelpCircle, 
  Megaphone,
  User,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

type TabType = 'blog' | 'discussions' | 'qa' | 'announcements';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole?: string;
  createdAt: string;
  likes?: number;
  comments?: number;
  views?: number;
  category?: string;
  tags?: string[];
  isOfficial?: boolean;
}

export function CommunityPage() {
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState<TabType>('blog');

  const tabs = [
    { id: 'blog' as TabType, label: 'Blog', icon: BookOpen, description: 'Official posts' },
    { id: 'discussions' as TabType, label: 'Discussions', icon: MessageSquare, description: 'Community posts' },
    { id: 'qa' as TabType, label: 'Q&A', icon: HelpCircle, description: 'Questions & Answers' },
    { id: 'announcements' as TabType, label: 'Announcements', icon: Megaphone, description: 'Important updates' },
  ];

  // Mock data for each tab
  const blogPosts: Post[] = [
    {
      id: '1',
      title: 'Getting Started with Algoryx Platform',
      content: 'Welcome to Algoryx! This comprehensive guide will help you navigate through our platform and make the most of our services. Learn about project management, technical support, and best practices.',
      author: 'Algoryx Team',
      authorRole: 'Official',
      createdAt: '2024-11-20T10:00:00Z',
      likes: 45,
      comments: 12,
      views: 234,
      category: 'Getting Started',
      tags: ['tutorial', 'guide', 'platform'],
      isOfficial: true,
    },
    {
      id: '2',
      title: 'Best Practices for Project Development',
      content: 'Discover the best practices that successful projects follow. From planning to deployment, learn how to streamline your development process and deliver high-quality results.',
      author: 'Technical Team',
      authorRole: 'Official',
      createdAt: '2024-11-18T14:30:00Z',
      likes: 38,
      comments: 8,
      views: 189,
      category: 'Development',
      tags: ['best practices', 'development', 'tips'],
      isOfficial: true,
    },
    {
      id: '3',
      title: 'Understanding Our Tech Stack',
      content: 'A deep dive into the technologies we use and recommend. Learn about our preferred frameworks, tools, and how they work together to build robust applications.',
      author: 'Engineering Team',
      authorRole: 'Official',
      createdAt: '2024-11-15T09:15:00Z',
      likes: 52,
      comments: 15,
      views: 312,
      category: 'Technology',
      tags: ['tech stack', 'frameworks', 'tools'],
      isOfficial: true,
    },
  ];

  const discussionPosts: Post[] = [
    {
      id: '1',
      title: 'How do you handle API rate limiting?',
      content: 'I\'m working on a project that needs to handle multiple API calls. What strategies do you use for rate limiting and managing API quotas?',
      author: 'John Doe',
      createdAt: '2024-11-19T11:20:00Z',
      likes: 23,
      comments: 7,
      views: 145,
      tags: ['api', 'rate limiting', 'best practices'],
    },
    {
      id: '2',
      title: 'Database optimization tips',
      content: 'Share your experiences with database optimization. What techniques have worked best for you in improving query performance?',
      author: 'Sarah Johnson',
      createdAt: '2024-11-17T16:45:00Z',
      likes: 31,
      comments: 11,
      views: 198,
      tags: ['database', 'optimization', 'performance'],
    },
    {
      id: '3',
      title: 'Deployment strategies discussion',
      content: 'Let\'s discuss different deployment strategies. CI/CD, blue-green deployments, canary releases - what works best for your projects?',
      author: 'Mike Chen',
      createdAt: '2024-11-16T08:30:00Z',
      likes: 19,
      comments: 9,
      views: 167,
      tags: ['deployment', 'ci/cd', 'devops'],
    },
  ];

  const qaPosts: Post[] = [
    {
      id: '1',
      title: 'How to integrate payment gateway?',
      content: 'I need help integrating a payment gateway into my e-commerce project. What are the recommended payment providers and how do I get started?',
      author: 'Alex Smith',
      createdAt: '2024-11-20T13:00:00Z',
      likes: 15,
      comments: 5,
      views: 89,
      tags: ['payment', 'integration', 'e-commerce'],
    },
    {
      id: '2',
      title: 'What is the best way to handle authentication?',
      content: 'I\'m building a new application and need advice on authentication. Should I use JWT, OAuth, or session-based authentication?',
      author: 'Emily Davis',
      createdAt: '2024-11-19T10:15:00Z',
      likes: 28,
      comments: 12,
      views: 156,
      tags: ['authentication', 'security', 'jwt'],
    },
    {
      id: '3',
      title: 'How to scale a Node.js application?',
      content: 'My Node.js application is experiencing performance issues as traffic increases. What are the best practices for scaling Node.js applications?',
      author: 'David Wilson',
      createdAt: '2024-11-18T15:30:00Z',
      likes: 22,
      comments: 8,
      views: 134,
      tags: ['node.js', 'scaling', 'performance'],
    },
  ];

  const announcementPosts: Post[] = [
    {
      id: '1',
      title: 'Platform Maintenance Scheduled',
      content: 'We will be performing scheduled maintenance on November 25th from 2:00 AM to 4:00 AM UTC. During this time, some services may be temporarily unavailable. We apologize for any inconvenience.',
      author: 'Algoryx Team',
      authorRole: 'Official',
      createdAt: '2024-11-20T09:00:00Z',
      likes: 12,
      comments: 3,
      views: 456,
      category: 'Maintenance',
      isOfficial: true,
    },
    {
      id: '2',
      title: 'New Feature Release: Enhanced Analytics',
      content: 'We\'re excited to announce the release of our enhanced analytics dashboard! New features include real-time metrics, custom reports, and improved data visualization.',
      author: 'Product Team',
      authorRole: 'Official',
      createdAt: '2024-11-18T11:00:00Z',
      likes: 67,
      comments: 18,
      views: 523,
      category: 'Feature Release',
      isOfficial: true,
    },
    {
      id: '3',
      title: 'Community Guidelines Update',
      content: 'We\'ve updated our community guidelines to ensure a better experience for everyone. Please review the new guidelines and help us maintain a positive and productive community.',
      author: 'Community Team',
      authorRole: 'Official',
      createdAt: '2024-11-15T14:00:00Z',
      likes: 34,
      comments: 6,
      views: 289,
      category: 'Guidelines',
      isOfficial: true,
    },
  ];

  const getPostsForTab = (tab: TabType): Post[] => {
    switch (tab) {
      case 'blog':
        return blogPosts;
      case 'discussions':
        return discussionPosts;
      case 'qa':
        return qaPosts;
      case 'announcements':
        return announcementPosts;
      default:
        return [];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const posts = getPostsForTab(activeTab);
  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
        isCollapsed ? "ml-20" : "ml-80"
      )}>
        {/* Background gradient effects - matching dashboard theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        <div className="h-full overflow-y-auto relative z-10">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                Community
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-footer">
                Connect, learn, and share with the Algoryx community
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-8 flex flex-wrap gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-4 rounded-xl font-footer text-base transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-2 border-blue-500/50 text-white shadow-lg shadow-blue-500/20"
                        : "bg-slate-800/50 border-2 border-white/10 text-gray-400 hover:text-white hover:bg-slate-800/70 hover:border-white/20"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-blue-400" : "text-gray-500"
                    )} />
                    <div className="text-left">
                      <div className="font-semibold">{tab.label}</div>
                      <div className={cn(
                        "text-xs mt-0.5",
                        isActive ? "text-blue-300" : "text-gray-500"
                      )}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-12 text-center">
                    {activeTabInfo && (() => {
                      const Icon = activeTabInfo.icon;
                      return <Icon className="h-16 w-16 text-gray-500 mx-auto mb-4" />;
                    })()}
                    <h3 className="text-xl font-semibold font-hero text-white mb-2">
                      No {activeTabInfo?.label} Posts Yet
                    </h3>
                    <p className="text-gray-400 font-footer">
                      Be the first to create a post in this category
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card
                    key={post.id}
                    className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {post.isOfficial && (
                              <span className="bg-blue-500/20 text-blue-400 text-xs font-footer px-3 py-1 rounded-full border border-blue-500/30">
                                Official
                              </span>
                            )}
                            {post.category && (
                              <span className="bg-purple-500/20 text-purple-400 text-xs font-footer px-3 py-1 rounded-full border border-purple-500/30">
                                {post.category}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold font-hero text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-base text-gray-300 font-footer mb-4 leading-relaxed line-clamp-3">
                        {post.content}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs text-gray-400 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5 font-footer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white font-footer font-medium">
                                {post.author}
                              </p>
                              {post.authorRole && (
                                <p className="text-xs text-gray-400 font-footer">
                                  {post.authorRole}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-footer">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {post.likes !== undefined && (
                            <div className="flex items-center gap-1 text-sm text-gray-400 font-footer">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                          )}
                          {post.comments !== undefined && (
                            <div className="flex items-center gap-1 text-sm text-gray-400 font-footer">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </div>
                          )}
                          {post.views !== undefined && (
                            <div className="flex items-center gap-1 text-sm text-gray-400 font-footer">
                              <span>{post.views} views</span>
                            </div>
                          )}
                          <button className="text-gray-400 hover:text-blue-400 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm text-blue-400 font-footer font-medium group-hover:text-blue-300 transition-colors">
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

