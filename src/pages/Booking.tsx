import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Users,
  Bed,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Form states
  const [checkIn, setCheckIn] = useState(searchParams.get('checkin') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkout') || '');
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 1);
  const [selectedRoom, setSelectedRoom] = useState(searchParams.get('room') || '');
  
  // Guest information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Calculated values
  const [nights, setNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const rooms = [
    { id: '1', name: 'Standard Room', price: 35000 },
    { id: '2', name: 'Deluxe Room', price: 45000 },
    { id: '3', name: 'Executive Suite', price: 75000 },
    { id: '4', name: 'Family Room', price: 65000 },
    { id: '5', name: 'Presidential Suite', price: 120000 },
    { id: '6', name: 'Business Room', price: 55000 }
  ];

  const selectedRoomData = rooms.find(room => room.id === selectedRoom);

  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
      
      if (selectedRoomData) {
        const subtotal = selectedRoomData.price * diffDays;
        const tax = subtotal * 0.075; // 7.5% VAT
        const serviceCharge = subtotal * 0.05; // 5% service charge
        setTotalAmount(subtotal + tax + serviceCharge);
      }
    }
  }, [checkIn, checkOut, selectedRoom, selectedRoomData]);

  const handlePayment = async () => {
    if (!firstName || !lastName || !email || !phone || !checkIn || !checkOut || !selectedRoom) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      // Here you would integrate with Paystack
      // For demo, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Booking Confirmed!",
        description: "Your reservation has been successfully created. Check your email for confirmation.",
        variant: "default"
      });
      
      // Reset form or redirect to confirmation page
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Complete Your Booking</h1>
          <p className="text-lg text-muted-foreground">Secure your perfect stay at Dugbe Stays</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stay Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Stay Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="checkin">Check-in Date</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Check-out Date</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guests.toString()} onValueChange={(value) => setGuests(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Guest{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="room">Room Type</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} - ₦{room.price.toLocaleString()}/night
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requests or preferences..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card (Paystack)</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                    <SelectItem value="payonhotel">Pay at Hotel</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <a href="#" className="text-primary hover:underline">terms and conditions</a> and <a href="#" className="text-primary hover:underline">privacy policy</a>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRoomData && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{selectedRoomData.name}</span>
                      <Badge variant="secondary">Selected</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{checkIn || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{checkOut || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span>{guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights:</span>
                        <span>{nights}</span>
                      </div>
                    </div>
                    
                    <hr className="border-border" />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Room rate ({nights} nights):</span>
                        <span>₦{(selectedRoomData.price * nights).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (7.5%):</span>
                        <span>₦{((selectedRoomData.price * nights) * 0.075).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service charge (5%):</span>
                        <span>₦{((selectedRoomData.price * nights) * 0.05).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <hr className="border-border" />
                    
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>₦{totalAmount.toLocaleString()}</span>
                    </div>
                    
                    <Button 
                      variant="booking" 
                      size="lg" 
                      className="w-full"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Complete Booking
                        </>
                      )}
                    </Button>
                    
                    <div className="text-xs text-muted-foreground text-center">
                      <p className="flex items-center justify-center mb-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Secure payment powered by Paystack
                      </p>
                      <p className="flex items-center justify-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Free cancellation up to 24 hours before check-in
                      </p>
                    </div>
                  </>
                )}
                
                {!selectedRoomData && (
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Please select your stay details to see pricing</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Contact Support */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>+234 802 123 4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>reservations@dugbestays.com</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;