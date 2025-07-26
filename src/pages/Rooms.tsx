import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wifi,
  Tv,
  Coffee,
  Car,
  Dumbbell,
  Shield,
  Star,
  Users,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Filter
} from 'lucide-react';
import roomDeluxe from '@/assets/room-deluxe.jpg';
import restaurant from '@/assets/restaurant.jpg';
import hotelHero from '@/assets/hotel-hero.jpg';

const Rooms = () => {
  const [priceRange, setPriceRange] = useState('all');
  const [roomType, setRoomType] = useState('all');
  const [sortBy, setSortBy] = useState('price');

  const rooms = [
    {
      id: 1,
      name: 'Standard Room',
      type: 'standard',
      price: 35000,
      originalPrice: 40000,
      image: roomDeluxe,
      capacity: 2,
      size: '25 m²',
      beds: '1 Queen Bed',
      bathrooms: 1,
      rating: 4.5,
      reviews: 128,
      discount: '12% OFF',
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Room Service'],
      description: 'Comfortable standard room with modern amenities and city view.'
    },
    {
      id: 2,
      name: 'Deluxe Room',
      type: 'deluxe',
      price: 45000,
      originalPrice: null,
      image: restaurant,
      capacity: 3,
      size: '35 m²',
      beds: '1 King Bed',
      bathrooms: 1,
      rating: 4.7,
      reviews: 89,
      discount: null,
      amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Balcony'],
      description: 'Spacious deluxe room with premium furnishing and garden view.'
    },
    {
      id: 3,
      name: 'Executive Suite',
      type: 'suite',
      price: 75000,
      originalPrice: 85000,
      image: hotelHero,
      capacity: 4,
      size: '50 m²',
      beds: '1 King Bed + Sofa Bed',
      bathrooms: 2,
      rating: 4.9,
      reviews: 156,
      discount: 'POPULAR',
      amenities: ['Free WiFi', 'Smart TV', 'Kitchenette', 'Living Area', 'Work Desk', 'Premium Amenities'],
      description: 'Elegant suite with separate living area and premium amenities.'
    },
    {
      id: 4,
      name: 'Family Room',
      type: 'family',
      price: 65000,
      originalPrice: null,
      image: roomDeluxe,
      capacity: 6,
      size: '45 m²',
      beds: '2 Queen Beds',
      bathrooms: 2,
      rating: 4.6,
      reviews: 74,
      discount: null,
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Connecting Rooms', 'Family Amenities'],
      description: 'Perfect for families with connecting rooms and child-friendly amenities.'
    },
    {
      id: 5,
      name: 'Presidential Suite',
      type: 'presidential',
      price: 120000,
      originalPrice: 140000,
      image: restaurant,
      capacity: 6,
      size: '80 m²',
      beds: '1 King Bed + Living Area',
      bathrooms: 3,
      rating: 5.0,
      reviews: 45,
      discount: 'LUXURY',
      amenities: ['Free WiFi', 'Smart TV', 'Butler Service', 'Jacuzzi', 'Private Balcony', 'Premium Bar'],
      description: 'Ultimate luxury with butler service and panoramic city views.'
    },
    {
      id: 6,
      name: 'Business Room',
      type: 'business',
      price: 55000,
      originalPrice: null,
      image: hotelHero,
      capacity: 2,
      size: '30 m²',
      beds: '1 Queen Bed',
      bathrooms: 1,
      rating: 4.4,
      reviews: 92,
      discount: null,
      amenities: ['Free WiFi', 'Work Desk', 'Smart TV', 'Coffee Machine', 'Business Amenities'],
      description: 'Designed for business travelers with dedicated workspace.'
    }
  ];

  const filteredRooms = rooms
    .filter(room => {
      if (priceRange === 'all') return true;
      if (priceRange === 'budget' && room.price <= 40000) return true;
      if (priceRange === 'mid' && room.price > 40000 && room.price <= 70000) return true;
      if (priceRange === 'luxury' && room.price > 70000) return true;
      return false;
    })
    .filter(room => roomType === 'all' || room.type === roomType)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'capacity') return b.capacity - a.capacity;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background pt-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Rooms & Suites</h1>
          <p className="text-lg text-muted-foreground">Find the perfect accommodation for your stay</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter & Sort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="priceRange">Price Range</Label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">Under ₦40,000</SelectItem>
                    <SelectItem value="mid">₦40,000 - ₦70,000</SelectItem>
                    <SelectItem value="luxury">Above ₦70,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="presidential">Presidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="capacity">Capacity (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPriceRange('all');
                    setRoomType('all');
                    setSortBy('price');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Room Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRooms.map((room, index) => (
            <Card key={room.id} className="overflow-hidden group hover:shadow-elegant transition-all duration-300 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-2/5 relative overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {room.discount && (
                      <Badge variant="secondary" className={`${
                        room.discount === 'POPULAR' ? 'bg-primary text-primary-foreground' :
                        room.discount === 'LUXURY' ? 'bg-accent text-accent-foreground' :
                        'bg-success text-success-foreground'
                      }`}>
                        {room.discount}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-black/70 text-white px-2 py-1 rounded">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{room.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-3/5 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">{room.name}</h3>
                    <div className="text-right">
                      {room.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">₦{room.originalPrice.toLocaleString()}</p>
                      )}
                      <p className="text-2xl font-bold text-primary">₦{room.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">per night</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{room.description}</p>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{room.capacity} guests</span>
                    </div>
                    <div className="flex items-center">
                      <Maximize className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{room.size}</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{room.beds}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{room.bathrooms} bathroom{room.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 4).map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{room.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="flex items-center mb-4 text-sm text-muted-foreground">
                    <span>{room.reviews} reviews</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link to={`/rooms/${room.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/booking?room=${room.id}`} className="flex-1">
                      <Button variant="booking" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
            <Button 
              variant="hero"
              onClick={() => {
                setPriceRange('all');
                setRoomType('all');
                setSortBy('price');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;