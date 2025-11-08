import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GridColDef } from '@mui/x-data-grid';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

// ✅ Edit station route handler
const handleEdit = (id: number) => {
    router.visit(route('driver.stationroute.edit', id));
};

// ✅ Delete station route handler
const handleDelete = (id: number) => {
    toast.warning('Are you sure you want to delete this station route?', {
        action: {
            label: 'Confirm',
            onClick: () => {
                router.delete(route('driver.stationroute.delete', id), {
                    preserveScroll: true,
                    onStart: () => toast.loading('Deleting station route...'),
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success('Station route deleted successfully!');
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error('Failed to delete station route.');
                    },
                });
            },
        },
        duration: 5000,
    });
};

// ✅ Station Route DataGrid column definitions
const stationRouteColumns: GridColDef[] = [
    { 
        field: 'id', 
        headerName: 'ID', 
        width: 80,
        align: 'center',
        headerAlign: 'center'
    },
    { 
        field: 'name', 
        headerName: 'Station Name', 
        width: 250,
        flex: 1,
    },
    { 
        field: 'latitude', 
        headerName: 'Latitude', 
        width: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <div className="text-sm font-mono text-gray-700 mt-4">
                {typeof params.value === 'number' ? params.value.toFixed(6) : params.value}
            </div>
        ),
    },
    { 
        field: 'longitude', 
        headerName: 'Longitude', 
        width: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <div className="text-sm font-mono text-gray-700 mt-4">
                {typeof params.value === 'number' ? params.value.toFixed(6) : params.value}
            </div>
        ),
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <div className="flex justify-center items-center gap-1 h-full">
                <Tooltip title="Edit Station">
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
                <Tooltip title="Delete Station">
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

export default stationRouteColumns;