import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Star, Quote, User, Heart, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../components/ui/utils';
import { apiClient } from '@/lib/api';

export interface Feedback {
  uid: string;
  userName: string | null;
  email: string | null;
  overallRating: number;
  feedback: string | null;
  created_at: Date | string;
  User: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  Client: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null;
  Partner: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null;
}

export function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  // Fetch top feedback from API
  useEffect(() => {
    const fetchTopFeedback = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Feedback[]>('/feedback/top');
        if (response.success && response.data) {
          setFeedbacks(response.data);
        } else {
          console.error('Error fetching top feedback:', response.error);
          setFeedbacks([]);
        }
      } catch (error) {
        console.error('Error fetching top feedback:', error);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopFeedback();
  }, []);

  const totalPages = Math.ceil(feedbacks.length / reviewsPerPage);

  const formatDate = (dateString: Date | string) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDisplayName = (feedback: Feedback): string => {
    if (feedback.userName) return feedback.userName;
    if (feedback.User) {
      const firstName = feedback.User.firstName || '';
      const lastName = feedback.User.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'Anonymous';
    }
    if (feedback.Client?.User) {
      const firstName = feedback.Client.User.firstName || '';
      const lastName = feedback.Client.User.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'Anonymous';
    }
    if (feedback.Partner?.User) {
      const firstName = feedback.Partner.User.firstName || '';
      const lastName = feedback.Partner.User.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'Anonymous';
    }
    return 'Anonymous';
  };

  const getDisplayRole = (feedback: Feedback): string => {
    if (feedback.Client) return 'Client';
    if (feedback.Partner) return 'Partner';
    return 'User';
  };

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentFeedbacks = feedbacks.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-hero text-white flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-400" />
          Happy Customers
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-400 font-footer">Loading feedback...</p>
            </div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <p className="text-gray-400 font-footer">No top feedback available yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            {currentFeedbacks.map((feedback) => (
              <div
                key={feedback.uid}
                className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold font-hero text-white">
                        {getDisplayName(feedback)}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(feedback.overallRating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-footer">
                      {getDisplayRole(feedback)}
                    </p>
                    <p className="text-xs text-gray-500 font-footer mt-1">
                      {formatDate(feedback.created_at)}
                    </p>
                  </div>
                </div>
                {feedback.feedback && (
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-1 h-8 w-8 text-blue-500/20" />
                    <p className="text-sm text-gray-300 font-footer leading-relaxed pl-6">
                      {feedback.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 font-footer text-sm",
                currentPage === 1
                  ? "bg-slate-800/50 border-white/10 text-gray-600 cursor-not-allowed"
                  : "bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-700/70 hover:text-white hover:border-blue-500/50"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 rounded-lg border transition-all duration-200 font-footer text-sm",
                      currentPage === page
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                        : "bg-slate-700/50 border-white/20 text-gray-400 hover:bg-slate-700/70 hover:text-white hover:border-blue-500/50"
                    )}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 font-footer text-sm",
                currentPage === totalPages
                  ? "bg-slate-800/50 border-white/10 text-gray-600 cursor-not-allowed"
                  : "bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-700/70 hover:text-white hover:border-blue-500/50"
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

