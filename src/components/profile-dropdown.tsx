import React from 'react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Settings, LogOut, User } from 'lucide-react';

interface ProfileDropdownProps {
  userInfo: {
    name: string;
    email: string;
  };
  onSettingsClick: () => void;
  onLogout: () => void;
}

export function ProfileDropdown({ userInfo, onSettingsClick, onLogout }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar className="w-10 h-10 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInfo.name}`} 
              alt={userInfo.name} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
              {userInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 glass border-0 shadow-xl"
        sideOffset={8}
      >
        {/* User Info Section */}
        <div className="flex items-center gap-3 p-3 border-b border-border/50">
          <Avatar className="w-8 h-8">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInfo.name}`} 
              alt={userInfo.name} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
              {userInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userInfo.name}</p>
            <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <DropdownMenuItem 
            onClick={onSettingsClick}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-1 bg-border/50" />
          
          <DropdownMenuItem 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}