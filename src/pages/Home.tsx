import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Shield,
  Star,
  MapPin,
  Cloud,
  Sun,
  Users,
  Bed,
  Clock
} from 'lucide-react';
import hotelHero from '@/assets/hotel-hero.jpg';
import roomDeluxe from '@/assets/room-deluxe.jpg';
import restaurant from '@/assets/restaurant.jpg';
import axios from 'axios';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
}

const Home = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  // Mock weather data (you can replace with actual OpenWeather API key)
  useEffect(() => {
    // For now, setting mock data for Dugbe, Ibadan
    setWeather({
      main: { temp: 28, feels_like: 30, humidity: 65 },
      weather: [{ main: 'Clear', description: 'sunny' }],
      name: 'Dugbe, Ibadan'
    });
  }, []);

  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Car, label: 'Parking' },
    { icon: Coffee, label: 'Restaurant' },
    { icon: Dumbbell, label: 'Fitness Center' },
    { icon: Shield, label: '24/7 Security' },
  ];

  const roomTypes = [
    {
      id: 1,
      name: 'Deluxe Room',
      price: '₦45,000',
      image: roomDeluxe,
      features: ['King Size Bed', 'City View', 'Free WiFi', 'Air Conditioning']
    },
    {
      id: 2,
      name: 'Executive Suite',
      price: '₦75,000',
      image: restaurant,
      features: ['Separate Living Area', 'Balcony', 'Kitchenette', 'Premium Amenities']
    },
    {
      id: 3,
      name: 'Presidential Suite',
      price: '₦120,000',
      image: hotelHero,
      features: ['Luxury Furnishing', 'Panoramic View', 'Private Butler', 'Jacuzzi']
    }
  ];

  const handleQuickBooking = () => {
    if (checkIn && checkOut && guests) {
      // Navigate to booking page with parameters
      window.location.href = `/booking?checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={hotelHero} 
            alt="Dugbe Stays Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-sunset">Dugbe Stays</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-90">
            Experience luxury and comfort in the heart of Ibadan, Nigeria
          </p>
          
          {/* Weather Widget */}
          {weather && (
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-lg px-6 py-3 mb-8 animate-scale-in">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="mr-4">{weather.name}</span>
              <Sun className="h-5 w-5 mr-2" />
              <span>{weather.main.temp}°C</span>
              <span className="ml-2 capitalize">{weather.weather[0].description}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/rooms">
              <Button variant="hero" size="xl" className="animate-glow">
                <Bed className="h-5 w-5 mr-2" />
                Explore Rooms
              </Button>
            </Link>
            <Link to="/booking">
              <Button variant="elegant" size="xl">
                <Calendar className="h-5 w-5 mr-2" />
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Booking Widget */}
      <section className="py-12 bg-card/50">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="shadow-luxury border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Quick Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="booking" 
                    size="lg" 
                    className="w-full"
                    onClick={handleQuickBooking}
                  >
                    Check Availability
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Rooms & Suites</h2>
            <p className="text-lg text-muted-foreground">Comfort and luxury in every detail</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roomTypes.map((room, index) => (
              <Card key={room.id} className="overflow-hidden group hover:shadow-elegant transition-all duration-300 animate-scale-in" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="relative overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {room.price}/night
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{room.name}</h3>
                  <ul className="space-y-2 mb-4">
                    {room.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 mr-2 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/rooms/${room.id}`}>
                    <Button variant="elegant" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Hotel Amenities</h2>
            <p className="text-lg text-muted-foreground">Everything you need for a perfect stay</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {amenities.map((amenity, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-soft transition-all duration-300 group">
                <div className="bg-gradient-hero p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <amenity.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-medium">{amenity.label}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-sunset text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for an Unforgettable Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your stay today and discover the finest hospitality in Ibadan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button variant="hero" size="xl" className="bg-white text-primary hover:bg-white/90">
                <Calendar className="h-5 w-5 mr-2" />
                Reserve Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="elegant" size="xl" className="border-white text-white hover:bg-white hover:text-primary">
                <Clock className="h-5 w-5 mr-2" />
                Call Us: +234 802 123 4567
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;