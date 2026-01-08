import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { ScrollReveal } from './ScrollReveal';

const faqData = [
  {
    question: 'Which brokers does Algoryx support?',
    answer: 'Algoryx supports integration with major brokers and trading platforms. We continuously expand our broker support to ensure compatibility with the most popular trading services. Please check our documentation or contact us for the latest list of supported brokers.',
  },
  {
    question: 'Do I need to switch brokers to use Algoryx?',
    answer: 'No, you don\'t need to switch brokers. Algoryx is designed to work with your existing broker account. Simply connect your broker through our secure API integration, and you can start using all of Algoryx\'s features without changing your current setup.',
  },
  {
    question: 'How does automatic journaling work?',
    answer: 'Algoryx automatically tracks and journals your trades by connecting to your broker account. Our system captures trade data, entry/exit points, P&L, and other relevant metrics automatically. This eliminates manual data entry and ensures accurate, real-time trade analysis.',
  },
  {
    question: 'What kind of analysis does the AI provide?',
    answer: 'Our AI provides comprehensive trading analysis including performance metrics, risk assessment, pattern recognition, trade recommendations, and personalized insights based on your trading history. The AI learns from your trading patterns to offer actionable feedback and help improve your trading strategy.',
  },
  {
    question: 'Is my trading data safe?',
    answer: 'Yes, your trading data is completely safe. We use bank-level encryption and follow industry-standard security practices. Your data is encrypted in transit and at rest, and we never share your information with third parties. Your privacy and security are our top priorities.',
  },
  {
    question: 'Can I use Algoryx without connecting my broker?',
    answer: 'Yes, you can use Algoryx with manual trade entry if you prefer not to connect your broker. While automatic journaling requires broker connection, you can still access many of our features by manually entering your trade data.',
  },
  {
    question: 'Is Algoryx free to use?',
    answer: 'Algoryx offers both free and premium plans. Our free plan includes basic features and limited analysis. Premium plans unlock advanced AI insights, unlimited trade history, detailed analytics, and priority support. Check our pricing page for detailed information about our plans.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-12 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            {/* Title and Subtitle */}
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Quick answers to help you understand how Algoryx fits into your trading journey.
              </p>
            </div>

            {/* FAQ Container */}
            <div className="relative">
              <div className="bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 rounded-xl p-5 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-slate-300/50 dark:border-slate-700/50 last:border-b-0"
                    >
                      <AccordionTrigger className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 text-left py-3 text-sm md:text-base font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Footer Call to Action */}
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Still have questions?{' '}
                <a
                  href="#work-with-labs"
                  className="text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                >
                  Contact Us
                  <span className="text-blue-600 dark:text-cyan-400">→</span>
                </a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

