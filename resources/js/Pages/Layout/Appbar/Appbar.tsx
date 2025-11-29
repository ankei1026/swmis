import { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton, AppBar as MuiAppBar, Toolbar, Typography, Badge, Menu, MenuItem, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { drawerWidth } from '../Drawer/Drawer.styles';
import axios from 'axios';

interface AppBarProps {
    open: boolean;
    onOpen: () => void;
    title?: string;
}

interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
        url?: string;
    };
    read_at: string | null;
    created_at: string;
}

const StyledAppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin']),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    }),
}));

const AppBar = ({ open, onOpen, title }: AppBarProps) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        fetchNotificationCount();
        fetchNotifications();
    }, []);

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get('/notifications/count');
            setNotificationCount(response.data.count);
        } catch (error) {
            console.error('Error fetching notification count:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        fetchNotifications(); // Refresh notifications when opening
        fetchNotificationCount(); // Refresh count when opening
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async () => {
        try {
            await axios.post('/notifications/mark-as-read');
            setNotificationCount(0);
            setNotifications(prev =>
                prev.map(notification => ({
                    ...notification,
                    read_at: new Date().toISOString()
                }))
            );
            handleClose();
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const handleNotificationItemClick = (notification: Notification) => {
        if (notification.data.url) {
            window.location.href = notification.data.url;
        }
        handleClose();
    };

    return (
        <StyledAppBar color="inherit" position="fixed" open={open} elevation={0} className="border-b">
            <Toolbar>
                <IconButton
                    color="default"
                    aria-label="open drawer"
                    onClick={onOpen}
                    edge="start"
                    sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    {title}  <span className="font-bold text-green-600">Solid Waste Management Information System</span>
                </Typography>

                {/* Notification Icon */}
                <IconButton
                    color="default"
                    aria-label="notifications"
                    onClick={handleNotificationClick}
                >
                    <Badge badgeContent={notificationCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: 400,
                            width: 350,
                        },
                    }}
                >
                    <Box px={2} py={1} borderBottom={1} borderColor="divider">
                        <Typography variant="h6">Notifications</Typography>
                    </Box>
                    {notifications.length > 0 && (
                        <MenuItem onClick={handleMarkAsRead} sx={{ justifyContent: 'center' }}>
                            <Typography variant="body2" color="primary">
                                Mark all as read
                            </Typography>
                        </MenuItem>
                    )}
                    {notifications.length === 0 ? (
                        <MenuItem disabled>No notifications</MenuItem>
                    ) : (
                        notifications.map((notification) => (
                            <MenuItem
                                key={notification.id}
                                onClick={() => handleNotificationItemClick(notification)}
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    backgroundColor: notification.read_at ? 'transparent' : 'action.hover',
                                    whiteSpace: 'normal',
                                    py: 1.5
                                }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {notification.data.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {notification.data.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        {notification.created_at}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))
                    )}

                </Menu>
            </Toolbar>
        </StyledAppBar>
    );
};

export default AppBar;