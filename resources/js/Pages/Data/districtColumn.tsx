import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GridColDef } from '@mui/x-data-grid';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';


// ✅ Edit district handler
const handleEdit = (id: number) => {
    console.log('Edit district with ID:', id);
    router.visit(route('admin.district.edit', id));
};

// ✅ Delete district handler
const handleDelete = (id: number) => {
    toast.warning('Are you sure you want to delete this district?', {
        action: {
            label: 'Confirm',
            onClick: () => {
                router.delete(route('admin.district.destroy', id), {
                    preserveScroll: true,
                    onStart: () => toast.loading('Deleting district...'),
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success('district deleted successfully!');
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error('Failed to delete district.');
                    },
                });
            },
        },
        duration: 5000,
    });
};


// ✅ Proper DataGrid column definitions
const districtColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 70,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        flex: 1
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

export default districtColumns;
