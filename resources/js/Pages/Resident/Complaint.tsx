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

interface Barangay {
  id: number;
  name: string;
}

const Complaint = () => {
  const { barangays } = usePage().props as { barangays: Barangay[] };

  const { data, setData, post, processing, errors, reset } = useForm({
    type: '',
    barangay: '',
    description: '',
    photo: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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


  return (
    <LayoutResident>
      <Head title="Complaint" />
      <Title title="Submit Complaint" />
      <div className="w-full bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm"
          >
            {/* Type */}
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

            {/* Barangay */}
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

            {/* Description */}
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
              />
            </FormInputField>

            {/* Photo */}
            <FormInputField className="w-full">
              <InputFile
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData('photo', e.target.files?.[0] || null)
                }
              />
              {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
            </FormInputField>

            {/* Submit Button */}
            <div className="mt-5 flex justify-end">
              <Button type="submit" variant="contained" color="success" disabled={processing}>
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
