// routes.ts
import {
    ThermometerSun,
    Settings,
    User,
    Frame,
    Settings2,
    Tractor
  } from 'lucide-react';
  
  export const ROUTES = {
    HOME: {
      id: 'home',
      title: 'My Farms',
      icon: Tractor,
      url: '/dashboard',
      items: [
      ],
    },
    TOOLS: {
      id: 'tools',
      title: 'Tools',
      icon: ThermometerSun,
      url: '/dashboard/tools',
      items: [
        { id: 'tools.new', title: 'New', url: '#', roles: [] },
        // { id: 'tools.all', title: 'All Tools', url: '#', roles: [] },
      ],
    },
    MANAGE: {
      id: 'manage',
      title: 'Manage',
      icon: Frame,
      url: '#',
      items: [
      ],
    },
    USER: {
      id: 'user',
      title: 'User',
      icon: User,
      url: '#',
      items: [
        
      ],
    },
    SETTINGS: {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      url: '#',
      items: [
        { id: 'settings.account', title: 'Profile', url: '/account_settings', roles: [] },
      ],
    },
  };
  