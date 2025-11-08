import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import AppBar from './Appbar/Appbar';
import { DrawerHeader } from './Drawer/DrawerHeader';
import { DrawerResident } from './Drawer/DrawerResident';

interface LayoutResidentProps {
    children: React.ReactNode;
    title?: string;
}
const LayoutResident = ({ title, children }: LayoutResidentProps) => {
    const [open, setOpen] = React.useState(true);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar open={open} title={title} onOpen={() => setOpen(true)} />
            <DrawerResident open={open} onClose={() => setOpen(false)} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
};

export default LayoutResident;
