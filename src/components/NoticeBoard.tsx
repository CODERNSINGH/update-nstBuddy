import React, { useEffect, useState } from 'react';
import { noticesApi } from '../services/api';
import { Notice } from '../types';
import { Bell, AlertCircle, Info, AlertTriangle, Clock, Calendar } from 'lucide-react';

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

    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'high':
                return {
                    icon: AlertCircle,
                    gradient: 'from-red-500 to-red-600',
                    bgColor: 'bg-red-50',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    badgeColor: 'bg-red-500 text-white',
                    borderColor: 'border-red-200'
                };
            case 'normal':
                return {
                    icon: Info,
                    gradient: 'from-blue-500 to-blue-600',
                    bgColor: 'bg-blue-50',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    badgeColor: 'bg-blue-500 text-white',
                    borderColor: 'border-blue-200'
                };
            case 'low':
                return {
                    icon: AlertTriangle,
                    gradient: 'from-amber-500 to-amber-600',
                    bgColor: 'bg-amber-50',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    badgeColor: 'bg-amber-500 text-white',
                    borderColor: 'border-amber-200'
                };
            default:
                return {
                    icon: Info,
                    gradient: 'from-gray-500 to-gray-600',
                    bgColor: 'bg-gray-50',
                    iconBg: 'bg-gray-100',
                    iconColor: 'text-gray-600',
                    badgeColor: 'bg-gray-500 text-white',
                    borderColor: 'border-gray-200'
                };
        }
    };

    if (loading) {
        return null;
    }

    if (notices.length === 0) {
        return null;
    }

    return (
        <div className="mb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-purple-200">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl blur-sm opacity-75"></div>
                        <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-2xl shadow-lg">
                            <Bell className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">Notice Board</h2>
                        <p className="text-sm text-gray-600">Important announcements and updates</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                        {notices.length} Active Notice{notices.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Notices Grid */}
            <div className="space-y-5">
                {notices.map((notice) => {
                    const config = getPriorityConfig(notice.priority);
                    const Icon = config.icon;

                    return (
                        <div
                            key={notice.id}
                            className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-5">
                                    {/* Icon */}
                                    <div className={`${config.iconBg} ${config.iconColor} flex-shrink-0 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-7 h-7" strokeWidth={2.5} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <h3 className="font-bold text-gray-900 text-2xl leading-tight">
                                                {notice.title}
                                            </h3>
                                            <span className={`${config.badgeColor} text-xs font-bold px-3 py-1.5 rounded-full uppercase flex-shrink-0 shadow-sm`}>
                                                {notice.priority}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-5 text-base">
                                            {notice.content}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center gap-6 text-sm text-gray-600 bg-white bg-opacity-60 rounded-lg px-4 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium">Posted {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}</span>
                                            </div>
                                            {notice.expiresAt && (
                                                <>
                                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        <span className="font-medium">Expires {new Date(notice.expiresAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NoticeBoard;
