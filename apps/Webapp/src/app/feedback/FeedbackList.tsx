import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Star, Quote, User, Heart } from 'lucide-react';

export interface CustomerTestimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

interface FeedbackListProps {
  testimonials?: CustomerTestimonial[];
}

const defaultTestimonials: CustomerTestimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    rating: 5,
    comment: 'Algoryx has transformed how we manage our development projects. The platform is intuitive, the team is responsive, and the quality of work is exceptional. Highly recommend!',
    date: '2024-11-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'CTO',
    company: 'StartupXYZ',
    rating: 5,
    comment: 'Outstanding service and support. The team went above and beyond to understand our requirements and delivered exactly what we needed. The communication throughout was excellent.',
    date: '2024-11-10',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Founder',
    company: 'InnovateLabs',
    rating: 5,
    comment: 'Best decision we made for our tech stack. The projects are delivered on time, the code quality is top-notch, and the support team is always available when we need them.',
    date: '2024-11-05',
  },
  {
    id: '4',
    name: 'David Thompson',
    role: 'Engineering Lead',
    company: 'ScaleUp Inc',
    rating: 5,
    comment: 'The platform makes project management seamless. The transparency, regular updates, and attention to detail make Algoryx stand out from the competition.',
    date: '2024-10-28',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    role: 'Operations Director',
    company: 'GrowthCo',
    rating: 5,
    comment: 'We\'ve been using Algoryx for over a year now, and it keeps getting better. The value for money is incredible, and the team truly cares about our success.',
    date: '2024-10-20',
  },
  {
    id: '6',
    name: 'James Wilson',
    role: 'CEO',
    company: 'NextGen Solutions',
    rating: 5,
    comment: 'Professional, reliable, and results-driven. Algoryx has become an integral part of our development workflow. Couldn\'t be happier with the partnership!',
    date: '2024-10-15',
  },
];

export function FeedbackList({ testimonials = defaultTestimonials }: FeedbackListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-hero text-white flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-400" />
          Happy Customers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-200"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold font-hero text-white">
                      {testimonial.name}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-footer">
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </p>
                  <p className="text-xs text-gray-500 font-footer mt-1">
                    {formatDate(testimonial.date)}
                  </p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-2 -left-1 h-8 w-8 text-blue-500/20" />
                <p className="text-sm text-gray-300 font-footer leading-relaxed pl-6">
                  {testimonial.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

