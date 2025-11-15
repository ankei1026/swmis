'use client';

import { InputFile } from '@/components/ui/input-file';
import FormInput from '@/Pages/Components/FormInput';
import FormInputField from '@/Pages/Components/FormInputField';
import FormLabel from '@/Pages/Components/FormLabel';
import LayoutResident from '@/Pages/Layout/LayoutResident';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import Title from '@/Pages/Components/Title';
import { toast } from 'sonner';
import { useEffect } from 'react';

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

interface PageProps {
  barangays: Barangay[];
  auth: {
    user: User;
  };
  flash?: {
    error?: string;
    success?: string;
  };
}

const Complaint = () => {
  const { barangays, auth, flash } = usePage().props as PageProps;
  const user = auth.user;

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

  const isVerified = user.status === 'verified';

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

      <div className="w-full bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm"
          >
            {/* Rest of the form remains the same as previous version */}
            <FormInputField>
              <FormLabel htmlFor="type" textLabel="Complaint Type" />
              <Select
                id="type"
                value={data.type}
                onChange={(e) => setData('type', e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                required
                disabled={processing}
              >
                <MenuItem value="">
                  <em>Select Type</em>
                </MenuItem>
                <MenuItem value="garbage">Garbage</MenuItem>
                <MenuItem value="road">Road</MenuItem>
                <MenuItem value="sewage">Sewage</MenuItem>
                <MenuItem value="public_safety">Public Safety</MenuItem>
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
                disabled={processing}
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
              <FormLabel htmlFor="description" textLabel="Description" />
              <TextField
                id="description"
                multiline
                rows={4}
                placeholder="Describe your complaint here..."
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                fullWidth
                size="small"
                error={!!errors.description}
                helperText={errors.description}
                disabled={processing}
              />
            </FormInputField>

            <FormInputField className="w-full">
              <FormLabel htmlFor="photo"/>
              <InputFile
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData('photo', e.target.files?.[0] || null)
                }
                disabled={processing}
              />
              {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
            </FormInputField>

            <div className="mt-5 flex justify-end">
              <Button 
                type="submit" 
                variant="contained" 
                color="success" 
                disabled={processing}
              >
                {processing ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </LayoutResident>
  );
};

export default Complaint;