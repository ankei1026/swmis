import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { drawerWidth } from '../Drawer/Drawer.styles';

interface AppBarProps {
    open: boolean;
    onOpen: () => void;
    title?: string;
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

const AppBar = ({ open, onOpen, title }: AppBarProps) => (
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
            <Typography variant="h6" noWrap>
                {title}  <span className="font-bold text-green-600">Solid Waste Management Information System</span>
            </Typography>
        </Toolbar>
    </StyledAppBar>
);

export default AppBar;
