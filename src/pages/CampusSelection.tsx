import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { BookOpen, Users, TrendingUp, MapPin } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://update-nstbuddy.onrender.com/api';

interface Campus {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    questionCount: number;
}

const CampusSelection: React.FC = () => {
    const navigate = useNavigate();
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampuses();
    }, []);

    const fetchCampuses = async () => {
        try {
            const response = await axios.get(`${API_URL}/campuses`);
            if (response.data.success) {
                setCampuses(response.data.campuses);
            }
        } catch (error) {
            // Error fetching campuses silently
        } finally {
            setLoading(false);
        }
    };

    const getCampusGradient = (slug: string) => {
        const gradients = {
            'delhi-ncr': 'from-purple-500 to-pink-500',
            'pune': 'from-blue-500 to-cyan-500',
            'bangalore': 'from-green-500 to-emerald-500'
        };
        return gradients[slug as keyof typeof gradients] || 'from-gray-500 to-gray-700';
    };

    const getCampusIcon = (slug: string) => {
        const icons = {
            'delhi-ncr': '🏛️',
            'pune': '🌆',
            'bangalore': '🌳'
        };
        return icons[slug as keyof typeof icons] || '🎓';
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Welcome to <span className="text-blue-600">NST Buddy 2.0</span>
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                    Your collaborative learning platform across all NST campuses
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span>3 Campuses</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span>8 Semesters Each</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>Community Driven</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span>Win up to ₹5,000</span>
                    </div>
                </div>
            </div>

            {/* Campus Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {campuses.map((campus) => (
                    <div
                        key={campus.id}
                        onClick={() => navigate(`/campus/${campus.slug}`)}
                        className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                            {/* Campus Image */}
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                {campus.imageUrl ? (
                                    <img
                                        src={campus.imageUrl}
                                        alt={campus.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className={`h-full w-full bg-gradient-to-br ${getCampusGradient(campus.slug)} flex items-center justify-center`}>
                                        <span className="text-7xl transform group-hover:scale-110 transition-transform">
                                            {getCampusIcon(campus.slug)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Campus Info */}
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {campus.name}
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    {campus.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="font-semibold">{campus.questionCount} Questions</span>
                                    </div>
                                    <div className="text-gray-500">
                                        8 Semesters
                                    </div>
                                </div>

                                {/* CTA */}
                                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                    View Solutions →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Call to Action */}
            <div className="bg-black rounded-2xl p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Start Contributing Today!</h2>
                <p className="text-lg mb-6 opacity-90">
                    Share your knowledge, help your peers, and win exciting prizes up to ₹5,000
                </p>
                <button
                    onClick={() => navigate('/contribute')}
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                    <TrendingUp className="w-5 h-5" />
                    Contribute Now
                </button>
            </div>
        </Layout>
    );
};

export default CampusSelection;
