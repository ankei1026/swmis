import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GridColDef } from '@mui/x-data-grid';
import { router } from '@inertiajs/react';

// Function to generate columns with handlers
const getScheduleColumns = (onDelete: (id: number) => void): GridColDef[] => {
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
        if (!time) return '';

        // If time is in 24-hour format, convert to 12-hour format
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;

        return `${formattedHour}:${minutes} ${ampm}`;
    };

    // ✅ Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return [
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
                    {params.value}
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
                    {params.value}
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
                    label={params.value}
                    size="small"
                    color={getTypeColor(params.value) as any}
                    variant="outlined"
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
                    size="small"
                    color={getStatusColor(params.value) as any}
                    variant="filled"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div className="flex justify-center items-center gap-1 h-full">
                    <Tooltip title="Edit Schedule">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.visit(route('admin.scheduling.edit', params.row.id));
                            }}
                            sx={{
                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Schedule">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(params.row.id);
                            }}
                            sx={{
                                '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];
};