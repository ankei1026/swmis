'use client';

import { InputFile } from '@/components/ui/input-file';
import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import LayoutResident from '@/Pages/Layout/LayoutResident';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, TextField, Avatar, Chip } from '@mui/material';
import Title from '@/Pages/Components/Title';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import DataTable from '@/Pages/Components/Table';

interface Barangay {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'verified' | 'rejected';
}

interface Complaint {
  id: number;
  type: string;
  barangay: string;
  description: string;
  photo: string | null;
  status: 'pending' | 'in_progress' | 'resolve' | 'rejected';
  created_at: string;
  admin_feedback?: string;
}

interface PageProps {
  barangays: Barangay[];
  auth: {
    user: User;
  };
  flash?: {
    error?: string;
    success?: string;
  };
  complaints?: Complaint[]; // Add complaints to props
}

const Complaint = () => {
  const { barangays, auth, flash, complaints = [] } = usePage().props as PageProps;
  const user = auth.user;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    type: '',
    barangay: '',
    description: '',
    photo: null as File | null,
  });

  // Show toast when page loads if user is not verified
  useEffect(() => {
    if (user.status !== 'verified') {
      toast.error('You are not verified. You need to get verified before you can submit a complaint.');
    }

    // Show flash messages from backend
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [user.status, flash]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is verified before submitting
    if (user.status !== 'verified') {
      toast.error('You are not verified. You need to get verified before you can submit a complaint.');
      return;
    }

    post(route('resident.complaints.store'), {
      onSuccess: () => {
        toast.success('Complaint submitted successfully!');
        reset();
      },
      onError: () => {
        toast.error('Failed to submit complaint. Please check your input.');
      },
    });
  };

  const handleImageClick = (src: string) => {
    setSelectedImage(`/storage/${src}`);
  };

  const isVerified = user.status === 'verified';

  // Table columns for complaints
  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      width: 100,
      renderCell: (params: any) => (
        params.value ? (
          <Avatar
            src={`/storage/${params.value}`}
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
        ) : (
          <Avatar
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              backgroundColor: 'grey.300',
            }}
          >
            No Image
          </Avatar>
        )
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'type',
      headerName: 'Complaint Type',
      width: 180,
      renderCell: (params: any) => {
        const typeLabels: Record<string, string> = {
          garbage: 'Garbage',
          road: 'Road',
          sewage: 'Sewage',
          public_safety: 'Public Safety',

          // Extended Waste Categories
          uncollected_waste: 'Uncollected Waste',
          overflowing_bins: 'Overflowing Bins',
          improper_segregation: 'Improper Waste Segregation',
          foul_odor: 'Foul Odor Issues',
          burning_waste: 'Burning of Waste',
          illegal_dumping: 'Illegal Dumping',
          irregular_schedule: 'Irregular Collection Schedule',
          missed_collection: 'Missed Garbage Collection',
          insufficient_bins: 'Insufficient Waste Bins',
          clogged_drainage: 'Clogged Drainage',
          construction_waste: 'Construction Waste Issues'
        };

        return typeLabels[params.value] || params.value;
      }
    },
    {
      field: 'barangay',
      headerName: 'Barangay',
      width: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      flex: 1,
      renderCell: (params: any) => (
        <div className="text-sm line-clamp-2">
          {params.value || 'No description'}
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
          'in_progress': { color: 'info', label: 'In Progress' },
          'resolve': { color: 'success', label: 'Resolve' },
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
      width: 200,
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
      renderCell: (params: any) => (
        <div className="text-sm">
          {new Date(params.value).toLocaleDateString()}
        </div>
      )
    },
  ];

  // Transform complaints data for the table
  const rows = complaints.map(complaint => ({
    id: complaint.id,
    type: complaint.type,
    barangay: complaint.barangay,
    description: complaint.description,
    status: complaint.status,
    admin_feedback: complaint.admin_feedback,
    created_at: complaint.created_at,
    photo: complaint.photo
  }));

  return (
    <LayoutResident>
      <Head title="Complaint" />
      <Title title="Submit Complaint" />

      {/* Verification Status Banner */}
      {!isVerified && (
        <div className="mb-6 p-4 border rounded-lg mt-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-yellow-800 font-medium">Account Verification Required</h3>
              <p className="text-black text-sm">
                You need to verify your account before submitting complaints.
                {user.status === 'pending' && ' Your verification is pending approval.'}
                {user.status === 'rejected' && ' Your verification was rejected. Please contact support.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Submission Form */}
      <div className="w-full bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm"
          >
            <FormInputField>
              <FormLabel htmlFor="type" textLabel="Complaint Type" />
              <Select
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300
                    }
                  }
                }}
                value={data.type || ""}
                onChange={(e) => setData('type', e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                required
                disabled={processing || !isVerified}
              >
                <MenuItem value="">
                  <em>Select Type</em>
                </MenuItem>
                {/* Existing categories */}
                <MenuItem value="garbage">Garbage</MenuItem>
                <MenuItem value="road">Road</MenuItem>
                <MenuItem value="sewage">Sewage</MenuItem>
                <MenuItem value="public_safety">Public Safety</MenuItem>

                {/* Added detailed waste complaint options */}
                <MenuItem value="uncollected_waste">Uncollected Waste</MenuItem>
                <MenuItem value="overflowing_bins">Overflowing Bins</MenuItem>
                <MenuItem value="improper_segregation">Improper Waste Segregation</MenuItem>
                <MenuItem value="foul_odor">Foul Odor Issues</MenuItem>
                <MenuItem value="burning_waste">Burning of Waste</MenuItem>
                <MenuItem value="illegal_dumping">Illegal Dumping</MenuItem>
                <MenuItem value="irregular_schedule">Irregular Collection Schedule</MenuItem>
                <MenuItem value="missed_collection">Missed Garbage Collection</MenuItem>
                <MenuItem value="insufficient_bins">Insufficient Waste Bins</MenuItem>
                <MenuItem value="clogged_drainage">Clogged Drainage</MenuItem>
                <MenuItem value="construction_waste">Construction Waste Issues</MenuItem>
              </Select>
              {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
            </FormInputField>

            <FormInputField>
              <FormLabel htmlFor="barangay" textLabel="Barangay" />
              <Select
                id="barangay"
                value={data.barangay}
                onChange={(e) => setData('barangay', e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                required
                disabled={processing || !isVerified}
              >
                <MenuItem value="">
                  <em>Select Barangay</em>
                </MenuItem>
                {barangays.map((b) => (
                  <MenuItem key={b.id} value={b.name}>
                    {b.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.barangay && <p className="mt-1 text-sm text-red-500">{errors.barangay}</p>}
            </FormInputField>

            <FormInputField>
              <div className="flex justify-between items-center mb-1">
                <FormLabel htmlFor="description" textLabel="Description" />
                <span className={`text-sm ${data.description.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                  {data.description.length}/60
                </span>
              </div>
              <TextField
                id="description"
                multiline
                rows={4}
                placeholder="Describe your complaint here..."
                value={data.description}
                onChange={(e) => {
                  if (e.target.value.length <= 60) {
                    setData('description', e.target.value);
                  }
                }}
                fullWidth
                size="small"
                error={!!errors.description || data.description.length > 60}
                helperText={errors.description || (data.description.length > 60 ? 'Maximum 60 characters allowed' : '')}
                disabled={processing || !isVerified}
                inputProps={{ maxLength: 60 }} // HTML attribute backup
              />
            </FormInputField>
            <FormInputField className="w-full">
              <FormLabel htmlFor="photo" textLabel="Upload Photo (Optional)" />
              <input
                id="photo"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file type
                    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'];

                    if (!allowedTypes.includes(file.type)) {
                      alert('Please select a valid image file (JPG, PNG, JPEG, GIF, BMP, or WebP).');
                      e.target.value = '';
                      setData('photo', null);
                      return;
                    }

                    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
                    const maxSize = 2 * 1024 * 1024;
                    if (file.size > maxSize) {
                      alert('File size must be less than 2MB.');
                      e.target.value = '';
                      setData('photo', null);
                      return;
                    }

                    setData('photo', file);
                  } else {
                    setData('photo', null);
                  }
                }}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                disabled={processing || !isVerified}
              />
              {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: JPG, PNG, JPEG, GIF, BMP, WebP (Max: 2MB)
              </p>
            </FormInputField>

            <div className="mt-5 flex justify-end">
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={processing || !isVerified}
              >
                {processing ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Complaint History Table */}
      {complaints.length > 0 && (
        <div className='w-full bg-gray-100 py-6 rounded-lg mt-4'>
          <div className="">
            <div className="flex h-full items-center justify-center">
              <DataTable
                columns={columns}
                rows={rows}
                title="My Complaint Submissions"
                pageSize={5}
                checkboxSelection={false}
              />
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md">
              <DialogTitle>Complaint Photo</DialogTitle>
              <DialogContent>
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Complaint Photo"
                    className="max-h-[80vh] max-w-full rounded-md"
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </LayoutResident>
  );
};

export default Complaint;