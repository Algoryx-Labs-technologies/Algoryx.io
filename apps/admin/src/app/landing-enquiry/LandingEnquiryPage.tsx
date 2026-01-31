import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Mail, Loader2, Calendar, Phone, Building, MessageSquare, User, X } from 'lucide-react';
import { getAuthToken } from '../action-center/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

interface LandingEnquiry {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  companyOrg: string | null;
  message: string;
  haveSource: string | null;
  updated_at: string;
  created_at: string;
}

export function LandingEnquiryPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<LandingEnquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<LandingEnquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/landing-enquiries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch landing enquiries');
      }

      if (result.success && result.data) {
        setEnquiries(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching landing enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleEnquiryClick = (enquiry: LandingEnquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        isCollapsed ? "md:ml-20" : "md:ml-80"
      )}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-hero">Landing Enquiry</h1>
              <p className="text-gray-400 mt-1 font-footer">View all enquiries from the landing page</p>
            </div>
            <Button
              onClick={fetchEnquiries}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Refresh'
              )}
            </Button>
          </div>

          {/* Landing Enquiries List */}
          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-400" />
                All Landing Enquiries ({enquiries.length})
              </CardTitle>
              <CardDescription>View all enquiries submitted from the landing page</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
              ) : enquiries.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No landing enquiries found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((enquiry) => (
                    <div
                      key={enquiry.uid}
                      onClick={() => handleEnquiryClick(enquiry)}
                      className="bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <User className="h-4 w-4 text-blue-400" />
                            <h3 className="text-white font-semibold">{enquiry.fullName}</h3>
                          </div>
                          <div className="space-y-1 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span>{enquiry.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span>{enquiry.phone}</span>
                            </div>
                            {enquiry.companyOrg && (
                              <div className="flex items-center gap-2">
                                <Building className="h-3 w-3" />
                                <span>{enquiry.companyOrg}</span>
                              </div>
                            )}
                            {enquiry.haveSource && (
                              <div className="text-xs text-gray-500">
                                Source: {enquiry.haveSource}
                              </div>
                            )}
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-500">Message:</span>
                            </div>
                            <p className="text-gray-300 text-sm line-clamp-2">{enquiry.message}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400 border-t border-white/10 pt-3 mt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created: <span className="text-white">
                              {new Date(enquiry.created_at).toLocaleString()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enquiry Detail Modal */}
          {isDetailModalOpen && selectedEnquiry && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-slate-900/95 z-10 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-400" />
                        Enquiry Details
                      </CardTitle>
                      <CardDescription>Landing Page Enquiry Information</CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        setSelectedEnquiry(null);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 mt-4">
                  {/* Personal Information */}
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Full Name:</span>
                        <span className="text-white ml-2 font-medium">{selectedEnquiry.fullName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white ml-2 font-medium">{selectedEnquiry.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white ml-2 font-medium">{selectedEnquiry.phone}</span>
                      </div>
                      {selectedEnquiry.companyOrg && (
                        <div>
                          <span className="text-gray-400">Company/Organization:</span>
                          <span className="text-white ml-2 font-medium">{selectedEnquiry.companyOrg}</span>
                        </div>
                      )}
                      {selectedEnquiry.haveSource && (
                        <div>
                          <span className="text-gray-400">Source:</span>
                          <span className="text-white ml-2 font-medium">{selectedEnquiry.haveSource}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                      Message
                    </h3>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      Timestamps
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white ml-2">
                          {new Date(selectedEnquiry.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white ml-2">
                          {new Date(selectedEnquiry.updated_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
