import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { messageAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Car, User, LogOut, LayoutDashboard, Bell } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
            // Poll for new messages every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await messageAPI.getUnreadCount();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <Car className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">VehicleMarket</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/vehicles">
                        <Button variant="ghost">Browse Vehicles</Button>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="ghost">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>

                            {/* Messages Bell Icon */}
                            <Link to="/messages" className="relative">
                                <Button variant="ghost" size="icon">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                                <Link to="/admin">
                                    <Button variant="ghost">Admin Panel</Button>
                                </Link>
                            )}

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => logout()}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
