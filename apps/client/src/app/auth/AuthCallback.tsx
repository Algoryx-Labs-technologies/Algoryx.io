import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/api';
import { LoadingPage } from '../components/Loading';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically handles the OAuth callback and extracts the session from URL
        // We need to get the session after the redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          navigate('/auth?error=authentication_failed');
          return;
        }

        if (session?.user) {
          // Set the session in Supabase client
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });

          // Call /auth/me which will automatically create the user in our database if they don't exist
          // The backend getCurrentUser endpoint handles OAuth user creation automatically
          try {
            const userResponse = await apiClient.get('/auth/me');
            
            if (!userResponse.success) {
              console.warn('Failed to sync user with database:', userResponse.error);
              // Continue anyway - user can still use the app
            }
          } catch (error) {
            console.error('Error syncing user with database:', error);
            // Continue anyway - user might already exist or we'll handle it later
          }

          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          navigate('/auth?error=no_session');
        }
      } catch (error) {
        console.error('Callback error:', error);
        navigate('/auth?error=authentication_failed');
      }
    };

    handleCallback();
  }, [navigate]);

  return <LoadingPage message="Completing authentication..." />;
}

