import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import Title from '@/Pages/Components/Title';
import Layout from '@/Pages/Layout/Layout';
import DataTable from '@/Pages/Components/Table';
import { useForm } from '@inertiajs/react';
import { Button, MenuItem, Select, Chip, Avatar, Dialog, DialogContent, DialogTitle, IconButton, Stack, Tooltip, TextField } from '@mui/material';
import { toast } from "sonner"
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';

interface Verification {
    id: number;
    resident_id: number;
    resident_name: string;
    resident_email: string;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_feedback: string | null;
    created_at: string;
    photo: string;
}

interface UserVerificationProps {
    verifications: Verification[];
}

const UserVerification = ({ verifications }: UserVerificationProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [editingVerification, setEditingVerification] = useState<Verification | null>(null);

    const { put, processing, data, setData } = useForm({
        status: '',
        admin_feedback: ''
    });

    const handleImageClick = (src: string) => {
        setSelectedImage(`/storage/${src}`);
    };

    const handleEdit = (verification: Verification) => {
        setEditingVerification(verification);
        setData({
            status: verification.status,
            admin_feedback: verification.admin_feedback || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingVerification(null);
        setData({ status: '', admin_feedback: '' });
    };

    const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!editingVerification) return;

        put(`/admin/user-verification/${editingVerification.id}`, {
            onSuccess: () => {
                toast.success('Verification status updated successfully');
                setEditingVerification(null);
                setData({ status: '', admin_feedback: '' });
            },
            onError: () => {
                toast.error('Failed to update verification status');
            }
        });
    };

    // Table columns
    const columns = [
        {
            field: 'photo',
            headerName: 'Document',
            width: 100,
            align: 'center' as const,
            headerAlign: 'center' as const,
            renderCell: (params: any) => (
                <Avatar
                    src={`/storage/${params.value}`}
                    alt="Verification Document"
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
            field: 'resident',
            headerName: 'Resident',
            width: 250,
            flex: 1,
            renderCell: (params: any) => (
                <div>
                    <div className="font-medium text-gray-900">{params.row.resident_name}</div>
                </div>
            )
        },
        {
            field: 'type',
            headerName: 'Document Type',
            width: 180,
            renderCell: (params: any) => {
                const typeLabels: { [key: string]: string } = {
                    'valid_id': 'Valid ID',
                    'birth_certificate': 'Birth Certificate',
                    'barangay_certificate': 'Barangay Certificate'
                };
                return typeLabels[params.value] || params.value;
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            align: 'center' as const,
            headerAlign: 'center' as const,
            renderCell: (params: any) => {
                const statusColors: { [key: string]: any } = {
                    'pending': { color: 'warning', label: 'Pending' },
                    'approved': { color: 'success', label: 'Approved' },
                    'rejected': { color: 'error', label: 'Rejected' }
                };

                const status = statusColors[params.value] || { color: 'default', label: params.value };

                return (
                    <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        variant="filled"
                    />
                );
            }
        },
        {
            field: 'admin_feedback',
            headerName: 'Admin Feedback',
            width: 250,
            flex: 1,
            renderCell: (params: any) => (
                <div className="text-sm">
                    {params.value || 'No feedback yet'}
                </div>
            )
        },
        {
            field: 'created_at',
            headerName: 'Submitted Date',
            width: 150,
            align: 'center' as const,
            headerAlign: 'center' as const,
            renderCell: (params: any) => (
                <div className="text-sm">
                    {new Date(params.value).toLocaleDateString()}
                </div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            align: 'center' as const,
            headerAlign: 'center' as const,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit Status">
                        <IconButton 
                            color="primary" 
                            size="small" 
                            onClick={() => handleEdit(params.row)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    // Transform verifications data for the table
    const rows = verifications.map(verification => ({
        id: verification.id,
        resident_name: verification.resident_name,
        resident_email: verification.resident_email,
        type: verification.type,
        status: verification.status,
        admin_feedback: verification.admin_feedback,
        created_at: verification.created_at,
        photo: verification.photo
    }));

    return (
        <Layout>
            <Title 
                title="User Verification Management" 
                subtitle="Review and manage all user verification submissions" 
            />

            {/* Edit Form - Only shows when editing */}
            {editingVerification && (
                <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                    <div className="flex items-center justify-center">
                        <form onSubmit={handleSaveEdit} className="w-[600px] rounded-md border border-gray-300 bg-white p-6 shadow-sm">
                            <div className="mb-4 pb-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-800">Edit Verification Status</h3>
                                <p className="text-sm text-gray-600">
                                    Editing submission for <span className="font-medium">{editingVerification.resident_name}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Resident Info - Readonly */}
                                <FormInputField>
                                    <FormLabel htmlFor="resident_name" textLabel="Resident Name" />
                                    <FormInput
                                        id="resident_name"
                                        type="text"
                                        value={editingVerification.resident_name}
                                        readOnly
                                        className="w-full bg-gray-50"
                                    />
                                </FormInputField>

                                <FormInputField>
                                    <FormLabel htmlFor="resident_email" textLabel="Email" />
                                    <FormInput
                                        id="resident_email"
                                        type="email"
                                        value={editingVerification.resident_email}
                                        readOnly
                                        className="w-full bg-gray-50"
                                    />
                                </FormInputField>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Document Type - Readonly */}
                                <FormInputField>
                                    <FormLabel htmlFor="type" textLabel="Document Type" />
                                    <FormInput
                                        id="type"
                                        type="text"
                                        value={editingVerification.type}
                                        readOnly
                                        className="w-full bg-gray-50"
                                    />
                                </FormInputField>

                                {/* Submission Date - Readonly */}
                                <FormInputField>
                                    <FormLabel htmlFor="created_at" textLabel="Submitted Date" />
                                    <FormInput
                                        id="created_at"
                                        type="text"
                                        value={new Date(editingVerification.created_at).toLocaleDateString()}
                                        readOnly
                                        className="w-full bg-gray-50"
                                    />
                                </FormInputField>
                            </div>

                            {/* Status - Editable */}
                            <FormInputField>
                                <FormLabel htmlFor="status" textLabel="Status" />
                                <Select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                    required
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormInputField>

                            {/* Admin Feedback - Editable */}
                            <FormInputField>
                                <FormLabel htmlFor="admin_feedback" textLabel="Admin Feedback" />
                                <textarea
                                    id="admin_feedback"
                                    placeholder="Enter feedback or reason for status change..."
                                    value={data.admin_feedback}
                                    onChange={(e) => setData('admin_feedback', e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
                                />
                            </FormInputField>

                            {/* Document Preview */}
                            <FormInputField>
                                <FormLabel htmlFor="document_preview" textLabel="Document Preview" />
                                <div className="flex justify-center">
                                    <Avatar
                                        src={`/storage/${editingVerification.photo}`}
                                        alt="Verification Document"
                                        variant="rounded"
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            cursor: 'pointer',
                                            '&:hover': { opacity: 0.8 },
                                        }}
                                        onClick={() => handleImageClick(editingVerification.photo)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Click on the document to view full size
                                </p>
                            </FormInputField>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-end space-x-3 gap-2">
                                <Button 
                                    type="button" 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="success" 
                                    disabled={processing}
                                >
                                    {processing ? 'Updating...' : 'Update Status'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* All Submissions Table */}
            <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                <div className="px-2">
                    <div className="mb-4 px-4">
                        <h3 className="text-lg font-semibold text-gray-800">All Verification Submissions</h3>
                        <p className="text-sm text-gray-600">
                            {verifications.length} total submissions • Click edit icon to update status
                        </p>
                    </div>
                    
                    <div className="flex h-full items-center justify-center">
                        <DataTable
                            columns={columns}
                            rows={rows}
                            title=""
                            pageSize={10}
                            checkboxSelection={false}
                        />
                    </div>

                    {/* Image Preview Dialog */}
                    <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md">
                        <DialogTitle>Verification Document</DialogTitle>
                        <DialogContent>
                            {selectedImage && (
                                <img 
                                    src={selectedImage} 
                                    alt="Verification Document" 
                                    className="max-h-[80vh] max-w-full rounded-md" 
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Layout>
    );
};

export default UserVerification;