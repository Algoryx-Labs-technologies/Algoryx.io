import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { MessageSquare, CheckCircle2, XCircle, Loader2, Clock, AlertCircle, CheckCircle, X, Edit2, Save } from 'lucide-react';
import { getAuthToken } from '../action-center/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

interface TicketReply {
  id: string;
  ticketId: string;
  reply: string;
  userId: string | null;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
}

interface SupportTicket {
  uid: string;
  ticketId: string;
  userId: string | null;
  clientId: string | null;
  partnerId: string | null;
  issueType: string;
  description: string;
  priority: 'low' | 'mid' | 'high';
  additionalDetails: string | null;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  userName: string | null;
  email: string | null;
  updated_at: string;
  created_at: string;
  User: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  Client: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null;
  Partner: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null;
  TicketReply: TicketReply[];
}

export function SupportTicketsPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: 'pending' as 'pending' | 'in_progress' | 'resolved' | 'closed',
    priority: 'low' as 'low' | 'mid' | 'high',
  });

  const [ticketReplyForm, setTicketReplyForm] = useState({
    ticketId: '',
    reply: '',
    status: 'in_progress',
  });

  const resetForm = () => {
    setTicketReplyForm({ ticketId: '', reply: '', status: 'in_progress' });
  };

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setEditForm({
      status: ticket.status,
      priority: ticket.priority,
    });
    setIsDetailModalOpen(true);
    setIsEditing(false);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    setLoading('Update Ticket');
    setMessage(null);

    try {
      const token = await getAuthToken();
      
      // Ensure priority and status are always sent
      const updateData = {
        status: editForm.status,
        priority: editForm.priority,
      };

      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/support-tickets/${selectedTicket.uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update ticket');
      }

      if (result.success) {
        setMessage({ type: 'success', text: 'Ticket updated successfully' });
        setIsEditing(false);
        // Update selected ticket with new data
        if (result.data) {
          setSelectedTicket(result.data);
          // Also update editForm to match the new ticket data
          setEditForm({
            status: result.data.status,
            priority: result.data.priority,
          });
        }
        fetchTickets(); // Refresh tickets list
      }
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update ticket' });
    } finally {
      setLoading(null);
    }
  };

  // Fetch support tickets
  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/support-tickets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch support tickets');
      }

      if (result.success && result.data) {
        setTickets(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching support tickets:', error);
      setMessage({ type: 'error', text: 'Failed to fetch support tickets' });
    } finally {
      setLoadingTickets(false);
    }
  };

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'mid':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        isCollapsed ? "md:ml-20" : "md:ml-80"
      )}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-hero">Support Tickets</h1>
              <p className="text-gray-400 mt-1 font-footer">View and manage support tickets</p>
            </div>
            <Button
              onClick={fetchTickets}
              disabled={loadingTickets}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              {loadingTickets ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Refresh'
              )}
            </Button>
          </div>

          {message && (
            <div className={cn(
              "p-4 rounded-lg flex items-center gap-2",
              message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'
            )}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Support Tickets List */}
          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                All Support Tickets ({tickets.length})
              </CardTitle>
              <CardDescription>View and manage all support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTickets ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No support tickets found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => {
                    const user = ticket.User || ticket.Client?.User || ticket.Partner?.User;
                    const userName = user
                      ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
                      : ticket.userName || ticket.email || 'Unknown User';

                    return (
                      <div
                        key={ticket.uid}
                        onClick={() => handleTicketClick(ticket)}
                        className="bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-mono text-sm font-semibold text-blue-400">
                                #{ticket.ticketId}
                              </span>
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-medium border flex items-center gap-1",
                                getStatusColor(ticket.status)
                              )}>
                                {getStatusIcon(ticket.status)}
                                {ticket.status.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-medium border",
                                getPriorityColor(ticket.priority)
                              )}>
                                {ticket.priority.toUpperCase()} PRIORITY
                              </span>
                            </div>
                            <h3 className="text-white font-semibold mb-1">{ticket.issueType}</h3>
                            <p className="text-gray-400 text-sm mb-2">{ticket.description}</p>
                            {ticket.additionalDetails && (
                              <p className="text-gray-500 text-xs mb-2">{ticket.additionalDetails}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 border-t border-white/10 pt-3 mt-3">
                          <div className="flex items-center gap-4">
                            <span>User: <span className="text-white">{userName}</span></span>
                            {user?.email && (
                              <span>Email: <span className="text-white">{user.email}</span></span>
                            )}
                            <span>
                              Created: <span className="text-white">
                                {new Date(ticket.created_at).toLocaleDateString()}
                              </span>
                            </span>
                          </div>
                          {ticket.TicketReply && ticket.TicketReply.length > 0 && (
                            <span className="text-blue-400">
                              {ticket.TicketReply.length} {ticket.TicketReply.length === 1 ? 'reply' : 'replies'}
                            </span>
                          )}
                        </div>
                        {ticket.TicketReply && ticket.TicketReply.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs text-gray-500 mb-2">Recent Replies:</p>
                            <div className="space-y-2">
                              {ticket.TicketReply.slice(0, 2).map((reply: TicketReply) => (
                                <div key={reply.id} className="bg-slate-900/50 rounded p-2 text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={cn(
                                      "text-xs px-2 py-0.5 rounded",
                                      reply.isAdmin ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"
                                    )}>
                                      {reply.isAdmin ? 'Admin' : 'User'}
                                    </span>
                                    <span className="text-gray-500">
                                      {new Date(reply.created_at).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-300">{reply.reply}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Detail Modal */}
          {isDetailModalOpen && selectedTicket && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-slate-900/95 z-10 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-400" />
                        Ticket #{selectedTicket.ticketId}
                      </CardTitle>
                      <CardDescription>Support Ticket Details</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <Button
                          onClick={() => {
                            // Re-initialize edit form with current ticket values
                            if (selectedTicket) {
                              setEditForm({
                                status: selectedTicket.status,
                                priority: selectedTicket.priority,
                              });
                            }
                            setIsEditing(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <Button
                          onClick={handleUpdateTicket}
                          disabled={loading === 'Update Ticket'}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading === 'Update Ticket' ? 'Saving...' : 'Save'}
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setIsDetailModalOpen(false);
                          setSelectedTicket(null);
                          setIsEditing(false);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 mt-4">
                  {/* Status and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Status</Label>
                      {isEditing ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as 'pending' | 'in_progress' | 'resolved' | 'closed';
                            setEditForm({ ...editForm, status: newStatus });
                          }}
                          className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      ) : (
                        <span className={cn(
                          "px-3 py-2 rounded text-sm font-medium border inline-flex items-center gap-2",
                          getStatusColor(selectedTicket.status)
                        )}>
                          {getStatusIcon(selectedTicket.status)}
                          {selectedTicket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Priority</Label>
                      {isEditing ? (
                        <select
                          value={editForm.priority}
                          onChange={(e) => {
                            const newPriority = e.target.value as 'low' | 'mid' | 'high';
                            setEditForm({ ...editForm, priority: newPriority });
                          }}
                          className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2"
                        >
                          <option value="low">Low</option>
                          <option value="mid">Mid</option>
                          <option value="high">High</option>
                        </select>
                      ) : (
                        <span className={cn(
                          "px-3 py-2 rounded text-sm font-medium border inline-block",
                          getPriorityColor(selectedTicket.priority)
                        )}>
                          {selectedTicket.priority.toUpperCase()} PRIORITY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Issue Type */}
                  <div>
                    <Label className="text-gray-300 mb-2 block">Issue Type</Label>
                    <p className="text-white font-semibold">{selectedTicket.issueType}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-gray-300 mb-2 block">Description</Label>
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>

                  {/* Additional Details */}
                  {selectedTicket.additionalDetails && (
                    <div>
                      <Label className="text-gray-300 mb-2 block">Additional Details</Label>
                      <p className="text-gray-400 text-sm whitespace-pre-wrap">{selectedTicket.additionalDetails}</p>
                    </div>
                  )}

                  {/* User Information */}
                  <div className="border-t border-white/10 pt-4">
                    <Label className="text-gray-300 mb-3 block">User Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white ml-2">
                          {(() => {
                            const user = selectedTicket.User || selectedTicket.Client?.User || selectedTicket.Partner?.User;
                            return user
                              ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
                              : selectedTicket.userName || selectedTicket.email || 'Unknown User';
                          })()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white ml-2">
                          {(selectedTicket.User || selectedTicket.Client?.User || selectedTicket.Partner?.User)?.email || selectedTicket.email || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white ml-2">
                          {new Date(selectedTicket.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white ml-2">
                          {new Date(selectedTicket.updated_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {selectedTicket.TicketReply && selectedTicket.TicketReply.length > 0 && (
                    <div className="border-t border-white/10 pt-4">
                      <Label className="text-gray-300 mb-3 block">
                        Replies ({selectedTicket.TicketReply.length})
                      </Label>
                      <div className="space-y-3">
                        {selectedTicket.TicketReply.map((reply: TicketReply) => (
                          <div key={reply.id} className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className={cn(
                                "text-xs px-2 py-1 rounded font-medium",
                                reply.isAdmin ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"
                              )}>
                                {reply.isAdmin ? 'Admin' : 'User'}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {new Date(reply.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{reply.reply}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="border-t border-white/10 pt-4">
                    <Label className="text-gray-300 mb-3 block">Add Reply</Label>
                    <div className="space-y-4">
                      <textarea
                        value={ticketReplyForm.reply}
                        onChange={(e) => setTicketReplyForm({ ...ticketReplyForm, reply: e.target.value })}
                        className="w-full min-h-[120px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2"
                        placeholder="Enter your reply"
                      />
                      <div>
                        <Label className="text-gray-300 mb-2 block">Update Status (Optional)</Label>
                        <select
                          value={ticketReplyForm.status}
                          onChange={(e) => setTicketReplyForm({ ...ticketReplyForm, status: e.target.value })}
                          className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <Button
                        onClick={async () => {
                          setLoading('Reply to Ticket');
                          setMessage(null);
                          try {
                            const token = await getAuthToken();
                            const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/support-tickets/${selectedTicket.uid}/reply`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                reply: ticketReplyForm.reply,
                                status: ticketReplyForm.status,
                              }),
                            });

                            const result = await response.json();

                            if (!response.ok) {
                              throw new Error(result.message || 'Failed to send reply');
                            }

                            setMessage({ type: 'success', text: 'Reply sent successfully' });
                            resetForm();
                            // Refresh tickets and update selected ticket
                            await fetchTickets();
                            // Fetch updated ticket details
                            const updatedResponse = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/support-tickets`, {
                              method: 'GET',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                              },
                            });
                            const updatedResult = await updatedResponse.json();
                            if (updatedResult.success && updatedResult.data) {
                              const updatedTicket = updatedResult.data.find((t: SupportTicket) => t.uid === selectedTicket.uid);
                              if (updatedTicket) {
                                setSelectedTicket(updatedTicket);
                              }
                            }
                          } catch (error: any) {
                            setMessage({ type: 'error', text: error.message || 'Failed to send reply' });
                          } finally {
                            setLoading(null);
                          }
                        }}
                        disabled={loading === 'Reply to Ticket' || !ticketReplyForm.reply}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                      >
                        {loading === 'Reply to Ticket' ? 'Replying...' : 'Send Reply'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
