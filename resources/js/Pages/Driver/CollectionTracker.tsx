import Layout from '@/Pages/Layout/LayoutDriver';
import Title from '@/Pages/Components/Title';
import Map from '../Components/Map';

const CollectionTracker = () => {
    return (
        <Layout>
            <Title title="Collection Tracker" />
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Map Section - Takes 2 columns on large screens */}
                <div className='lg:col-span-2 w-full bg-gray-100 p-6 rounded-lg'>
                    <Map />
                </div>
                
                {/* Route Logs Section - Takes 1 column on large screens */}
                <div className='w-full bg-gray-100 p-6 rounded-lg'>
                    <h1 className='text-xl font-semibold mb-4'>Collection Waste Route Logs</h1>
                    <div className='space-y-4'>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <p className='font-medium'>Team A</p>
                            <p className='text-sm text-gray-600'>Currently at: Union Site Station</p>
                            <p className='text-xs text-gray-500 mt-1'>Last updated: 2 minutes ago</p>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <p className='font-medium'>Team B</p>
                            <p className='text-sm text-gray-600'>Currently at: Central MRF</p>
                            <p className='text-xs text-gray-500 mt-1'>Last updated: 5 minutes ago</p>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <p className='font-medium'>Team C</p>
                            <p className='text-sm text-gray-600'>Currently at: Barangay Hall Station</p>
                            <p className='text-xs text-gray-500 mt-1'>Last updated: 10 minutes ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CollectionTracker;