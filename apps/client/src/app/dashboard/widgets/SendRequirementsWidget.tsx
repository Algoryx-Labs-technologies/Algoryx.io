import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Send } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function SendRequirementsWidget() {
  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/60 hover:to-slate-800/50 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-400" />
          Send Requirements
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-sm mt-1">
          Submit your project requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
            <p className="text-sm text-gray-300 font-footer mb-3">
              Need something built? Send us your requirements and we'll get back to you.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Create New Requirement
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-footer font-medium">Recent Submissions:</p>
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-800/30 border border-white/5">
                <p className="text-xs text-white font-footer">API Integration Project</p>
                <p className="text-xs text-gray-500 font-footer">Submitted 2 days ago</p>
              </div>
              <div className="p-2 rounded bg-slate-800/30 border border-white/5">
                <p className="text-xs text-white font-footer">Dashboard Redesign</p>
                <p className="text-xs text-gray-500 font-footer">Submitted 1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

