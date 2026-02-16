import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { BookOpen, Users, TrendingUp, MapPin, Brain } from 'lucide-react';
import axios from 'axios';
import AIUploadPopup from '../components/AIUploadPopup';

// Animated Counter Hook
const useAnimatedCounter = (end: number, duration: number = 2000, start: number = 0) => {
    const [count, setCount] = useState(start);
    const countRef = useRef(start);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (end === 0) return;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = timestamp - startTimeRef.current;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);

            countRef.current = current;
            setCount(current);

            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, start]);

    return count;
};

const API_URL = 'https://update-nstbuddy.onrender.com/api';

interface Campus {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    questionCount: number;
}

interface AnimatedStatsProps {
    questionCount: number;
    contributorCount: number;
}

const AnimatedStats: React.FC<AnimatedStatsProps> = ({ questionCount, contributorCount }) => {
    const animatedQuestions = useAnimatedCounter(questionCount, 2000);
    const animatedContributors = useAnimatedCounter(contributorCount, 2000);

    return (
        <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-2 text-blue-600">
                <BookOpen className="w-4 h-4" />
                <span className="font-bold text-lg">{animatedQuestions}+</span>
                <span className="text-gray-600">Questions</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
                <Users className="w-4 h-4" />
                <span className="font-bold text-lg">{animatedContributors}+</span>
                <span className="text-gray-600">Contributors</span>
            </div>
        </div>
    );
};

const CampusSelection: React.FC = () => {
    const navigate = useNavigate();
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAIUpload, setShowAIUpload] = useState(false);

    // Calculate stats for animated counters
    const totalQuestions = campuses.reduce((sum, campus) => sum + campus.questionCount, 0);
    const totalCourses = campuses.length;
    const totalSubjects = campuses.length * 12;
    const totalUsers = 1270;

    // Animated counters - must be called at top level (courses is NOT animated)
    const animatedTotalQuestions = useAnimatedCounter(totalQuestions);
    const animatedTotalSubjects = useAnimatedCounter(totalSubjects);
    const animatedTotalUsers = useAnimatedCounter(totalUsers);

    useEffect(() => {
        fetchCampuses();
    }, []);

    const fetchCampuses = async () => {
        try {
            const response = await axios.get(`${API_URL}/campuses`);
            if (response.data.success) {
                // Sort campuses by question count (descending) for ranking
                const sortedCampuses = response.data.campuses.sort(
                    (a: Campus, b: Campus) => b.questionCount - a.questionCount
                );
                setCampuses(sortedCampuses);
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

                {/* Global Statistics - Animated */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                    {/* Total Questions */}
                    <div className="p-6">
                        <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">
                            {animatedTotalQuestions}+
                        </div>
                        <div className="text-sm font-semibold text-gray-600">Questions</div>
                    </div>

                    {/* Total Courses - NO ANIMATION */}
                    <div className="p-6">
                        <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">
                            {totalCourses}+
                        </div>
                        <div className="text-sm font-semibold text-gray-600">Courses</div>
                    </div>

                    {/* Total Subjects */}
                    <div className="p-6">
                        <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">
                            {animatedTotalSubjects}+
                        </div>
                        <div className="text-sm font-semibold text-gray-600">Subjects</div>
                    </div>

                    {/* Total Users */}
                    <div className="p-6">
                        <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">
                            {animatedTotalUsers}+
                        </div>
                        <div className="text-sm font-semibold text-gray-600">Users</div>
                    </div>
                </div>

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

            {/* AI Training Contribution Button */}
            <div className="mb-12">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                                <Brain className="w-6 h-6 text-blue-600" />
                                Help Train Our AI Learning Assistant
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Contribute course materials to help us build a smarter AI model powered by Llama 3.1
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAIUpload(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                            <Brain className="w-5 h-5" />
                            Upload Materials
                        </button>
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
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow h-full flex flex-col">
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
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {campus.name}
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                                    {campus.description}
                                </p>

                                {/* Animated Stats */}
                                <AnimatedStats
                                    questionCount={campus.questionCount}
                                    contributorCount={Math.floor(campus.questionCount / 3)}
                                />

                                {/* Semester Info or Custom Course Badge */}
                                {campus.description.toLowerCase().includes('custom course') ? (
                                    <div className="mb-4 inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        Custom Course - Direct Access
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm mb-4">
                                        8 Semesters Available
                                    </div>
                                )}

                                {/* CTA - Always at bottom */}
                                <div className="mt-auto">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                        View Solutions →
                                    </button>
                                </div>
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

            {/* AI Upload Popup */}
            <AIUploadPopup
                isOpen={showAIUpload}
                onClose={() => setShowAIUpload(false)}
            />
        </Layout>
    );
};

export default CampusSelection;
