import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar,
  AlertCircle,
  History,
  Grid3x3,
  CalendarDays
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';

interface Payment {
  id: string;
  projectId?: string;
  projectTitle?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'failed';
  dueDate?: string;
  paidDate?: string;
  description?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  createdAt: string;
}

export function PaymentsPage() {
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  // Mock data for upcoming payments
  const upcomingPayments: Payment[] = [
    {
      id: '1',
      projectId: 'proj1',
      projectTitle: 'E-Commerce Platform',
      amount: 5000,
      currency: 'USD',
      status: 'pending',
      dueDate: '2024-12-05',
      description: 'Milestone 2 Payment - Development Phase',
      invoiceNumber: 'INV-2024-001',
      createdAt: '2024-11-15T09:00:00Z',
    },
    {
      id: '2',
      projectId: 'proj2',
      projectTitle: 'Mobile App Development',
      amount: 3000,
      currency: 'USD',
      status: 'pending',
      dueDate: '2024-12-15',
      description: 'Initial Payment - Project Kickoff',
      invoiceNumber: 'INV-2024-002',
      createdAt: '2024-11-10T10:00:00Z',
    },
    {
      id: '3',
      projectId: 'proj3',
      projectTitle: 'Data Analytics Dashboard',
      amount: 2500,
      currency: 'USD',
      status: 'overdue',
      dueDate: '2024-11-20',
      description: 'Milestone 1 Payment - Design Phase',
      invoiceNumber: 'INV-2024-003',
      createdAt: '2024-11-01T08:00:00Z',
    },
    {
      id: '4',
      projectId: 'proj4',
      projectTitle: 'API Integration Service',
      amount: 1500,
      currency: 'USD',
      status: 'pending',
      dueDate: '2024-12-20',
      description: 'Final Payment - Project Completion',
      invoiceNumber: 'INV-2024-004',
      createdAt: '2024-11-05T11:00:00Z',
    },
  ];

  // Mock data for payment history
  const paymentHistory: Payment[] = [
    {
      id: '5',
      projectId: 'proj1',
      projectTitle: 'E-Commerce Platform',
      amount: 5000,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-11-01',
      paidDate: '2024-11-01',
      description: 'Milestone 1 Payment - Planning Phase',
      invoiceNumber: 'INV-2024-005',
      paymentMethod: 'Credit Card',
      createdAt: '2024-10-15T09:00:00Z',
    },
    {
      id: '6',
      projectId: 'proj2',
      projectTitle: 'Mobile App Development',
      amount: 2000,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-10-20',
      paidDate: '2024-10-19',
      description: 'Initial Deposit',
      invoiceNumber: 'INV-2024-006',
      paymentMethod: 'Bank Transfer',
      createdAt: '2024-10-10T10:00:00Z',
    },
    {
      id: '7',
      projectId: 'proj3',
      projectTitle: 'Data Analytics Dashboard',
      amount: 3000,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-10-15',
      paidDate: '2024-10-14',
      description: 'Project Kickoff Payment',
      invoiceNumber: 'INV-2024-007',
      paymentMethod: 'Credit Card',
      createdAt: '2024-10-01T08:00:00Z',
    },
    {
      id: '8',
      projectId: 'proj1',
      projectTitle: 'E-Commerce Platform',
      amount: 4500,
      currency: 'USD',
      status: 'failed',
      dueDate: '2024-09-25',
      description: 'Milestone 1 Payment - Attempt Failed',
      invoiceNumber: 'INV-2024-008',
      paymentMethod: 'Credit Card',
      createdAt: '2024-09-20T09:00:00Z',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'failed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePayNow = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentGateway(false);
    setSelectedPayment(null);
    // TODO: Update payment status via API
    // Refresh the payments list
  };

  const totalUpcoming = upcomingPayments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = paymentHistory
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const payments = activeTab === 'upcoming' ? upcomingPayments : paymentHistory;

  // Group payments by date for calendar view
  const paymentsByDate = useMemo(() => {
    const grouped: Record<string, Payment[]> = {};
    payments.forEach((payment) => {
      const dateKey = payment.dueDate || payment.paidDate;
      if (dateKey) {
        const date = format(parseISO(dateKey), 'yyyy-MM-dd');
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(payment);
      }
    });
    return grouped;
  }, [payments]);

  // Get dates with payments for calendar marking
  const datesWithPayments = useMemo(() => {
    return Object.keys(paymentsByDate).map(date => parseISO(date));
  }, [paymentsByDate]);

  // Get payments for selected date
  const selectedDatePayments = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return paymentsByDate[dateKey] || [];
  }, [selectedDate, paymentsByDate]);


  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
        isCollapsed ? "ml-20" : "ml-80"
      )}>
        {/* Background gradient effects - matching dashboard theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        <div className="h-full overflow-y-auto relative z-10">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                Payments
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-footer">
                Manage your payments and view payment history
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400 font-footer mb-1">Upcoming Payments</p>
                      <p className="text-2xl font-bold font-hero text-white">
                        ${totalUpcoming.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-footer">
                    {upcomingPayments.filter(p => p.status === 'pending' || p.status === 'overdue').length} payments pending
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400 font-footer mb-1">Total Paid</p>
                      <p className="text-2xl font-bold font-hero text-white">
                        ${totalPaid.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-footer">
                    {paymentHistory.filter(p => p.status === 'paid').length} completed payments
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400 font-footer mb-1">Overdue</p>
                      <p className="text-2xl font-bold font-hero text-white">
                        ${upcomingPayments
                          .filter(p => p.status === 'overdue')
                          .reduce((sum, p) => sum + p.amount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-footer">
                    {upcomingPayments.filter(p => p.status === 'overdue').length} overdue payments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs and View Toggle */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-footer text-base transition-all duration-200",
                    activeTab === 'upcoming'
                      ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-2 border-blue-500/50 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-800/50 border-2 border-white/10 text-gray-400 hover:text-white hover:bg-slate-800/70"
                  )}
                >
                  <Clock className="h-5 w-5" />
                  <span>Upcoming Payments</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-footer text-base transition-all duration-200",
                    activeTab === 'history'
                      ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-2 border-blue-500/50 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-800/50 border-2 border-white/10 text-gray-400 hover:text-white hover:bg-slate-800/70"
                  )}
                >
                  <History className="h-5 w-5" />
                  <span>Payment History</span>
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-slate-800/50 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md font-footer text-sm transition-all duration-200",
                    viewMode === 'calendar'
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md font-footer text-sm transition-all duration-200",
                    viewMode === 'list'
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <Grid3x3 className="h-4 w-4" />
                  <span>List</span>
                </button>
              </div>
            </div>

            {/* Calendar or List View */}
            {viewMode === 'calendar' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Widget */}
                <div className="lg:col-span-2">
                  <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-hero text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        Payment Calendar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        className="rounded-lg border-0 bg-transparent"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-base font-semibold text-white font-hero",
                          nav: "space-x-1 flex items-center",
                          nav_button: cn(
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-white/10 rounded-md"
                          ),
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-gray-400 rounded-md w-9 font-normal text-sm font-footer",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-500/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: cn(
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-white/10 rounded-md text-white font-footer"
                          ),
                          day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                          day_today: "bg-blue-500/20 text-blue-400 font-semibold",
                          day_outside: "text-gray-500 opacity-50",
                          day_disabled: "text-gray-500 opacity-50",
                          day_range_middle: "aria-selected:bg-blue-500/20 aria-selected:text-white",
                          day_hidden: "invisible",
                        }}
                        modifiers={{
                          hasPayments: datesWithPayments,
                        }}
                        modifiersClassNames={{
                          hasPayments: "relative",
                        }}
                      />
                      
                      {/* Legend */}
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400 font-footer mb-3">Legend:</p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs text-gray-400 font-footer">Overdue</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-xs text-gray-400 font-footer">Pending</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-gray-400 font-footer">Paid</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span className="text-xs text-gray-400 font-footer">Failed</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Selected Date Payments Panel */}
                <div className="lg:col-span-1">
                  <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 sticky top-8">
                    <CardHeader>
                      <CardTitle className="text-lg font-hero text-white flex items-center gap-2">
                        {selectedDate ? (
                          <>
                            <Calendar className="h-4 w-4 text-blue-400" />
                            Payments for {format(selectedDate, 'MMM d, yyyy')}
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 text-gray-400" />
                            Select a Date
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!selectedDate ? (
                        <p className="text-sm text-gray-400 font-footer text-center py-8">
                          Click on a date in the calendar to view payments
                        </p>
                      ) : selectedDatePayments.length === 0 ? (
                        <p className="text-sm text-gray-400 font-footer text-center py-8">
                          No payments for this date
                        </p>
                      ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                          {selectedDatePayments.map((payment) => {
                            const daysUntilDue = getDaysUntilDue(payment.dueDate);
                            const isPayable = (payment.status === 'pending' || payment.status === 'overdue') && activeTab === 'upcoming';

                            return (
                              <div
                                key={payment.id}
                                className="p-4 bg-slate-800/50 rounded-lg border border-white/10 hover:border-blue-500/50 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="text-base font-semibold font-hero text-white mb-1">
                                      {payment.projectTitle || 'Payment'}
                                    </h4>
                                    <p className="text-xs text-gray-400 font-footer mb-2">
                                      {payment.invoiceNumber}
                                    </p>
                                    <div className="flex items-center gap-2 mb-2">
                                      {getStatusIcon(payment.status)}
                                      <span className={cn(
                                        "text-xs font-footer px-2 py-0.5 rounded border",
                                        getStatusColor(payment.status)
                                      )}>
                                        {payment.status.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold font-hero text-white">
                                      ${payment.amount.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                {payment.description && (
                                  <p className="text-xs text-gray-400 font-footer mb-2 line-clamp-2">
                                    {payment.description}
                                  </p>
                                )}
                                {daysUntilDue !== null && activeTab === 'upcoming' && (
                                  <p className={cn(
                                    "text-xs font-footer mb-2",
                                    daysUntilDue < 0
                                      ? "text-red-400"
                                      : daysUntilDue <= 7
                                      ? "text-yellow-400"
                                      : "text-green-400"
                                  )}>
                                    {daysUntilDue < 0
                                      ? `${Math.abs(daysUntilDue)} days overdue`
                                      : `${daysUntilDue} days remaining`}
                                  </p>
                                )}
                                {isPayable && (
                                  <Button
                                    onClick={() => handlePayNow(payment)}
                                    className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-footer font-semibold py-2 text-xs"
                                  >
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    Pay Now
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              /* List View */
              activeTab === 'upcoming' ? (
                /* Upcoming Payments - 3 Cards per Row */
                <div>
                  {upcomingPayments.length === 0 ? (
                    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                      <CardContent className="p-12 text-center">
                        <CreditCard className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold font-hero text-white mb-2">
                          No Upcoming Payments Found
                        </h3>
                        <p className="text-gray-400 font-footer">
                          You have no upcoming payments
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {upcomingPayments.map((payment) => {
                        const daysUntilDue = getDaysUntilDue(payment.dueDate);
                        const isPayable = payment.status === 'pending' || payment.status === 'overdue';

                        return (
                          <Card
                            key={payment.id}
                            className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden flex flex-col"
                          >
                            <CardContent className="p-4 flex flex-col flex-1">
                              {/* Header with Status */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1.5">
                                    {getStatusIcon(payment.status)}
                                    <span className={cn(
                                      "text-xs font-footer px-2 py-0.5 rounded-full border font-semibold",
                                      getStatusColor(payment.status)
                                    )}>
                                      {payment.status.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <h3 className="text-lg font-bold font-hero text-white mb-1.5 leading-tight">
                                  {payment.projectTitle || 'Payment'}
                                </h3>
                                {payment.invoiceNumber && (
                                  <p className="text-xs text-gray-400 font-footer mb-1.5">
                                    Invoice: <span className="text-gray-300 font-medium">{payment.invoiceNumber}</span>
                                  </p>
                                )}
                              </div>

                              {/* Amount */}
                              <div className="mb-3">
                                <p className="text-xs text-gray-500 font-footer mb-0.5">Amount</p>
                                <p className="text-2xl font-bold font-hero text-white">
                                  ${payment.amount.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400 font-footer mt-0.5">
                                  {payment.currency}
                                </p>
                              </div>

                              {/* Description */}
                              {payment.description && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-400 font-footer leading-relaxed line-clamp-2">
                                    {payment.description}
                                  </p>
                                </div>
                              )}

                              {/* Due Date Info */}
                              {payment.dueDate && (
                                <div className="mb-3 pt-3 border-t border-white/10">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-blue-400" />
                                    <p className="text-xs text-gray-400 font-footer">Due Date</p>
                                  </div>
                                  <p className="text-sm text-white font-footer font-semibold mb-1.5">
                                    {formatDate(payment.dueDate)}
                                  </p>
                                  {daysUntilDue !== null && (
                                    <p className={cn(
                                      "text-xs font-footer font-semibold",
                                      daysUntilDue < 0
                                        ? "text-red-400"
                                        : daysUntilDue <= 7
                                        ? "text-yellow-400"
                                        : "text-green-400"
                                    )}>
                                      {daysUntilDue < 0
                                        ? `${Math.abs(daysUntilDue)} days overdue`
                                        : `${daysUntilDue} days remaining`}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Pay Now Button */}
                              {isPayable && (
                                <div className="mt-auto pt-3 border-t border-white/10">
                                  <Button
                                    onClick={() => handlePayNow(payment)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-footer font-semibold py-2 text-sm"
                                  >
                                    <CreditCard className="h-4 w-4 mr-1.5" />
                                    Pay Now
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Payment History - Vertical List */
                <div className="space-y-4">
                  {paymentHistory.length === 0 ? (
                    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                      <CardContent className="p-12 text-center">
                        <CreditCard className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold font-hero text-white mb-2">
                          No Payment History Found
                        </h3>
                        <p className="text-gray-400 font-footer">
                          No payment history available
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    paymentHistory.map((payment) => {
                      return (
                        <Card
                          key={payment.id}
                          className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <CreditCard className="h-5 w-5 text-blue-400" />
                                  <h3 className="text-xl font-semibold font-hero text-white">
                                    {payment.projectTitle || 'Payment'}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(payment.status)}
                                    <span className={cn(
                                      "text-sm font-footer px-3 py-1 rounded border",
                                      getStatusColor(payment.status)
                                    )}>
                                      {payment.status.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                {payment.description && (
                                  <p className="text-base text-gray-300 font-footer mb-2">
                                    {payment.description}
                                  </p>
                                )}
                                {payment.invoiceNumber && (
                                  <p className="text-sm text-gray-500 font-footer">
                                    Invoice: {payment.invoiceNumber}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold font-hero text-white mb-1">
                                  ${payment.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-400 font-footer">
                                  {payment.currency}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                              {payment.dueDate && (
                                <div>
                                  <p className="text-xs text-gray-500 font-footer mb-1">Due Date</p>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <p className="text-sm text-white font-footer font-medium">
                                      {formatDate(payment.dueDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {payment.paidDate && (
                                <div>
                                  <p className="text-xs text-gray-500 font-footer mb-1">Paid Date</p>
                                  <div className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                                    <p className="text-sm text-white font-footer font-medium">
                                      {formatDate(payment.paidDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {payment.paymentMethod && (
                                <div>
                                  <p className="text-xs text-gray-500 font-footer mb-1">Payment Method</p>
                                  <p className="text-sm text-white font-footer font-medium">
                                    {payment.paymentMethod}
                                  </p>
                                </div>
                              )}
                              {payment.projectId && (
                                <div>
                                  <p className="text-xs text-gray-500 font-footer mb-1">Project ID</p>
                                  <p className="text-sm text-gray-400 font-footer">
                                    {payment.projectId}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Payment Gateway Modal */}
        {showPaymentGateway && selectedPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold font-hero text-white flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-blue-400" />
                    Payment Gateway
                  </CardTitle>
                  <button
                    onClick={() => {
                      setShowPaymentGateway(false);
                      setSelectedPayment(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Payment Summary */}
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400 font-footer">Project</p>
                    <p className="text-base text-white font-footer font-semibold">
                      {selectedPayment.projectTitle || 'Payment'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400 font-footer">Invoice Number</p>
                    <p className="text-base text-white font-footer font-semibold">
                      {selectedPayment.invoiceNumber}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <p className="text-lg text-gray-300 font-footer font-semibold">Total Amount</p>
                    <p className="text-2xl font-bold font-hero text-white">
                      ${selectedPayment.amount.toLocaleString()} {selectedPayment.currency}
                    </p>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 font-footer mb-2 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 font-footer focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 font-footer mb-2 block">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 font-footer focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-footer mb-2 block">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 font-footer focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 font-footer mb-2 block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 font-footer focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveCard"
                      className="w-4 h-4 rounded border-white/10 bg-slate-800/50 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="saveCard" className="text-sm text-gray-400 font-footer">
                      Save card for future payments
                    </label>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                  <Button
                    onClick={() => {
                      setShowPaymentGateway(false);
                      setSelectedPayment(null);
                    }}
                    variant="outline"
                    className="flex-1 bg-slate-800/50 border-white/10 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePaymentSuccess}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-footer font-semibold"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ${selectedPayment.amount.toLocaleString()}
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-300 font-footer">
                      Your payment is secured with 256-bit SSL encryption. We never store your card details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

