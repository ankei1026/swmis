import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateClickArg, EventContentArg } from '@fullcalendar/core';
import { useState } from 'react';

interface Schedule {
    id: number;
    title: string;
    date: string;
    time?: string;
    status: string;
    type?: string;
    driver_name: string;
    route_name: string;
}

interface ExtendedProps {
    time?: string;
    formattedTime?: string;
    status: string;
    type?: string;
    driver: string;
    route: string;
}

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        title: string;
        startStr: string;
        formattedDate: string;
        extendedProps: ExtendedProps;
    } | null;
}

// Helper function to format date to readable format
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Helper function to format time with AM/PM
const formatTime = (timeString?: string): string => {
    if (!timeString) return 'All day';

    // If time is already in a format like "HH:MM:SS" or "HH:MM"
    const timeParts = timeString.split(':');
    if (timeParts.length >= 2) {
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12

        return `${hours}:${minutes} ${ampm}`;
    }

    return timeString; // Return as-is if not in expected format
};

const EventModal = ({ isOpen, onClose, event }: EventModalProps) => {
    if (!isOpen || !event) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'success': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'in_progress': return 'In Progress';
            case 'completed': return 'Completed';
            case 'success': return 'Successful';
            case 'failed': return 'Failed';
            default: return status;
        }
    };

    return (
        <>
            {/* Backdrop - separate from modal content */}
            <div
                className="fixed w-full h-full z-50 inset-0 bg-white/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                    {/* Modal Header */}
                    <div className="bg-green-600 px-4 py-3 text-white">
                        <h3 className="text-lg font-semibold">
                            Collection Schedule Details
                        </h3>
                    </div>

                    {/* Modal Body */}
                    <div className="px-4 py-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Schedule Title
                                </label>
                                <p className="text-gray-800 font-medium">{event.title}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Driver
                                </label>
                                <p className="text-gray-800">{event.extendedProps.driver}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Route
                                </label>
                                <p className="text-gray-800">{event.extendedProps.route}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Date
                                    </label>
                                    <p className="text-gray-800 font-medium">{event.formattedDate}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Time
                                    </label>
                                    <p className="text-gray-800 font-medium">{event.extendedProps.formattedTime}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Type
                                    </label>
                                    <p className="text-gray-800">{event.extendedProps.type || 'Regular'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Status
                                    </label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.extendedProps.status)}`}>
                                        {getStatusText(event.extendedProps.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

interface FullCalendarComponentProps {
    schedules?: Schedule[];
}

const FullCalendarComponent = ({ schedules = [] }: FullCalendarComponentProps) => {
    const [selectedEvent, setSelectedEvent] = useState<{
        title: string;
        startStr: string;
        formattedDate: string;
        extendedProps: ExtendedProps;
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Format schedules for FullCalendar
    console.log("schedules: ", schedules);

    const formatEvents = () => {
        return schedules.map(schedule => {
            // Determine color based on status
            let backgroundColor = '#4CAF50'; // default green
            let borderColor = '#4CAF50';

            switch (schedule.status) {
                case 'pending':
                    backgroundColor = '#FFC107';
                    borderColor = '#FFC107';
                    break;
                case 'in_progress':
                    backgroundColor = '#2196F3';
                    borderColor = '#2196F3';
                    break;
                case 'completed':
                    backgroundColor = '#4CAF50';
                    borderColor = '#4CAF50';
                    break;
                case 'failed':
                    backgroundColor = '#F44336';
                    borderColor = '#F44336';
                    break;
                case 'success':
                    backgroundColor = '#4CAF50';
                    borderColor = '#4CAF50';
                    break;
                default:
                    backgroundColor = '#757575';
                    borderColor = '#757575';
            }

            // Format the time with AM/PM
            const formattedTime = formatTime(schedule.time);

            return {
                id: schedule.id.toString(),
                title: `${schedule.title} - ${schedule.driver_name}`,
                start: schedule.date,
                extendedProps: {
                    time: schedule.time,
                    formattedTime: formattedTime,
                    status: schedule.status,
                    type: schedule.type,
                    driver: schedule.driver_name,
                    route: schedule.route_name,
                },
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                textColor: '#ffffff',
                allDay: true,
            };
        });
    };

    // Event click handler
    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        const formattedDate = formatDate(event.startStr);

        setSelectedEvent({
            title: event.title,
            startStr: event.startStr,
            formattedDate: formattedDate,
            extendedProps: event.extendedProps as ExtendedProps,
        });
        setIsModalOpen(true);
    };

    const handleDateClick = (info: DateClickArg) => {
        const formattedDate = formatDate(info.dateStr);
        alert(`Clicked date: ${formattedDate}\n\nYou can add new collection schedules here.`);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const renderEventContent = (eventInfo: EventContentArg) => {
        const status = eventInfo.event.extendedProps.status;

        // Get status indicator color
        let indicatorColor = 'bg-green-500';
        switch (status) {
            case 'pending': indicatorColor = 'bg-yellow-500'; break;
            case 'in_progress': indicatorColor = 'bg-blue-500'; break;
            case 'completed': indicatorColor = 'bg-green-500'; break;
            case 'failed': indicatorColor = 'bg-red-500'; break;
            case 'success': indicatorColor = 'bg-green-500'; break;
            default: indicatorColor = 'bg-gray-500';
        }

        // Format the date for display on the event
        const eventDate = new Date(eventInfo.event.startStr);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleString('en-US', { month: 'short' });

        return (
            <div className="fc-event-main-frame">
                <div className="fc-event-title-container">
                    <div className="fc-event-title fc-sticky flex flex-col">
                        <div className="flex items-center mb-1">
                            <div className={`w-2 h-2 rounded-full mr-2 ${indicatorColor}`}></div>
                            <span className="font-medium text-xs">{eventInfo.event.title}</span>
                        </div>
                        <div className="text-xs text-gray-600 ml-4">
                            {day} {month}
                        </div>
                        {eventInfo.event.extendedProps.time && (
                            <div className="text-xs text-gray-600 ml-4">
                                {formatTime(eventInfo.event.extendedProps.time)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={formatEvents()}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                }}
                height="auto"
                aspectRatio={1.5}
                weekends={true}
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                initialDate={new Date()}
                navLinks={true}
                dayMaxEventRows={true}
                views={{
                    dayGridMonth: {
                        dayMaxEventRows: 3
                    }
                }}
                eventDisplay="block"
                eventContent={renderEventContent}
                style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
            />

            {/* Modal for event details */}
            <EventModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                event={selectedEvent}
            />
        </>
    );
};

export default FullCalendarComponent;