import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import { Trophy, TrendingUp, Award, Star, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://update-nstbuddy.onrender.com/api';

interface Campus {
    id: string;
    name: string;
    slug: string;
}

interface LeaderboardEntry {
    rank: number;
    name: string;
    picture?: string;
    contributionCount: number;
    contributionPoints: number;
}

const ContributePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        campusSlug: '',
        semester: '',
        questionName: '',
        subject: '',
        topic: '',
        link: ''
    });

    useEffect(() => {
        fetchCampuses();
        fetchLeaderboard();
    }, []);

    const fetchCampuses = async () => {
        try {
            const response = await axios.get(`${API_URL}/campuses`);
            if (response.data.success) {
                setCampuses(response.data.campuses);
            }
        } catch (error) {
            console.error('Error fetching campuses:', error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get(`${API_URL}/contributions/leaderboard?limit=10`);
            if (response.data.success) {
                setLeaderboard(response.data.leaderboard);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to contribute');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // Get Firebase ID token from current user
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) {
                alert('Please login to contribute');
                navigate('/login');
                return;
            }

            const token = await firebaseUser.getIdToken();

            // Check for duplicate question title
            const checkResponse = await axios.get(
                `${API_URL}/questions?campusSlug=${formData.campusSlug}&semester=${formData.semester}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (checkResponse.data.success) {
                const existingQuestion = checkResponse.data.questions.find(
                    (q: any) => q.questionName.toLowerCase() === formData.questionName.toLowerCase()
                );

                if (existingQuestion) {
                    alert('⚠️ A question with this title already exists! Please use a different title.');
                    setLoading(false);
                    return;
                }
            }

            const response = await axios.post(
                `${API_URL}/questions/contribute`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess(true);
                setFormData({
                    campusSlug: '',
                    semester: '',
                    questionName: '',
                    subject: '',
                    topic: '',
                    link: ''
                });
                fetchLeaderboard(); // Refresh leaderboard
                setTimeout(() => setSuccess(false), 5000);
            }
        } catch (error: any) {
            console.error('Error contributing question:', error);
            alert(error.response?.data?.error || 'Failed to contribute question');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Layout>
            {/* Prize Banner - Professional White/Black Theme */}
            <div className="mb-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-8 relative overflow-hidden border border-gray-700 shadow-2xl">
                {/* Subtle geometric patterns */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-32 -mb-32"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                    <div className="absolute top-0 left-0 w-2 h-2 bg-white/20 rounded-full"></div>
                    <div className="absolute top-10 right-20 w-1 h-1 bg-white/30 rounded-full"></div>
                    <div className="absolute bottom-10 left-20 w-1.5 h-1.5 bg-white/25 rounded-full"></div>
                </div>

                <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
                            <div className="absolute inset-0 blur-xl bg-yellow-400/30"></div>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                        Win Exciting Prizes
                    </h2>
                    <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Gifts Worth</p>
                        <p className="text-5xl md:text-6xl font-black text-white tracking-tight">
                            ₹5,000
                        </p>
                    </div>
                    <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-4">
                        Contribute questions, help your peers, and climb the leaderboard to win amazing rewards
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                        Special thanks to{' '}
                        <a
                            href="https://linkedin.com/in/pranav-singh-developer/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline font-medium"
                        >
                            Pranav Singh
                        </a>
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm text-white font-medium">10 points per question</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                            <Award className="w-5 h-5 text-blue-400" />
                            <span className="text-sm text-white font-medium">Monthly rewards</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-white font-medium">Top 10 winners</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contribution Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Contribute a Question
                        </h2>

                        {success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                ✅ Question contributed successfully! You earned 10 points!
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Campus Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Campus *
                                </label>
                                <select
                                    name="campusSlug"
                                    value={formData.campusSlug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Campus</option>
                                    {campuses.map((campus) => (
                                        <option key={campus.id} value={campus.slug}>
                                            {campus.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Semester Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Semester *
                                </label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Question Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Question Title *
                                </label>
                                <input
                                    type="text"
                                    name="questionName"
                                    value={formData.questionName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Data Structures Assignment 1"
                                    required
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Data Structures"
                                    required
                                />
                            </div>

                            {/* Topic */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Topic *
                                </label>
                                <input
                                    type="text"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Arrays and Linked Lists"
                                    required
                                />
                            </div>

                            {/* Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link to Question *
                                </label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                    required
                                />
                            </div>

                            {/* Contributor Email (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                    readOnly
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Your email will be shown as the contributor
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Checking & Submitting...</span>
                                    </>
                                ) : (
                                    'Contribute Question'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Top Contributors
                        </h3>

                        <div className="space-y-3">
                            {leaderboard.map((entry) => (
                                <div
                                    key={entry.rank}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${entry.rank <= 3
                                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                                        : 'bg-gray-50'
                                        }`}
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${entry.rank === 1 ? 'bg-yellow-400 text-white' :
                                        entry.rank === 2 ? 'bg-gray-300 text-white' :
                                            entry.rank === 3 ? 'bg-orange-400 text-white' :
                                                'bg-gray-200 text-gray-600'
                                        }`}>
                                        {entry.rank}
                                    </div>
                                    {entry.picture ? (
                                        <img
                                            src={entry.picture}
                                            alt={entry.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-blue-700 font-semibold">
                                            {entry.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {entry.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {entry.contributionPoints} points
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContributePage;
