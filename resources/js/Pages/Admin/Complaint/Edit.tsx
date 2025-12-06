import Layout from '@/Pages/Layout/Layout'
import Title from '@/Pages/Components/Title'
import { Head, useForm } from '@inertiajs/react'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import { toast } from 'sonner'
import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'

interface EditProps {
  complaint: {
    id: number
    resident: string
    description: string
    type: string
    status: string
    photo: string
  }
}

export default function Edit({ complaint }: EditProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, setData, put, processing, errors } = useForm({
    status: complaint.status
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('complaints.update', complaint.id))
    toast.success('Complaint status updated successfully.')
  }

  return (
    <Layout>
      <Head title="Edit Complaint" />
      <Title title="Edit Complaint Status" />

      <div className="w-full bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <form
            onSubmit={submit}
            className="w-[500px] rounded-md border border-gray-300 bg-white p-6 shadow-sm"
          >
            {/* Resident - locked */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Resident</label>
              <TextField fullWidth size="small" value={complaint.resident} disabled />
            </div>

            {/* Resident - locked */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Type</label>
              <TextField fullWidth size="small" value={complaint.type} disabled />
            </div>

            {/* Message - locked */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Complaint Message</label>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={4}
                value={complaint.description}
                disabled
              />
            </div>

            {/* Status - editable */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Update Status</label>
              <Select
                fullWidth
                size="small"
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="resolve">Resolve</MenuItem>
              </Select>
              {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
            </div>

            {/* Document Preview */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Complaint Attachment</label>

              {complaint.photo ? (
                <div className="flex justify-center">
                  <img
                    src={`/storage/${complaint.photo}`}
                    alt="Complaint Attachment"
                    className="h-32 w-32 object-cover rounded-md cursor-pointer transition hover:opacity-80"
                    onClick={() => setSelectedImage(`/storage/${complaint.photo}`)}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center">No photo attached</p>
              )}
            </div>

            {/* Submit */}
            <div className="mt-5 flex justify-end">
              <Button type="submit" variant="contained" color="success" disabled={processing}>
                {processing ? 'Saving...' : 'Save'}
              </Button>
            </div>

          </form>
        </div>
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          maxWidth="md"
        >
          <DialogTitle>Attachment Preview</DialogTitle>
          <DialogContent>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Complaint Attachment"
                className="max-h-[80vh] max-w-full rounded-md"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
