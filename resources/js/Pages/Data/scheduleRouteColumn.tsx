import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GridColDef } from '@mui/x-data-grid';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

// ✅ Edit schedule route handler
const handleEdit = (id: number) => {
    router.visit(route('admin.scheduleroute.edit', id));
    toast.success('Navigated to edit schedule route page')
};

// ✅ Delete schedule route handler
const handleDelete = (id: number) => {
    toast.warning('Are you sure you want to delete this schedule route?', {
        action: {
            label: 'Confirm',
            onClick: () => {
                router.delete(route('admin.scheduleroute.destroy', id), {
                    preserveScroll: true,
                    onStart: () => toast.loading('Deleting schedule route...'),
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success('Schedule route deleted successfully!');
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error('Failed to delete schedule route.');
                    },
                });
            },
        },
        duration: 5000,
    });
};

// ✅ Schedule Route DataGrid column definitions
const scheduleRouteColumns: GridColDef[] = [
    // {
    //     field: 'id',
    //     headerName: 'ID',
    //     width: 80,
    //     align: 'center',
    //     headerAlign: 'center'
    // },
    {
        field: 'route_name',
        headerName: 'Route Name',
        width: 150,
    },
    {
        field: 'driver_name',
        headerName: 'Assigned Driver',
        width: 180,
        renderCell: (params) => (
            <div className="text-sm font-medium text-gray-700">
                {params.value}
            </div>
        ),
    },
    {
        field: 'station_names',
        headerName: 'Route Stations',
        width: 200,
        flex: 1,
        renderCell: (params) => (
            <div className="text-sm text-gray-600 hidden sm:block">
                {params.value || 'No stations assigned'}
            </div>
        ),
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <div className="flex justify-center items-center gap-1 h-full">
                <Tooltip title="Edit Route">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(params.row.id);
                        }}
                        sx={{
                            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Route">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(params.row.id);
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

export default scheduleRouteColumns;