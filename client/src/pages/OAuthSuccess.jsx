import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from '@/features/authSlice';
import { API_BASE } from '@/config/api';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      try {
  const r = await fetch(`${API_BASE}/api/v1/user/profile`, { credentials: 'include' });
        if (r.ok) {
          const j = await r.json();
          if (j?.user) {
            dispatch(userLoggedIn({ user: j.user }));
          }
        }
      } catch(_) {}
      navigate('/');
    };
    load();
  }, [dispatch, navigate]);
  return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Finishing sign in...</p></div>;
}