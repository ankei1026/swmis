import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GridColDef } from '@mui/x-data-grid';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';


// ✅ Edit user handler
const handleEdit = (id: number) => {
    console.log('Edit user with ID:', id);
    router.visit(route('admin.users.edit', id));
};

// ✅ Delete user handler
const handleDelete = (id: number) => {
    toast.warning('Are you sure you want to delete this user?', {
        action: {
            label: 'Confirm',
            onClick: () => {
                router.delete(route('admin.users.destroy', id), {
                    preserveScroll: true,
                    onStart: () => toast.loading('Deleting user...'),
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success('User deleted successfully!');
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error('Failed to delete user.');
                    },
                });
            },
        },
        duration: 5000,
    });
};


// ✅ Proper DataGrid column definitions
const userColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone Number', width: 160 },
    { field: 'barangay', headerName: 'Barangay', width: 150 },
    {
        field: 'role',
        headerName: 'Role',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
            const role = params.value as string;
            const color =
                role === 'admin'
                    ? 'error'
                    : role === 'staff'
                    ? 'primary'
                    : 'success';
            return <Chip label={role} color={color} size="small" />;
        },
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
            const status = params.value as string;
            const color = status === 'verified' ? 'success' : 'error';
            return <Chip label={status} color={color} size="small" />;
        },
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 130,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: (params) => (
            <>
                <Tooltip title="Edit">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(params.row.id)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </>
        ),
    },
];

export default userColumns;
