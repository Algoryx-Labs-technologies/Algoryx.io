import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { FeedbackList } from './FeedbackList';
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  ThumbsUp,
} from 'lucide-react';
import { useState } from 'react';

interface FeedbackForm {
  overallRating: number;
  serviceQuality: number;
  communication: number;
  timeliness: number;
  valueForMoney: number;
  name: string;
  email: string;
  feedback: string;
  wouldRecommend: boolean | null;
  improvements: string;
  favoriteFeature: string;
}

export function FeedbackPage() {
  const { isCollapsed } = useSidebar();
  const [formData, setFormData] = useState<FeedbackForm>({
    overallRating: 0,
    serviceQuality: 0,
    communication: 0,
    timeliness: 0,
    valueForMoney: 0,
    name: '',
    email: '',
    feedback: '',
    wouldRecommend: null,
    improvements: '',
    favoriteFeature: '',
  });
  const [hoveredRating, setHoveredRating] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    hoveredValue, 
    onHover, 
    onHoverLeave,
    label 
  }: { 
    rating: number; 
    onRatingChange: (value: number) => void;
    hoveredValue: number;
    onHover: (value: number) => void;
    onHoverLeave: () => void;
    label: string;
  }) => {
    const displayRating = hoveredValue || rating;
    
    return (
      <div className="space-y-2">
        <Label className="text-gray-300 font-footer font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => onHover(star)}
              onMouseLeave={onHoverLeave}
              className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  star <= displayRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-700 text-gray-600"
                )}
              />
            </button>
          ))}
          {displayRating > 0 && (
            <span className="ml-2 text-sm text-gray-400 font-footer">
              {displayRating} / 5
            </span>
          )}
        </div>
      </div>
    );
  };

  const handleRatingChange = (field: keyof FeedbackForm, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof FeedbackForm, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (formData.overallRating === 0) {
      alert('Please provide an overall rating');
      return;
    }
    
    if (!formData.name || !formData.email) {
      alert('Please fill in your name and email');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        overallRating: 0,
        serviceQuality: 0,
        communication: 0,
        timeliness: 0,
        valueForMoney: 0,
        name: '',
        email: '',
        feedback: '',
        wouldRecommend: null,
        improvements: '',
        favoriteFeature: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
        isCollapsed ? "ml-20" : "ml-80"
      )}>
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500/10 dark:bg-yellow-600/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        <div className="h-full overflow-y-auto relative z-10">
          <div className="p-8 max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                Share Your Feedback
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-footer">
                Your opinion matters! Help us improve by sharing your experience
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Feedback Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-hero text-white flex items-center gap-2">
                      <MessageSquare className="h-6 w-6 text-blue-400" />
                      Tell Us About Your Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="py-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="h-10 w-10 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-semibold font-hero text-white mb-2">
                          Thank You!
                        </h3>
                        <p className="text-gray-400 font-footer">
                          Your feedback has been submitted successfully. We appreciate your input!
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Overall Rating */}
                        <div className="p-6 bg-slate-800/50 rounded-xl border border-white/10">
                          <StarRating
                            rating={formData.overallRating}
                            onRatingChange={(value) => handleRatingChange('overallRating', value)}
                            hoveredValue={hoveredRating.overallRating || 0}
                            onHover={(value) => setHoveredRating(prev => ({ ...prev, overallRating: value }))}
                            onHoverLeave={() => setHoveredRating(prev => ({ ...prev, overallRating: 0 }))}
                            label="Overall Rating *"
                          />
                        </div>

                        {/* Detailed Ratings */}
                        <div className="p-6 bg-slate-800/50 rounded-xl border border-white/10 space-y-4">
                          <h3 className="text-lg font-semibold font-hero text-white mb-4">Rate Your Experience</h3>
                          
                          <StarRating
                            rating={formData.serviceQuality}
                            onRatingChange={(value) => handleRatingChange('serviceQuality', value)}
                            hoveredValue={hoveredRating.serviceQuality || 0}
                            onHover={(value) => setHoveredRating(prev => ({ ...prev, serviceQuality: value }))}
                            onHoverLeave={() => setHoveredRating(prev => ({ ...prev, serviceQuality: 0 }))}
                            label="Service Quality"
                          />
                          
                          <StarRating
                            rating={formData.communication}
                            onRatingChange={(value) => handleRatingChange('communication', value)}
                            hoveredValue={hoveredRating.communication || 0}
                            onHover={(value) => setHoveredRating(prev => ({ ...prev, communication: value }))}
                            onHoverLeave={() => setHoveredRating(prev => ({ ...prev, communication: 0 }))}
                            label="Communication"
                          />
                          
                          <StarRating
                            rating={formData.timeliness}
                            onRatingChange={(value) => handleRatingChange('timeliness', value)}
                            hoveredValue={hoveredRating.timeliness || 0}
                            onHover={(value) => setHoveredRating(prev => ({ ...prev, timeliness: value }))}
                            onHoverLeave={() => setHoveredRating(prev => ({ ...prev, timeliness: 0 }))}
                            label="Timeliness"
                          />
                          
                          <StarRating
                            rating={formData.valueForMoney}
                            onRatingChange={(value) => handleRatingChange('valueForMoney', value)}
                            hoveredValue={hoveredRating.valueForMoney || 0}
                            onHover={(value) => setHoveredRating(prev => ({ ...prev, valueForMoney: value }))}
                            onHoverLeave={() => setHoveredRating(prev => ({ ...prev, valueForMoney: 0 }))}
                            label="Value for Money"
                          />
                        </div>

                        {/* Personal Information */}
                        <div className="p-6 bg-slate-800/50 rounded-xl border border-white/10 space-y-4">
                          <h3 className="text-lg font-semibold font-hero text-white mb-4">Your Information</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300 font-footer font-medium">
                              Name *
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
                              className="bg-slate-800/80 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 h-11"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300 font-footer font-medium">
                              Email *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                              className="bg-slate-800/80 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 h-11"
                            />
                          </div>
                        </div>

                        {/* Questionnaire */}
                        <div className="p-6 bg-slate-800/50 rounded-xl border border-white/10 space-y-4">
                          <h3 className="text-lg font-semibold font-hero text-white mb-4">Questionnaire</h3>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300 font-footer font-medium">
                              Would you recommend Algoryx to others? *
                            </Label>
                            <div className="flex gap-4">
                              <button
                                type="button"
                                onClick={() => handleInputChange('wouldRecommend', true)}
                                className={cn(
                                  "flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-200 font-footer",
                                  formData.wouldRecommend === true
                                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                                    : "bg-slate-700/50 border-white/10 text-gray-400 hover:bg-slate-700/70 hover:text-white"
                                )}
                              >
                                <ThumbsUp className="h-5 w-5" />
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => handleInputChange('wouldRecommend', false)}
                                className={cn(
                                  "flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-200 font-footer",
                                  formData.wouldRecommend === false
                                    ? "bg-red-500/20 border-red-500/50 text-red-400"
                                    : "bg-slate-700/50 border-white/10 text-gray-400 hover:bg-slate-700/70 hover:text-white"
                                )}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="favoriteFeature" className="text-gray-300 font-footer font-medium">
                              What's your favorite feature?
                            </Label>
                            <Input
                              id="favoriteFeature"
                              type="text"
                              placeholder="e.g., Project management, Support chat, etc."
                              value={formData.favoriteFeature}
                              onChange={(e) => handleInputChange('favoriteFeature', e.target.value)}
                              className="bg-slate-800/80 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 h-11"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="improvements" className="text-gray-300 font-footer font-medium">
                              What can we improve?
                            </Label>
                            <textarea
                              id="improvements"
                              placeholder="Share your suggestions for improvement..."
                              value={formData.improvements}
                              onChange={(e) => handleInputChange('improvements', e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-md text-white placeholder:text-gray-500 font-footer text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                            />
                          </div>
                        </div>

                        {/* Additional Feedback */}
                        <div className="p-6 bg-slate-800/50 rounded-xl border border-white/10 space-y-4">
                          <h3 className="text-lg font-semibold font-hero text-white mb-4">Additional Comments</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="feedback" className="text-gray-300 font-footer font-medium">
                              Your Feedback
                            </Label>
                            <textarea
                              id="feedback"
                              placeholder="Tell us more about your experience..."
                              value={formData.feedback}
                              onChange={(e) => handleInputChange('feedback', e.target.value)}
                              rows={5}
                              className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-md text-white placeholder:text-gray-500 font-footer text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={isSubmitting || formData.overallRating === 0}
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold font-footer text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Submit Feedback
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Customer Testimonials */}
              <div className="space-y-6">
                <FeedbackList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

