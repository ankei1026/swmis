import InboxIcon from '@mui/icons-material/MoveToInbox';
import { hr } from 'date-fns/locale';
import { BellIcon, Calendar1Icon, EyeIcon, GitPullRequestCreateIcon, HomeIcon, LandmarkIcon, ListIcon, LocationEditIcon, RouteIcon, User2Icon, UserIcon } from 'lucide-react';

export const mainMenu = [
    {
        text: 'Dashboard',
        icon: <HomeIcon />,
        href: '/admin/dashboard',
    },
    {
        text: 'Users',
        icon: <User2Icon />,
        children: [
            { text: 'List', href: '/admin/users/list', icon: <ListIcon /> },
            { text: 'Create', href: '/admin/users/create', icon: <GitPullRequestCreateIcon /> },
        ],
    },
    {
        text: 'Schedule',
        icon: <Calendar1Icon />,        
        children: [
            { text: 'List', href: '/admin/scheduling/list', icon: <ListIcon /> },
            { text: 'Create', href: '/admin/scheduling/create', icon: <GitPullRequestCreateIcon /> },
        ],
    },
];

export const secondaryMenu = [
    {
        text: 'Collection Tracker',
        icon: <EyeIcon />,
        href: '/admin/monitoring',
    },
    { text: 'Complaints', icon: <InboxIcon />, href: '/admin/complaints' },
    { text: 'Profile', icon: <UserIcon />, href: '/admin/profile' },
];

export const mainMenuResident = [
    {
        text: 'Dashboard',
        icon: <HomeIcon />,
        href: '/resident/dashboard',
    },
];

export const secondaryMenuResident = [

    {
        text: 'Complaint',
        icon: <InboxIcon />,
        href: '/resident/complaint',
    },
    {
        text: 'Collection Tracker',
        icon: <EyeIcon />,
        href: '/resident/collectiontracker',
    },
    {
        text: 'Collection Schedule',
        icon: <Calendar1Icon />,
        href: '/resident/schedule',
    },

    {
        text: 'Profile',
        icon: <User2Icon />,
        href: '/resident/profile',
    },
];

export const mainMenuDriver = [
    {
        text: 'Dashboard',
        icon: <HomeIcon />,
        href: '/driver/dashboard',
    },
    {
        text: 'Barangay',
        icon: <LocationEditIcon />,
        children: [
            { text: 'List', href: '/driver/barangays/list', icon: <ListIcon /> },
            { text: 'Create', href: '/driver/barangays/create', icon: <GitPullRequestCreateIcon /> },
        ],
    },

    {
        text: 'Station Routes',
        icon: <LandmarkIcon />,
        children: [
            { text: 'List', href: '/driver/stationroute/list', icon: <ListIcon /> },
            { text: 'Create', href: '/driver/stationroute/create', icon: <GitPullRequestCreateIcon /> },
        ],
    },

    {
        text: 'Schedule Routes',
        icon: <RouteIcon />,
        children: [
            { text: 'List', href: '/driver/scheduleroute/list', icon: <ListIcon /> },
            { text: 'Create', href: '/driver/scheduleroute/create', icon: <GitPullRequestCreateIcon /> },
        ],
    },

];

export const secondaryMenuDriver = [
    {
        text: 'Collection Schedule',
        icon: <Calendar1Icon />,
        href: '/driver/scheduling/list',
    },
    {
        text: 'Collection Tracker',
        icon: <EyeIcon />,
        href: '/driver/collectiontracker',
    },
    {
        text: 'Profile',
        icon: <User2Icon />,
        href: '/driver/profile',
    },
];