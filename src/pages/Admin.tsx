import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  Users, 
  Bed, 
  Calendar, 
  Mail, 
  BarChart3,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalRooms: 0,
    occupancyRate: 0
  });
  
  const [loadingData, setLoadingData] = useState(true);

  // Redirect if not admin
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles (first_name, last_name),
          rooms (name, room_type)
        `)
        .order('created_at', { ascending: false });

      // Fetch rooms
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .order('name');

      // Fetch contact messages
      const { data: contactsData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setBookings(bookingsData || []);
      setRooms(roomsData || []);
      setContacts(contactsData || []);
      setUsers(usersData || []);

      // Calculate stats
      const totalBookings = bookingsData?.length || 0;
      const totalRevenue = bookingsData?.reduce((sum, booking) => 
        sum + (booking.total_amount || 0), 0) || 0;
      const totalRooms = roomsData?.length || 0;
      const occupiedRooms = bookingsData?.filter(booking => 
        booking.status === 'confirmed' && 
        new Date(booking.check_in_date) <= new Date() &&
        new Date(booking.check_out_date) >= new Date()
      ).length || 0;
      const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

      setStats({
        totalBookings,
        totalRevenue,
        totalRooms,
        occupancyRate
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));

      toast({
        title: "Success",
        description: `Booking status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const updateContactStatus = async (contactId, status) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', contactId);

      if (error) throw error;

      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, status } : contact
      ));

      toast({
        title: "Success",
        description: `Contact message marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'new':
        return 'bg-primary text-primary-foreground';
      case 'replied':
        return 'bg-info text-info-foreground';
      case 'resolved':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bed className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold">{stats.totalRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Manage Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{booking.rooms?.name}</h3>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Guest:</span>
                                <br />
                                {booking.profiles?.first_name} {booking.profiles?.last_name}
                              </div>
                              <div>
                                <span className="font-medium">Check-in:</span>
                                <br />
                                {new Date(booking.check_in_date).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Check-out:</span>
                                <br />
                                {new Date(booking.check_out_date).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Guests:</span>
                                <br />
                                {booking.guests}
                              </div>
                              <div>
                                <span className="font-medium">Total:</span>
                                <br />
                                ₦{booking.total_amount?.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Rooms</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <Card key={room.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{room.name}</h3>
                          <Badge variant={room.is_available ? "default" : "secondary"}>
                            {room.is_available ? "Available" : "Occupied"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize mb-2">
                          {room.room_type} Room
                        </p>
                        <p className="text-lg font-bold text-primary mb-3">
                          ₦{room.price_per_night?.toLocaleString()}/night
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <Card key={contact.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{contact.name}</h3>
                              <Badge className={getStatusColor(contact.status)}>
                                {contact.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {contact.email} • {contact.phone}
                            </p>
                            <p className="font-medium mb-2">{contact.subject}</p>
                            <p className="text-sm text-muted-foreground">{contact.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(contact.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {contact.status === 'new' && (
                              <Button
                                size="sm"
                                onClick={() => updateContactStatus(contact.id, 'replied')}
                              >
                                Mark Replied
                              </Button>
                            )}
                            {contact.status === 'replied' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateContactStatus(contact.id, 'resolved')}
                              >
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {user.first_name} {user.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {user.phone} • {user.nationality}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Joined: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;