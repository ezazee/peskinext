
import React from 'react';

export interface TrackingHistory {
    note: string;
    updated_at: string;
    status: string;
}

interface TrackingTimelineProps {
    history: TrackingHistory[];
    trackingNumber?: string;
    courier?: string;
    loading?: boolean;
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ history, trackingNumber, courier, loading }) => {
    if (loading) {
        return <div className="p-4 text-center text-gray-500">Memuat data tracking...</div>;
    }

    if (!history || history.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-600 font-medium">Belum ada riwayat pengiriman.</p>
                {trackingNumber && <p className="text-sm text-gray-400 mt-1">Resi: {trackingNumber}</p>}
            </div>
        );
    }

    return (
        <div className="w-full p-4 bg-white rounded-lg border border-gray-100">
            <div className="mb-4 pb-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-gray-800">Lacak Pengiriman</h3>
                    <p className="text-sm text-gray-500">{courier} - {trackingNumber}</p>
                </div>
            </div>

            <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                {history.map((event, index) => {
                    const isLatest = index === 0;
                    const date = new Date(event.updated_at).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'short', year: 'numeric'
                    });
                    const time = new Date(event.updated_at).toLocaleTimeString("id-ID", {
                        hour: '2-digit', minute: '2-digit'
                    });

                    return (
                        <div key={index} className="relative">
                            {/* Dot */}
                            <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 ${isLatest ? 'bg-primary border-primary' : 'bg-gray-300 border-white'}`}></div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                <div className="flex-1">
                                    <p className={`text-sm ${isLatest ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                        {event.note}
                                    </p>
                                    <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500">
                                        {event.status}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400 whitespace-nowrap mt-1 sm:mt-0 text-right">
                                    <div>{date}</div>
                                    <div>{time}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackingTimeline;
