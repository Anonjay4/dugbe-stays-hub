-- Add loyalty points to profiles table
ALTER TABLE public.profiles ADD COLUMN loyalty_points INTEGER DEFAULT 0;

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