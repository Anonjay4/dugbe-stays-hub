-- Create hotel management database schema

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  nationality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  description TEXT,
  price_per_night INTEGER NOT NULL,
  original_price INTEGER,
  capacity INTEGER NOT NULL DEFAULT 2,
  size_sqm INTEGER,
  beds TEXT,
  bathrooms INTEGER DEFAULT 1,
  amenities TEXT[],
  images TEXT[],
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_reference TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  room_id UUID NOT NULL REFERENCES public.rooms(id),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin', -- admin, manager, staff
  permissions TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create email notifications table
CREATE TABLE public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- booking_confirmation, payment_receipt, reminder, etc.
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- new, replied, resolved
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS Policies for rooms (public read)
CREATE POLICY "Anyone can view rooms" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify rooms" ON public.rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Create RLS Policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Create RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND user_id = auth.uid() AND status = 'completed'
    )
  );

-- Create RLS Policies for admin users
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Create RLS Policies for email notifications
CREATE POLICY "Users can view own notifications" ON public.email_notifications
  FOR SELECT USING (
    recipient_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Create RLS Policies for contact messages
CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample rooms data
INSERT INTO public.rooms (name, room_type, description, price_per_night, original_price, capacity, size_sqm, beds, bathrooms, amenities, images) VALUES
('Standard Room', 'standard', 'Comfortable standard room with modern amenities and city view.', 35000, 40000, 2, 25, '1 Queen Bed', 1, 
 ARRAY['Free WiFi', 'Air Conditioning', 'TV', 'Room Service'], 
 ARRAY['/room-deluxe.jpg']),
 
('Deluxe Room', 'deluxe', 'Spacious deluxe room with premium furnishing and garden view.', 45000, NULL, 3, 35, '1 King Bed', 1,
 ARRAY['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Balcony'],
 ARRAY['/restaurant.jpg']),
 
('Executive Suite', 'suite', 'Elegant suite with separate living area and premium amenities.', 75000, 85000, 4, 50, '1 King Bed + Sofa Bed', 2,
 ARRAY['Free WiFi', 'Smart TV', 'Kitchenette', 'Living Area', 'Work Desk', 'Premium Amenities'],
 ARRAY['/hotel-hero.jpg']),
 
('Family Room', 'family', 'Perfect for families with connecting rooms and child-friendly amenities.', 65000, NULL, 6, 45, '2 Queen Beds', 2,
 ARRAY['Free WiFi', 'Air Conditioning', 'TV', 'Connecting Rooms', 'Family Amenities'],
 ARRAY['/room-deluxe.jpg']),
 
('Presidential Suite', 'presidential', 'Ultimate luxury with butler service and panoramic city views.', 120000, 140000, 6, 80, '1 King Bed + Living Area', 3,
 ARRAY['Free WiFi', 'Smart TV', 'Butler Service', 'Jacuzzi', 'Private Balcony', 'Premium Bar'],
 ARRAY['/restaurant.jpg']),
 
('Business Room', 'business', 'Designed for business travelers with dedicated workspace.', 55000, NULL, 2, 30, '1 Queen Bed', 1,
 ARRAY['Free WiFi', 'Work Desk', 'Smart TV', 'Coffee Machine', 'Business Amenities'],
 ARRAY['/hotel-hero.jpg']);