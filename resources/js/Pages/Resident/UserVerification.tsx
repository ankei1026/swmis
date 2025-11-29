import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import Title from '@/Pages/Components/Title';
import LayoutResident from '@/Pages/Layout/LayoutResident';
import DataTable from '@/Pages/Components/Table';
import { useForm } from '@inertiajs/react';
import { Button, MenuItem, Select, Chip, Avatar, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { toast } from "sonner"
import { useState } from 'react';

interface Verification {
    id: number;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_feedback: string | null;
    created_at: string;
    photo: string;
}

interface UserVerificationCreateProps {
    verifications: Verification[];
}

const UserVerificationCreate = ({ verifications }: UserVerificationCreateProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: '',
        photo: null as File | null,
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (src: string) => {
        setSelectedImage(`/storage/${src}`);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('type', data.type);

        if (data.photo) {
            formData.append('photo', data.photo);
        }

        post('/resident/user-verification/create', {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Verification document submitted successfully! Admin will review it soon.');
                reset();
            },
            onError: () => {
                toast.error('Failed to submit verification document');
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0] || null;
        setData('photo', file);
    };

    // Table columns
    const columns = [
        {
            field: 'photo',
            headerName: 'Document',
            width: 100,
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
            field: 'type',
            headerName: 'Document Type',
            width: 200,
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
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            width: 130,
            align: 'center',
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
            field: 'created_at',
            headerName: 'Submitted Date',
            width: 150,
            renderCell: (params: any) => (
                <div className="text-sm">
                    {new Date(params.value).toLocaleDateString()}
                </div>
            )
        },
    ];

    // Transform verifications data for the table
    const rows = verifications.map(verification => ({
        id: verification.id,
        type: verification.type,
        status: verification.status,
        admin_feedback: verification.admin_feedback,
        created_at: verification.created_at,
        photo: verification.photo
    }));

    return (
        <LayoutResident>
            <Title
                title="Submit Verification Documents"
                subtitle="Verify to get SMS notification for collection schedules"
            />

            {/* Submission Form */}
            <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                <div className="flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm">

                        {/* Document Type */}
                        <FormInputField>
                            <FormLabel htmlFor="type" textLabel="Document Type" />
                            <Select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                displayEmpty
                                fullWidth
                                size="small"
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Document Type</em>
                                </MenuItem>
                                <MenuItem value="valid_id">Valid ID (Passport, Driver's License, etc.)</MenuItem>
                                <MenuItem value="birth_certificate">Birth Certificate</MenuItem>
                                <MenuItem value="barangay_certificate">Barangay Certificate of Residency</MenuItem>
                            </Select>
                            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                        </FormInputField>

                        {/* Document Photo/File */}
                        <FormInputField>
                            <FormLabel htmlFor="photo" textLabel="Upload Document" />
                            <input
                                id="photo"
                                type="file"
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                required
                            />
                            {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
                            <p className="text-xs text-gray-500 mt-1">
                                Accepted formats: JPG, PNG, JPEG
                            </p>
                        </FormInputField>

                        {/* Instructions */}
                        <div className="mb-4 p-4 bg-blue-50 rounded-md">
                            <h3 className="font-semibold text-blue-800 mb-2">Submission Guidelines:</h3>
                            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                                <li>Ensure image are clear and readable</li>
                                <li>File size should not exceed 5MB</li>
                                <li>Submit one document type at a time</li>
                                <li>Admin will review your submission within 24-48 hours</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-5 flex justify-end">
                            <Button type="submit" variant="contained" color="success" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit for Verification'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Submission History Table */}
            <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
                <div className="">
                    <div className="flex h-full items-center justify-center">
                        <DataTable
                            columns={columns}
                            rows={rows}
                            title="My Verification Submissions"
                            pageSize={5}
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
        </LayoutResident>
    );
};

export default UserVerificationCreate;