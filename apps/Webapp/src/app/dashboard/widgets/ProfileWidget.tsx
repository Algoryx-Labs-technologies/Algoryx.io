import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { User } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function ProfileWidget() {
  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="px-4 pt-4 pb-2 flex-shrink-0">
        <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
          <User className="h-4 w-4 text-blue-400" />
          Profile
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-1">
          Your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-2">
              <User className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm text-white font-footer font-semibold">John Doe</p>
            <p className="text-xs text-gray-400 font-footer">john.doe@company.com</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-footer">Name</span>
              <span className="text-xs text-white font-footer">John Doe</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-footer">Email</span>
              <span className="text-xs text-white font-footer truncate ml-2">john.doe@company.com</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

