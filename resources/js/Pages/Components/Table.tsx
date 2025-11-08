// Table.tsx - Check if this is your current implementation
import { Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

interface DataTableProps {
    columns: GridColDef[];
    rows: GridRowsProp;
    title?: string;
    height?: number;
    pageSize?: number;
    checkboxSelection?: boolean;
}

const DataTable = ({ columns, rows, title, height, pageSize, checkboxSelection }: DataTableProps) => {
    const paginationModel = { page: 0, pageSize };

    return (
        <Paper
            sx={{
                height,
                width: '98%',
                mx: 'auto',
                p: 2,
                borderRadius: 2,
            }}
        >
            {title && <h2 className="mb-2 text-lg font-semibold text-gray-800">{title}</h2>}

            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection={checkboxSelection}
                sx={{
                    border: 0,
                    '& .MuiDataGrid-cell': { 
                        alignItems: 'center',
                        display: 'flex', // Add this to ensure proper alignment
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f9f9f9',
                        fontWeight: 600,
                    },
                }}
                // Add these props to ensure data is properly rendered
                autoHeight
                disableRowSelectionOnClick
            />
        </Paper>
    );
};

export default DataTable;