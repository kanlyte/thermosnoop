// routes.ts
import {
    SquareTerminal,
    Bot,
    PartyPopper,
    Frame,
    Settings2,
    BookOpen,
    LifeBuoy,
    Send,
  } from 'lucide-react';
  
  export const ROUTES = {
    HOME: {
      id: 'home',
      title: 'My Farms',
      icon: SquareTerminal,
      url: '/dashboard',
      items: [
      ],
    },
    TOOLS: {
      id: 'tools',
      title: 'Tools',
      icon: PartyPopper,
      url: '#',
      items: [
        // { id: 'tools.new', title: 'New', url: '#', roles: [] },
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
      icon: Bot,
      url: '#',
      items: [
        
      ],
    },
    SETTINGS: {
      id: 'settings',
      title: 'Settings',
      icon: Settings2,
      url: '#',
      items: [
        { id: 'settings.account', title: 'Profile', url: '/account_settings', roles: [] },
      ],
    },
  };
  