CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.workspace_credits (user_id, total_credits)
  VALUES (NEW.id, 5); -- Give 5 free credits on sign up (DOWN FROM 50)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
