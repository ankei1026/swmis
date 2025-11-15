import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GridColDef } from '@mui/x-data-grid';

// ✅ Get status color
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'primary';
        case 'success':
            return 'success';
        case 'ongoing':
            return 'warning';
        case 'failed':
            return 'error';
        default:
            return 'default';
    }
};

// ✅ Get type color
const getTypeColor = (type: string) => {
    if (type.includes('Biodegradable')) {
        return 'success';
    } else if (type.includes('Non-Biodegradable')) {
        return 'primary';
    }
    return 'default';
};

// ✅ Format time for display
const formatTime = (time: string) => {
    if (!time) return 'No Time';

    // If time is in 24-hour format, convert to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
};

// ✅ Format date for display
const formatDate = (dateString: string) => {
    if (!dateString) return 'No Date';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// ✅ Schedule DataGrid column definitions
const scheduleColumnsDriverResident: GridColDef[] = [
    // {
    //     field: 'id',
    //     headerName: 'ID',
    //     width: 70,
    //     align: 'center',
    //     flex: 1,
    //     headerAlign: 'center'
    // },
    {
        field: 'date',
        headerName: 'Date',
        width: 120,
        flex: 1,
        renderCell: (params) => (
            <div className="text-sm font-medium text-gray-700">
                {formatDate(params.value)}
            </div>
        ),
    },
    {
        field: 'time',
        headerName: 'Time',
        width: 100,
        flex: 1,
        renderCell: (params) => (
            <div className="text-sm text-gray-600">
                {formatTime(params.value)}
            </div>
        ),
    },
    {
        field: 'route_name',
        headerName: 'Route',
        width: 180,
        flex: 1,
        renderCell: (params) => (
            <div className="text-sm font-medium text-gray-700">
                {params.value || 'No Route'}
            </div>
        ),
    },
    {
        field: 'driver_name',
        headerName: 'Driver',
        width: 150,
        flex: 1,
        renderCell: (params) => (
            <div className="text-sm font-medium text-gray-700">
                {params.value || 'No Driver'}
            </div>
        ),
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 180,
        flex: 1,
        renderCell: (params) => (
            <Chip
                label={params.value || 'Unknown'}
                size="small"
                color={getTypeColor(params.value) as any}
                variant="outlined"
            />
        ),
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        flex: 1,
        renderCell: (params) => (
            <Chip
                label={params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : 'Unknown'}
                size="small"
                color={getStatusColor(params.value) as any}
                variant="filled"
            />
        ),
    },
];

export default scheduleColumnsDriverResident;