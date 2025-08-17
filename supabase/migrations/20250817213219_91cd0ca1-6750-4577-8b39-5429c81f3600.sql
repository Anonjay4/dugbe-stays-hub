-- Add loyalty points to profiles table
ALTER TABLE public.profiles ADD COLUMN loyalty_points INTEGER DEFAULT 0;

-- Create an admin user (you'll need to sign up with this email first)
-- Replace 'admin@hotel.com' with your actual email
INSERT INTO public.admin_users (user_id, role, permissions) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@hotel.com' LIMIT 1),
  'admin',
  ARRAY['manage_bookings', 'manage_rooms', 'manage_users', 'view_analytics']
) ON CONFLICT (user_id) DO NOTHING;

-- Function to award loyalty points for completed bookings
CREATE OR REPLACE FUNCTION public.award_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award 1 point per ₦1000 spent when booking is completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.profiles 
    SET loyalty_points = loyalty_points + (NEW.total_amount / 1000)
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger to award points when bookings are completed
CREATE TRIGGER award_loyalty_points_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.award_loyalty_points();