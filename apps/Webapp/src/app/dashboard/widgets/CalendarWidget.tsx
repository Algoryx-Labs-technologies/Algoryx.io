import { useState } from 'react';
import { Calendar } from '../../components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../components/ui/utils';

export function CalendarWidget({ shouldShine = false }: { shouldShine?: boolean }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <Card className={cn("group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col shine-effect", shouldShine && "active")}>
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-3xl font-semibold font-hero text-white flex items-center gap-1">
          <CalendarIcon className="h-5 w-5 text-blue-400" />
          Calendar
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          {selectedDate ? (
            <>Selected: {format(selectedDate, "PPP")}</>
          ) : (
            <>No date selected</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden flex items-center justify-center">
        <div className="scale-75">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border-0 bg-transparent text-white"
            classNames={{
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "bg-blue-500/20 text-blue-300 font-bold",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

