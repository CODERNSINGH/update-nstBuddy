import React, { useEffect, useState } from 'react';
import { noticesApi } from '../services/api';
import { Notice } from '../types';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NoticeBoard: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotices();
        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchNotices, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotices = async () => {
        try {
            const data = await noticesApi.getActive();
            setNotices(data);
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'normal':
                return <Info className="w-5 h-5 text-blue-500" />;
            case 'low':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-red-500 bg-red-50';
            case 'normal':
                return 'border-blue-500 bg-blue-50';
            case 'low':
                return 'border-yellow-500 bg-yellow-50';
            default:
                return 'border-blue-500 bg-blue-50';
        }
    };

    if (loading) {
        return (
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📢 Notice Board</h2>
                <div className="text-center py-4">
                    <p className="text-gray-500">Loading notices...</p>
                </div>
            </div>
        );
    }

    if (notices.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📢 Notice Board</h2>
            <div className="space-y-4">
                {notices.map((notice) => (
                    <div
                        key={notice.id}
                        className={`border-l-4 p-4 rounded-lg shadow-sm ${getPriorityColor(notice.priority)}`}
                    >
                        <div className="flex items-start gap-3">
                            {getPriorityIcon(notice.priority)}
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{notice.title}</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Posted: {new Date(notice.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard;
