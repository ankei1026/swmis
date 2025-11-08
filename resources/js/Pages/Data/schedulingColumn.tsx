import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GridColDef } from '@mui/x-data-grid';

// 🧩 Handlers
const handleEdit = (id: number) => {
    alert(`Edit clicked for Schedule ID: ${id}`);
};

const handleDelete = (id: number) => {
    if (confirm(`Are you sure you want to delete Schedule ID ${id}?`)) {
        alert(`Deleted schedule with ID: ${id}`);
    }
};

// 🧱 Columns
export const schedulingColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'time', headerName: 'Time', width: 110 },
    {
        field: 'route',
        headerName: 'Route',
        width: 220,
    },
    {
        field: 'driver',
        headerName: 'Driver',
        width: 180,
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 250,
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
            const status = params.value as string;
            const color = status === 'Ongoing' ? 'warning' : status === 'Success' ? 'success' : 'error';
            return <Chip label={status} color={color} size="small" />;
        },
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 130,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: (params) => (
            <>
                <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => handleEdit(params.row.id)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </>
        ),
    },
];

export default schedulingColumns;
