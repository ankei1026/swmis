import UserProfileSection from '@/Pages/Components/UserProfileSectionAdmin';
import { Link } from '@inertiajs/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { forwardRef } from 'react';
import { mainMenu, secondaryMenu } from '../menuItems';
import { DrawerStyled } from './Drawer.styles';
import { DrawerHeader } from './DrawerHeader';

const InertiaLinkAdapter = forwardRef<HTMLAnchorElement, any>(({ href, ...props }, ref) => <Link href={href} {...props} ref={ref} />);
InertiaLinkAdapter.displayName = 'InertiaLinkAdapter';

interface DrawerProps {
    open: boolean;
    onClose: () => void;
}

export const Drawer = ({ open, onClose }: DrawerProps) => {
    const theme = useTheme();
    const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>({});

    const handleToggle = (text: string) => {
        setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
    };

    const renderMenu = (items: { text: string; icon: React.ReactNode; href?: string; children?: any[] }[], nested = false) =>
        items.map(({ text, icon, href, children }) => (
            <React.Fragment key={text}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        component={href && !children ? InertiaLinkAdapter : 'button'}
                        href={href && !children ? href : undefined}
                        onClick={children ? () => handleToggle(text) : undefined}
                        sx={{
                            width: '100%',
                            minHeight: 48,
                            pl: nested ? 4 : 2.5,
                            justifyContent: open ? 'initial' : 'center',
                            '&:hover': {
                                backgroundColor: '#4caf50',
                                color: '#fff',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                        {children &&
                            (openMenus[text] ? <ExpandLess sx={{ opacity: open ? 1 : 0 }} /> : <ExpandMore sx={{ opacity: open ? 1 : 0 }} />)}
                    </ListItemButton>
                </ListItem>

                {children && (
                    <Collapse in={openMenus[text]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {renderMenu(children, true)} {/* 👈 recursive render for nested items */}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        ));

    return (
        <DrawerStyled variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={onClose}>{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
            </DrawerHeader>
            <Divider />
            <List>{renderMenu(mainMenu)}</List>
            <Divider />
            <List>{renderMenu(secondaryMenu)}</List>
            <Divider sx={{ mt: 'auto' }} />
            <UserProfileSection open={open} />
        </DrawerStyled>
    );
};
