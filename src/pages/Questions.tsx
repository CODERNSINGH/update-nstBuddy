import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { BookOpen, ArrowLeft, ExternalLink, User, Search } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://update-nstbuddy.onrender.com/api';

interface Question {
    id: string;
    questionName: string;
    subject: string;
    topic: string;
    link: string;
    semester: number;
    campus: {
        name: string;
        slug: string;
    };
    contributor: {
        name: string;
        email: string;
        picture?: string;
    };
    createdAt: string;
}

const Questions: React.FC = () => {
    const { campusSlug, semesterId } = useParams<{ campusSlug: string; semesterId: string }>();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [subjects, setSubjects] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        fetchQuestions();
        fetchFilters();
    }, [campusSlug, semesterId, selectedSubject]);

    const fetchQuestions = async () => {
        try {
            const params: any = {
                campus: campusSlug,
                semester: semesterId
            };
            if (selectedSubject) {
                params.subject = selectedSubject;
            }

            const response = await axios.get(`${API_URL}/questions`, { params });
            if (response.data.success) {
                setQuestions(response.data.questions);
            }
        } catch (error) {
            // Error fetching questions silently
        } finally {
            setLoading(false);
        }
    };

    const fetchFilters = async () => {
        try {
            const response = await axios.get(`${API_URL}/questions/filters`, {
                params: { campus: campusSlug, semester: semesterId }
            });
            if (response.data.success) {
                setSubjects(response.data.subjects);
            }
        } catch (error) {
            // Error fetching filters silently
        }
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

    return (
        <Layout>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(`/campus/${campusSlug}`)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Semesters
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Semester {semesterId}
                        </h1>
                        <p className="text-gray-600">
                            {questions[0]?.campus.name || 'Campus'} - {questions.length} Questions
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/contribute')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        + Add Question
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search questions by name, subject, or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            {/* Filters */}
            {subjects.length > 0 && (
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedSubject('')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${!selectedSubject
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Subjects
                        </button>
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedSubject === subject
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Questions List */}
            {questions.filter(q =>
                q.questionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.topic.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No questions yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Be the first to contribute questions for this semester!
                    </p>
                    <button
                        onClick={() => navigate('/contribute')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Contribute Now
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.filter(q =>
                        q.questionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.topic.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((question) => (
                        <div
                            key={question.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {question.questionName}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="px-3 py-1 bg-purple-100 text-blue-700 rounded-full text-sm font-medium">
                                            {question.subject}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {question.topic}
                                        </span>
                                    </div>
                                </div>
                                <a
                                    href={question.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    View
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Contributor Info */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    {question.contributor.picture ? (
                                        <img
                                            src={question.contributor.picture}
                                            alt={question.contributor.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-400" />
                                    )}
                                    <span>
                                        Contributed by <span className="font-medium text-gray-900">{question.contributor.name}</span>
                                    </span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(question.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Questions;
