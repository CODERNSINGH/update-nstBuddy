import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { questionsApi, noticesApi } from '../services/api';
import { Question, Notice } from '../types';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'questions' | 'notices'>('questions');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [showNoticeForm, setShowNoticeForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const navigate = useNavigate();

    // Question form state
    const [questionForm, setQuestionForm] = useState({
        questionName: '',
        subject: '',
        topic: '',
        link: '',
        semester: 4
    });

    // Notice form state
    const [noticeForm, setNoticeForm] = useState({
        title: '',
        content: '',
        priority: 'normal',
        expiresAt: ''
    });

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'questions') {
                const data = await questionsApi.getAll({ semester: 4 });
                setQuestions(data);
            } else {
                const data = await noticesApi.getAll();
                setNotices(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
    };

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingQuestion) {
                await questionsApi.update(editingQuestion.id, questionForm);
            } else {
                await questionsApi.create(questionForm);
            }
            setShowQuestionForm(false);
            setEditingQuestion(null);
            setQuestionForm({ questionName: '', subject: '', topic: '', link: '', semester: 4 });
            fetchData();
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Failed to save question');
        }
    };

    const handleNoticeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingNotice) {
                await noticesApi.update(editingNotice.id, { ...noticeForm, isActive: true });
            } else {
                await noticesApi.create(noticeForm);
            }
            setShowNoticeForm(false);
            setEditingNotice(null);
            setNoticeForm({ title: '', content: '', priority: 'normal', expiresAt: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving notice:', error);
            alert('Failed to save notice');
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (confirm('Are you sure you want to delete this question?')) {
            try {
                await questionsApi.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting question:', error);
                alert('Failed to delete question');
            }
        }
    };

    const handleDeleteNotice = async (id: string) => {
        if (confirm('Are you sure you want to delete this notice?')) {
            try {
                await noticesApi.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting notice:', error);
                alert('Failed to delete notice');
            }
        }
    };

    const startEditQuestion = (question: Question) => {
        setEditingQuestion(question);
        setQuestionForm({
            questionName: question.questionName,
            subject: question.subject,
            topic: question.topic,
            link: question.link,
            semester: question.semester
        });
        setShowQuestionForm(true);
    };

    const startEditNotice = (notice: Notice) => {
        setEditingNotice(notice);
        setNoticeForm({
            title: notice.title,
            content: notice.content,
            priority: notice.priority,
            expiresAt: notice.expiresAt ? new Date(notice.expiresAt).toISOString().split('T')[0] : ''
        });
        setShowNoticeForm(true);
    };

    return (
        <Layout>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'questions'
                            ? 'text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Questions
                </button>
                <button
                    onClick={() => setActiveTab('notices')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'notices'
                            ? 'text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Notices
                </button>
            </div>

            {/* Questions Tab */}
            {activeTab === 'questions' && (
                <div>
                    <div className="mb-6">
                        <button
                            onClick={() => {
                                setShowQuestionForm(!showQuestionForm);
                                setEditingQuestion(null);
                                setQuestionForm({ questionName: '', subject: '', topic: '', link: '', semester: 4 });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Question
                        </button>
                    </div>

                    {showQuestionForm && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-xl font-bold mb-4">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h2>
                            <form onSubmit={handleQuestionSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Name</label>
                                    <input
                                        type="text"
                                        value={questionForm.questionName}
                                        onChange={(e) => setQuestionForm({ ...questionForm, questionName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            value={questionForm.subject}
                                            onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                        <input
                                            type="text"
                                            value={questionForm.topic}
                                            onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link (Most Important)</label>
                                    <input
                                        type="url"
                                        value={questionForm.link}
                                        onChange={(e) => setQuestionForm({ ...questionForm, link: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                    >
                                        {editingQuestion ? 'Update' : 'Add'} Question
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowQuestionForm(false);
                                            setEditingQuestion(null);
                                        }}
                                        className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {questions.map((question) => (
                                        <tr key={question.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{question.questionName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{question.subject}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{question.topic}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEditQuestion(question)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteQuestion(question.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Notices Tab */}
            {activeTab === 'notices' && (
                <div>
                    <div className="mb-6">
                        <button
                            onClick={() => {
                                setShowNoticeForm(!showNoticeForm);
                                setEditingNotice(null);
                                setNoticeForm({ title: '', content: '', priority: 'normal', expiresAt: '' });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Notice
                        </button>
                    </div>

                    {showNoticeForm && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-xl font-bold mb-4">{editingNotice ? 'Edit Notice' : 'Add New Notice'}</h2>
                            <form onSubmit={handleNoticeSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={noticeForm.title}
                                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        value={noticeForm.content}
                                        onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                        <select
                                            value={noticeForm.priority}
                                            onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expires At (Optional)</label>
                                        <input
                                            type="date"
                                            value={noticeForm.expiresAt}
                                            onChange={(e) => setNoticeForm({ ...noticeForm, expiresAt: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                    >
                                        {editingNotice ? 'Update' : 'Add'} Notice
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowNoticeForm(false);
                                            setEditingNotice(null);
                                        }}
                                        className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : (
                        <div className="space-y-4">
                            {notices.map((notice) => (
                                <div key={notice.id} className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{notice.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEditNotice(notice)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNotice(notice.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-2">{notice.content}</p>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span className={`px-2 py-1 rounded ${notice.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                notice.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {notice.priority.toUpperCase()}
                                        </span>
                                        <span>{notice.isActive ? '✓ Active' : '✗ Inactive'}</span>
                                        {notice.expiresAt && (
                                            <span>Expires: {new Date(notice.expiresAt).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default AdminDashboard;
