import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { ScrollReveal } from './ScrollReveal';
import { FAQ_DATA } from '../../data/faqData';

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
                Quick answers about Algoryx Labs, Algoryx Tech, and Algoryx Prime on Algoryx.io.
              </p>
            </div>

            {/* FAQ Container */}
            <div className="relative">
              <div className="bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 rounded-xl p-5 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {FAQ_DATA.map((faq, index) => (
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

