import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { User } from 'lucide-react';

export function ProfileWidget() {
  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="px-3 pt-3 pb-1.5 flex-shrink-0">
        <CardTitle className="text-base font-semibold font-hero text-white flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-blue-400" />
          Profile
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          Your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3 flex-1 flex flex-col justify-center">
        <div className="space-y-2">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-1.5">
              <User className="h-7 w-7 text-white" />
            </div>
            <p className="text-sm text-white font-footer font-semibold">John Doe</p>
            <p className="text-xs text-gray-400 font-footer">john.doe@company.com</p>
          </div>
          <div className="space-y-1 pt-1.5 border-t border-white/10">
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

