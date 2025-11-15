import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import DataTable from '../../Components/Table';
import { getComplaintColumns } from '../../Data/complaintColumn';
import Layout from '../../Layout/LayoutDriver';
import Title from '../../Components/Title';
import { PageProps } from '@inertiajs/core'
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface ComplaintRow {
    id: number
    resident: string
    message: string
    photo: string
    date: string
    status: string
}

export default function Complaint({ complaints }: PageProps<{ complaints: ComplaintRow[] }>) {

    // use the backend data inside component
    const [rows, setRows] = useState<ComplaintRow[]>(complaints)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const handleEdit = (id: number) => {
        router.get(route('driver.complaints.edit', id))
        toast.success('Navigated to edit page.')
    }

    const handleDelete = (id: number) => {
        if (confirm('Delete this complaint?')) {
            setRows((prev) => prev.filter((r) => r.id !== id))
        }
    }

    const columns = getComplaintColumns(setSelectedImage, handleEdit, handleDelete)

    return (
        <Layout>
            <Head title="Complaints" />
            <Title title="Complaints" subtitle="List of complaints of resident." />
            <div className='bg-gray-100 rounded-lg w-full mt-6'>
                <div className="p-6">
                    <div className="flex h-full items-center justify-center">
                        <DataTable columns={columns} rows={rows} pageSize={5} />
                    </div>

                    <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md">
                        <DialogTitle>Complaint Photo</DialogTitle>
                        <DialogContent>
                            {selectedImage && <img src={selectedImage} alt="Complaint" className="max-h-[80vh] max-w-full rounded-md" />}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Layout>
    )
}
