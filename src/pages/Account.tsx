import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Loader2, 
  Edit3,
  Save,
  X,
  History,
  Star
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Account = () => {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  
  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');

  // Redirect to auth if not logged in
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setDateOfBirth(profile.date_of_birth || '');
      setNationality(profile.nationality || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            id,
            name,
            room_type,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    const updates = {
      first_name: firstName,
      last_name: lastName,
      phone,
      date_of_birth: dateOfBirth || null,
      nationality,
    };

    const { error } = await updateProfile(updates);
    
    if (!error) {
      setIsEditing(false);
    }
    
    setIsSaving(false);
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
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      case 'refunded':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <Button 
            variant="outline" 
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Points</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter nationality"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Points Tab */}
          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-primary" />
                  Loyalty Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {profile?.loyalty_points || 0}
                    </div>
                    <p className="text-muted-foreground">Points Available</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-semibold text-success">
                        ₦{((profile?.loyalty_points || 0) * 10).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Reward Value</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-semibold text-primary">
                        {Math.floor((profile?.loyalty_points || 0) / 100)}
                      </div>
                      <p className="text-sm text-muted-foreground">Free Nights Earned</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-semibold text-warning">
                        {100 - ((profile?.loyalty_points || 0) % 100)}
                      </div>
                      <p className="text-sm text-muted-foreground">Points to Next Reward</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">How to Earn Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Stay & Earn</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn 1 point for every ₦1,000 spent on completed bookings
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Redeem Rewards</h4>
                      <p className="text-sm text-muted-foreground">
                        100 points = 1 free night (up to ₦50,000 value)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Membership Tiers</h3>
                  <div className="space-y-2">
                    <div className={`p-3 rounded-lg border ${(profile?.loyalty_points || 0) >= 1000 ? 'bg-primary/10 border-primary' : 'bg-muted/50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Gold Member</span>
                        <span className="text-sm text-muted-foreground">1,000+ points</span>
                      </div>
                      <p className="text-sm text-muted-foreground">15% discount on all bookings</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${(profile?.loyalty_points || 0) >= 500 ? 'bg-secondary/10 border-secondary' : 'bg-muted/50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Silver Member</span>
                        <span className="text-sm text-muted-foreground">500+ points</span>
                      </div>
                      <p className="text-sm text-muted-foreground">10% discount on all bookings</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${(profile?.loyalty_points || 0) >= 100 ? 'bg-accent/10 border-accent' : 'bg-muted/50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Bronze Member</span>
                        <span className="text-sm text-muted-foreground">100+ points</span>
                      </div>
                      <p className="text-sm text-muted-foreground">5% discount on all bookings</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  My Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingBookings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{booking.rooms?.name}</h3>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                                <Badge className={getPaymentStatusColor(booking.payment_status)}>
                                  {booking.payment_status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
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
                              {booking.special_requests && (
                                <div className="mt-2">
                                  <span className="font-medium text-sm">Special Requests:</span>
                                  <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              {booking.payment_reference && (
                                <p className="text-xs text-muted-foreground">
                                  Ref: {booking.payment_reference}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Booked: {new Date(booking.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;