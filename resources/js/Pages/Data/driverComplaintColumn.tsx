// resources/js/Pages/Data/complaintColumn.tsx
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export const getDriverComplaintColumns = (
    // handleImageClick: (src: string) => void,
    // handleEdit = (id: number) => {
    //     router.get(route('driver.complaints.edit', id))
    //     toast.success('Navigated to edit page.')
    //     toast.error('Edit failed')
    // },

    // handleDelete: (id: number) => void,
): GridColDef[] => [
        {
            field: 'photo',
            headerName: 'Photo',
            width: 100,
            renderCell: (params) => (
                <Avatar
                    src={params.value}
                    alt="Complaint Photo"
                    variant="rounded"
                    sx={{
                        width: 56,
                        height: 56,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 },
                    }}
                    onClick={() => handleImageClick(params.value)}
                />
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 140,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            minWidth: 200,
        },
        {
            field: 'timestamps',
            headerName: 'Date Filed',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => {
                const role = params.value as string;
                const color = role === 'pending' ? 'primary' : role === 'resolve' ? 'success' : 'danger';
                return <Chip label={role} color={color} size="small" />;
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                        <IconButton color="primary" size="small" onClick={() => handleEdit(params.row.id)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton color="error" size="small" onClick={() => handleDelete(params.row.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];
