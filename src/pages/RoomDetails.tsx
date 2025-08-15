import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  Users, 
  Bed, 
  Bath, 
  Maximize, 
  Star, 
  Calendar, 
  Wifi,
  Tv,
  Coffee,
  Car,
  Shield,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
      fetchRoomReviews();
    }
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setRoom(data);
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast({
        title: "Error",
        description: "Failed to load room details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('room_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <Wifi className="h-4 w-4" />;
    }
    if (amenityLower.includes('tv') || amenityLower.includes('television')) {
      return <Tv className="h-4 w-4" />;
    }
    if (amenityLower.includes('coffee') || amenityLower.includes('bar')) {
      return <Coffee className="h-4 w-4" />;
    }
    if (amenityLower.includes('parking') || amenityLower.includes('car')) {
      return <Car className="h-4 w-4" />;
    }
    if (amenityLower.includes('security') || amenityLower.includes('safe')) {
      return <Shield className="h-4 w-4" />;
    }
    return <Star className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
          <Link to="/rooms">
            <Button variant="hero">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/rooms">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{room.name}</h1>
            <p className="text-muted-foreground capitalize">{room.room_type} Room</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={room.images?.[0] || '/room-deluxe.jpg'} 
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    ₦{room.price_per_night?.toLocaleString()}/night
                  </Badge>
                </div>
                {room.rating > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-black/70 text-white px-3 py-1 rounded">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span className="font-medium">{room.rating}</span>
                      <span className="text-sm ml-1">({room.review_count})</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Room</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {room.description}
                </p>
              </CardContent>
            </Card>

            {/* Room Details */}
            <Card>
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">{room.capacity} guests</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Maximize className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Size</p>
                      <p className="text-sm text-muted-foreground">{room.size_sqm} m²</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Beds</p>
                      <p className="text-sm text-muted-foreground">{room.beds}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Bathrooms</p>
                      <p className="text-sm text-muted-foreground">{room.bathrooms}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to review this room!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium">
                                {review.profiles?.first_name?.[0] || 'G'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {review.profiles?.first_name} {review.profiles?.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">Book This Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {room.original_price && (
                    <p className="text-sm text-muted-foreground line-through">
                      ₦{room.original_price.toLocaleString()}
                    </p>
                  )}
                  <p className="text-3xl font-bold text-primary">
                    ₦{room.price_per_night?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">per night</p>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span className="capitalize font-medium">{room.room_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Guests:</span>
                    <span className="font-medium">{room.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Availability:</span>
                    <Badge variant={room.is_available ? "default" : "secondary"}>
                      {room.is_available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Link to={`/booking?room=${room.id}`} className="block">
                    <Button 
                      variant="booking" 
                      className="w-full"
                      disabled={!room.is_available}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {room.is_available ? 'Book Now' : 'Not Available'}
                    </Button>
                  </Link>

                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full">
                      Contact for Info
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Free cancellation up to 24 hours before check-in
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;