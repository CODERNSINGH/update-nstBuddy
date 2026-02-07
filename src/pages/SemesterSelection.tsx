import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { BookOpen, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://update-nstbuddy.onrender.com/api';

interface SemesterStat {
    semester: number;
    questionCount: number;
}

interface CampusInfo {
    id: string;
    name: string;
    slug: string;
}

const SemesterSelection: React.FC = () => {
    const { campusSlug } = useParams<{ campusSlug: string }>();
    const navigate = useNavigate();
    const [campus, setCampus] = useState<CampusInfo | null>(null);
    const [semesters, setSemesters] = useState<SemesterStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSemesterStats();
    }, [campusSlug]);

    const fetchSemesterStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/campuses/${campusSlug}/semesters`);
            if (response.data.success) {
                setCampus(response.data.campus);
                setSemesters(response.data.semesters);
            }
        } catch (error) {
            console.error('Error fetching semester stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSemesterColor = (semester: number) => {
        const colors = [
            'from-red-500 to-orange-500',
            'from-orange-500 to-yellow-500',
            'from-yellow-500 to-green-500',
            'from-green-500 to-teal-500',
            'from-teal-500 to-blue-500',
            'from-blue-500 to-indigo-500',
            'from-indigo-500 to-blue-500',
            'from-blue-500 to-pink-500'
        ];
        return colors[semester - 1] || 'from-gray-500 to-gray-700';
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    if (!campus) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Campus not found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        ← Back to campuses
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Campuses
                </button>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
                    {campus.name}
                </h1>
                <p className="text-gray-600 text-lg">
                    Select a semester to view questions
                </p>
            </div>

            {/* Semester Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {semesters.map((semesterStat) => (
                    <div
                        key={semesterStat.semester}
                        onClick={() => navigate(`/campus/${campusSlug}/semester/${semesterStat.semester}`)}
                        className="group cursor-pointer"
                    >
                        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-black hover:shadow-xl transition-all duration-200">
                            {/* Semester Header - Clean Black/White */}
                            <div className="bg-black h-28 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-900 transition-colors">
                                <div className="text-center text-white">
                                    <div className="text-5xl font-black mb-1">
                                        {semesterStat.semester}
                                    </div>
                                    <div className="text-xs font-medium tracking-wider uppercase opacity-80">
                                        Semester
                                    </div>
                                </div>
                            </div>

                            {/* Semester Info */}
                            <div className="p-4 bg-white">
                                <div className="flex items-center justify-center gap-2 text-gray-700">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-semibold text-sm">
                                        {semesterStat.questionCount} Questions
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contribute CTA - Professional Design */}
            <div className="mt-12 bg-black rounded-xl p-8 text-center border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-2">
                    Want to contribute?
                </h3>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Share questions for {campus.name} and help your peers!
                </p>
                <button
                    onClick={() => navigate('/contribute')}
                    className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 rounded-lg transition-colors"
                >
                    Contribute Questions
                </button>
            </div>
        </Layout>
    );
};

export default SemesterSelection;
