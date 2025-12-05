import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import AppBar from './Appbar/Appbar';
import { DrawerHeader } from './Drawer/DrawerHeader';
import { DrawerDriver } from './Drawer/DrawerDriver';

interface LayoutDriverProps {
    children: React.ReactNode;
    title?: string;
}
const LayoutDriver = ({ title, children }: LayoutDriverProps) => {
    const [open, setOpen] = React.useState(true);

    return (
        <Box sx={{ display: 'flex' }}>
            <meta name="csrf-token" content={document.querySelector('meta[name="csrf-token"]')?.content || ''} />
            <CssBaseline />
            <AppBar open={open} title={title} onOpen={() => setOpen(true)} />
            <DrawerDriver open={open} onClose={() => setOpen(false)} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
};

export default LayoutDriver;
