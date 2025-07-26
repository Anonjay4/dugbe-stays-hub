import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  Star,
  Camera,
  Car,
  Utensils,
  TreePine,
  Building,
  ShoppingBag,
  Music,
  Mountain,
  Waves
} from 'lucide-react';

const Attractions = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const attractions = [
    {
      id: 1,
      name: 'Cocoa House',
      category: 'landmark',
      distance: '2.5 km',
      duration: '15 mins drive',
      rating: 4.3,
      image: '/api/placeholder/400/250',
      description: 'Historic skyscraper and iconic landmark of Ibadan, offering panoramic city views.',
      type: 'Historical',
      openHours: '9:00 AM - 6:00 PM',
      entryFee: 'Free',
      highlights: ['City Views', 'Architecture', 'Photography']
    },
    {
      id: 2,
      name: 'Dugbe Market',
      category: 'shopping',
      distance: '0.8 km',
      duration: '5 mins walk',
      rating: 4.1,
      image: '/api/placeholder/400/250',
      description: 'Vibrant local market perfect for experiencing authentic Nigerian culture and shopping.',
      type: 'Market',
      openHours: '7:00 AM - 8:00 PM',
      entryFee: 'Free',
      highlights: ['Local Crafts', 'Traditional Food', 'Cultural Experience']
    },
    {
      id: 3,
      name: 'National Theatre Ibadan',
      category: 'entertainment',
      distance: '3.2 km',
      duration: '12 mins drive',
      rating: 4.5,
      image: '/api/placeholder/400/250',
      description: 'Premier cultural venue showcasing Nigerian arts, theater, and performances.',
      type: 'Cultural',
      openHours: 'Varies by show',
      entryFee: '₦2,000 - ₦15,000',
      highlights: ['Live Performances', 'Art Exhibitions', 'Cultural Shows']
    },
    {
      id: 4,
      name: 'University of Ibadan',
      category: 'educational',
      distance: '8.5 km',
      duration: '25 mins drive',
      rating: 4.7,
      image: '/api/placeholder/400/250',
      description: 'Nigeria\'s premier university with beautiful campus and historical significance.',
      type: 'Educational',
      openHours: '8:00 AM - 6:00 PM',
      entryFee: 'Free (Campus tours)',
      highlights: ['Campus Tour', 'Zoological Garden', 'Museum']
    },
    {
      id: 5,
      name: 'Agodi Gardens',
      category: 'nature',
      distance: '6.2 km',
      duration: '20 mins drive',
      rating: 4.4,
      image: '/api/placeholder/400/250',
      description: 'Beautiful botanical garden and recreational park perfect for relaxation.',
      type: 'Recreation',
      openHours: '8:00 AM - 6:00 PM',
      entryFee: '₦500',
      highlights: ['Nature Walks', 'Picnic Areas', 'Swimming Pool']
    },
    {
      id: 6,
      name: 'Palms Shopping Mall',
      category: 'shopping',
      distance: '12 km',
      duration: '30 mins drive',
      rating: 4.6,
      image: '/api/placeholder/400/250',
      description: 'Modern shopping mall with international brands, restaurants, and cinema.',
      type: 'Shopping',
      openHours: '10:00 AM - 10:00 PM',
      entryFee: 'Free',
      highlights: ['International Brands', 'Cinema', 'Food Court']
    },
    {
      id: 7,
      name: 'Mapo Hall',
      category: 'landmark',
      distance: '4.1 km',
      duration: '18 mins drive',
      rating: 4.2,
      image: '/api/placeholder/400/250',
      description: 'Historic town hall and important cultural landmark in Ibadan.',
      type: 'Historical',
      openHours: '9:00 AM - 5:00 PM',
      entryFee: 'Free',
      highlights: ['Historical Architecture', 'City Center', 'Cultural Events']
    },
    {
      id: 8,
      name: 'Eleyele Lake',
      category: 'nature',
      distance: '15 km',
      duration: '35 mins drive',
      rating: 4.0,
      image: '/api/placeholder/400/250',
      description: 'Serene lake perfect for boat rides and enjoying nature.',
      type: 'Nature',
      openHours: '7:00 AM - 7:00 PM',
      entryFee: '₦1,000',
      highlights: ['Boat Rides', 'Fishing', 'Nature Photography']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Attractions', icon: MapPin },
    { id: 'landmark', label: 'Landmarks', icon: Building },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'entertainment', label: 'Entertainment', icon: Music },
    { id: 'educational', label: 'Educational', icon: Building },
    { id: 'nature', label: 'Nature', icon: TreePine }
  ];

  const filteredAttractions = selectedCategory === 'all' 
    ? attractions 
    : attractions.filter(attraction => attraction.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'landmark': return Building;
      case 'shopping': return ShoppingBag;
      case 'entertainment': return Music;
      case 'educational': return Building;
      case 'nature': return TreePine;
      default: return MapPin;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Ibadan</h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing attractions near Dugbe Stays Hotel
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "hero" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction, index) => {
            const CategoryIcon = getCategoryIcon(attraction.category);
            return (
              <Card 
                key={attraction.id} 
                className="overflow-hidden group hover:shadow-elegant transition-all duration-300 animate-scale-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-nature flex items-center justify-center">
                    <Camera className="h-12 w-12 text-secondary-foreground/60" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      {attraction.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-background/90 text-foreground px-2 py-1 rounded">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{attraction.rating}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold">{attraction.name}</h3>
                    <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {attraction.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{attraction.distance} • {attraction.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{attraction.openHours}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Entry:</span>
                      <span className="text-primary font-medium">{attraction.entryFee}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {attraction.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    <Button variant="elegant" size="sm" className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Travel Tips */}
        <div className="mt-16">
          <Card className="bg-gradient-nature text-secondary-foreground">
            <CardHeader>
              <CardTitle className="text-white">Travel Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-white/90">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <Car className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Transportation</h4>
                    <p className="text-sm">Our concierge can arrange transportation to all attractions. Taxi and ride-sharing services are readily available.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Best Times</h4>
                    <p className="text-sm">Visit outdoor attractions early morning or late afternoon. Markets are most vibrant in the morning hours.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Camera className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">What to Bring</h4>
                    <p className="text-sm">Comfortable walking shoes, sunscreen, camera, and local currency for markets and street vendors.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Attractions;