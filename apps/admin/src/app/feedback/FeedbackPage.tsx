import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Star, CheckCircle2, XCircle, RefreshCw, Search } from 'lucide-react';
import { handleApiRequest, getAuthToken } from '../action-center/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

interface Feedback {
  uid: string;
  userId: string | null;
  clientId: string | null;
  partnerId: string | null;
  overallRating: number;
  serviceQuality: number | null;
  communication: number | null;
  timeliness: number | null;
  valueForMoney: number | null;
  feedback: string | null;
  wouldRecommend: boolean | null;
  improvements: string | null;
  favoriteFeature: string | null;
  userName: string | null;
  email: string | null;
  updated_at: Date;
  created_at: Date;
  isTopFeedback: boolean;
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

export function FeedbackPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [feedbackForm, setFeedbackForm] = useState({
    feedbackId: '',
    isTop: true,
  });

  const resetForm = () => {
    setFeedbackForm({ feedbackId: '', isTop: true });
  };

  // Fetch all feedback
  const fetchFeedbacks = async () => {
    setLoadingFeedbacks(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/feedback`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch feedback');
      }

      if (result.success && result.data) {
        setFeedbacks(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      setMessage({ type: 'error', text: 'Failed to fetch feedback' });
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Handle mark as top feedback
  const handleMarkAsTop = async (feedbackId: string, isTop: boolean) => {
    setLoading(`mark-${feedbackId}`);
    setMessage(null);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/feedback/${feedbackId}/top`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isTop }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update feedback');
      }

      setMessage({ type: 'success', text: `Feedback ${isTop ? 'marked as' : 'unmarked from'} top feedback` });
      fetchFeedbacks(); // Refresh the list
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update feedback' });
    } finally {
      setLoading(null);
    }
  };

  // Filter feedback based on search query
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const searchLower = searchQuery.toLowerCase();
    const userName = feedback.userName?.toLowerCase() || '';
    const email = feedback.email?.toLowerCase() || '';
    const feedbackText = feedback.feedback?.toLowerCase() || '';
    const userEmail = feedback.User?.email?.toLowerCase() || '';
    const userFirstName = feedback.User?.firstName?.toLowerCase() || '';
    const userLastName = feedback.User?.lastName?.toLowerCase() || '';
    
    return (
      userName.includes(searchLower) ||
      email.includes(searchLower) ||
      feedbackText.includes(searchLower) ||
      userEmail.includes(searchLower) ||
      userFirstName.includes(searchLower) ||
      userLastName.includes(searchLower) ||
      feedback.uid.toLowerCase().includes(searchLower)
    );
  });

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            )}
          />
        ))}
      </div>
    );
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
              <h1 className="text-3xl font-bold text-white font-hero">Feedback</h1>
              <p className="text-gray-400 mt-1 font-footer">Manage and view all feedback</p>
            </div>
            <Button
              onClick={fetchFeedbacks}
              disabled={loadingFeedbacks}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loadingFeedbacks && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {message && (
            <div className={cn(
              "p-4 rounded-lg flex items-center gap-2",
              message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'
            )}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{message?.text}</span>
            </div>
          )}

          {/* Search Bar */}
          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white pl-10"
                  placeholder="Search feedback by name, email, or content..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-400" />
                All Feedback ({filteredFeedbacks.length})
              </CardTitle>
              <CardDescription>View and manage all submitted feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFeedbacks ? (
                <div className="text-center py-8 text-gray-400">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading feedback...</p>
                </div>
              ) : filteredFeedbacks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No feedback found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFeedbacks.map((feedback) => (
                    <div
                      key={feedback.uid}
                      className={cn(
                        "p-4 rounded-lg border transition-all",
                        feedback.isTopFeedback
                          ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/50"
                          : "bg-slate-800/30 border-white/10"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold">
                              {feedback.userName || 
                               (feedback.User ? `${feedback.User.firstName || ''} ${feedback.User.lastName || ''}`.trim() : 'Anonymous') ||
                               'Anonymous User'}
                            </h3>
                            {feedback.isTopFeedback && (
                              <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/50">
                                Top Feedback
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {feedback.email || feedback.User?.email || 'No email'}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(feedback.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleMarkAsTop(feedback.uid, !feedback.isTopFeedback)}
                          disabled={loading === `mark-${feedback.uid}`}
                          size="sm"
                          className={cn(
                            "ml-2",
                            feedback.isTopFeedback
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-slate-700 hover:bg-slate-600"
                          )}
                        >
                          {loading === `mark-${feedback.uid}` ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Star className={cn("h-4 w-4", feedback.isTopFeedback && "fill-current")} />
                          )}
                        </Button>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Overall Rating:</span>
                          {renderStars(feedback.overallRating)}
                          <span className="text-white text-sm font-medium">{feedback.overallRating}/5</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {feedback.serviceQuality && (
                            <div>
                              <span className="text-gray-400">Service Quality: </span>
                              <span className="text-white">{feedback.serviceQuality}/5</span>
                            </div>
                          )}
                          {feedback.communication && (
                            <div>
                              <span className="text-gray-400">Communication: </span>
                              <span className="text-white">{feedback.communication}/5</span>
                            </div>
                          )}
                          {feedback.timeliness && (
                            <div>
                              <span className="text-gray-400">Timeliness: </span>
                              <span className="text-white">{feedback.timeliness}/5</span>
                            </div>
                          )}
                          {feedback.valueForMoney && (
                            <div>
                              <span className="text-gray-400">Value for Money: </span>
                              <span className="text-white">{feedback.valueForMoney}/5</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {feedback.feedback && (
                        <div className="mb-3">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{feedback.feedback}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                        {feedback.wouldRecommend !== null && (
                          <span className="px-2 py-1 bg-slate-700/50 rounded">
                            Would Recommend: {feedback.wouldRecommend ? 'Yes' : 'No'}
                          </span>
                        )}
                        {feedback.favoriteFeature && (
                          <span className="px-2 py-1 bg-slate-700/50 rounded">
                            Favorite: {feedback.favoriteFeature}
                          </span>
                        )}
                        {feedback.improvements && (
                          <span className="px-2 py-1 bg-slate-700/50 rounded">
                            Improvements: {feedback.improvements}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
                        <p>Feedback ID: {feedback.uid}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Select Top Feedback Form */}
          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-400" />
                Select Top Feedback
              </CardTitle>
              <CardDescription>Mark feedback as top feedback by ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Feedback ID *</Label>
                <Input
                  value={feedbackForm.feedbackId}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedbackId: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="Enter feedback ID"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={feedbackForm.isTop}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, isTop: e.target.checked })}
                  className="rounded"
                />
                <Label className="text-gray-300">Mark as top feedback</Label>
              </div>
              <Button
                onClick={() => handleApiRequest(`/feedback/${feedbackForm.feedbackId}/top`, 'POST', { isTop: feedbackForm.isTop }, setLoading, setMessage, 'Select Top Feedback', () => {
                  resetForm();
                  fetchFeedbacks();
                })}
                disabled={loading === 'Select Top Feedback' || !feedbackForm.feedbackId}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                {loading === 'Select Top Feedback' ? 'Updating...' : 'Select Top Feedback'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
