import DataTable from '../Components/Table';
import schedulingColumnsResidents from '../Data/SchedulingColumnResident';
import schedulingRows from '../Data/schedulingRows';
import LayoutResident from '../Layout/LayoutResident';

const SchedulingList = () => {
    return (
        <LayoutResident title="Scheduling">
            <div className="p-6">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Scheduling List</h2>
                <p className="text-sm text-gray-600">
                    Use this table to track ongoing and completed schedules, verify driver assignments, and ensure smooth route operations.
                </p>
                <div className="flex w-full items-center justify-center">
                    <DataTable columns={schedulingColumnsResidents} rows={schedulingRows} pageSize={5} />
                </div>
            </div>
        </LayoutResident>
    );
};

export default SchedulingList;
