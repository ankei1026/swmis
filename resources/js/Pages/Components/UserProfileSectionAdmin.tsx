// resources/js/Components/UserProfileSection.tsx
import { useForm, usePage } from '@inertiajs/react';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';

interface UserProfileSectionProps {
    open: boolean; // whether drawer is expanded
    onLogout?: () => void; // optional override logout behavior
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ open, onLogout }) => {
    const { get } = useForm();
    const page = usePage();

    // ✅ Use actual user data from Inertia shared props if available
    const user = (page.props as any)?.auth?.user || {
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: 'https://i.pravatar.cc/100?img=12',
    };

    const handleLogout = () => {
            if (onLogout) {
                onLogout();
            } else {
                router.post(route('logout'), {}, {
                    onSuccess: () => {
                        toast.success('Logged out successfully!');
                    },
                    onError: () => {
                        toast.error('Failed to logout. Please try again.');
                    },
                });
            }
        };
    

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                flexDirection: open ? 'row' : 'column',
                justifyContent: open ? 'space-between' : 'center',
                textAlign: open ? 'left' : 'center',
            }}
        >
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40, mb: open ? 0 : 1 }} />
            {open && (
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 100 }} color="text.secondary">
                        {user.email}
                    </Typography>
                </Box>
            )}
            <IconButton color="error" onClick={handleLogout} sx={{ ml: open ? 1 : 0, mt: open ? 0 : 1 }}>
                <LogoutIcon />
            </IconButton>
        </Box>
    );
};

export default UserProfileSection;
