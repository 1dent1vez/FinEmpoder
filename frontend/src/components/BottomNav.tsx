import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { School, Search, EmojiEvents, Person } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const items = [
  { label: 'Lecciones', icon: <School />, path: '/app' },
  { label: 'Buscar',    icon: <Search />, path: '/search' },
  { label: 'Logros',    icon: <EmojiEvents />, path: '/achievements' },
  { label: 'Perfil',    icon: <Person />, path: '/profile' },
];

export default function BottomNav() {
  const nav = useNavigate();
  const loc = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const idx = Math.max(0, items.findIndex(i => loc.pathname.startsWith(i.path)));
    setValue(idx);
  }, [loc.pathname]);

  return (
    <Paper elevation={8} sx={{ position: 'fixed', left: 0, right: 0, bottom: 0 }}>
      <BottomNavigation
        value={value}
        onChange={(_, v) => nav(items[v].path)}
        sx={{ '& .Mui-selected': { color: '#6C7AE0' } }} // pastel que combina con naranja
        showLabels
      >
        {items.map(i => <BottomNavigationAction key={i.path} label={i.label} icon={i.icon} />)}
      </BottomNavigation>
    </Paper>
  );
}
