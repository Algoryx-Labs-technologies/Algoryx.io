import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { CheckCircle2 } from 'lucide-react';

interface WaitlistConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

export function WaitlistConfirmation({
  open,
  onOpenChange,
  email,
}: WaitlistConfirmationProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            Thank You!
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base">
            You've successfully joined the waitlist.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 space-y-4">
          {email && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Confirmation sent to:</p>
              <p className="text-sm text-white font-medium">{email}</p>
            </div>
          )}
          
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <p className="text-sm text-gray-300 leading-relaxed">
              We'll notify you as soon as our courses are available. Get ready for exclusive early access and special discounts!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

