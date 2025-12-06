import InboxIcon from '@mui/icons-material/MoveToInbox';
import { hr } from 'date-fns/locale';
import { BellIcon, BuildingIcon, Calendar1Icon, CheckIcon, EyeIcon, GitPullRequestCreateIcon, HomeIcon, LandmarkIcon, ListIcon, LocationEditIcon, RouteIcon, TrashIcon, User2Icon, UserIcon } from 'lucide-react';

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
        text: 'District',
        icon: <BuildingIcon />,
        children: [
            { text: 'List', href: '/admin/district/list', icon: <ListIcon /> },
            { text: 'Create', href: '/admin/district/create', icon: <GitPullRequestCreateIcon /> },
        ],
    },
    {
        text: 'Purok',
        icon: <LocationEditIcon />,
        children: [
            { text: 'List', href: '/admin/barangays/list', icon: <ListIcon /> },
            { text: 'Create', href: '/admin/barangays/create', icon: <GitPullRequestCreateIcon /> },
        ],
    },
    {
        text: 'Station Routes',
        icon: <LandmarkIcon />,
        children: [
            { text: 'List', href: '/admin/stationroute/list', icon: <ListIcon /> },
            { text: 'Create', href: '/admin/stationroute/create', icon: <GitPullRequestCreateIcon /> },
        ],
    },

    {
        text: 'Schedule Routes',
        icon: <RouteIcon />,
        children: [
            { text: 'List', href: '/admin/scheduleroute/list', icon: <ListIcon /> },
            { text: 'Create', href: '/admin/scheduleroute/create', icon: <GitPullRequestCreateIcon /> },
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
    { text: 'Verify', icon: <CheckIcon />, href: '/admin/user-verification' },
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
        text: 'Proper Segregation',
        icon: <TrashIcon />,
        href: '/resident/proper-segregation',
    },
    {
        text: 'Complaint',
        icon: <InboxIcon />,
        href: '/resident/complaint',
    },
    {
        text: 'Schedule',
        icon: <Calendar1Icon />,
        href: '/resident/schedule',
    },
    {
        text: 'Collection Tracker',
        icon: <EyeIcon />,
        href: '/resident/collectiontracker',
    },
    {
        text: 'Verify',
        icon: <CheckIcon />,
        href: '/resident/user-verification',
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
];

export const secondaryMenuDriver = [
    {
        text: 'Schedule',
        icon: <Calendar1Icon />,
        href: '/driver/schedule',
    },
    {
        text: 'Collection Tracker',
        icon: <EyeIcon />,
        href: '/driver/collectiontracker',
    },
    {
        text: 'Complaints',
        icon: <InboxIcon />,
        href: '/driver/complaints'
    },
    {
        text: 'Profile',
        icon: <User2Icon />,
        href: '/driver/profile',
    },
];