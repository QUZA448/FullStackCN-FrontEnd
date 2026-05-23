import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI } from '../services/api';

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, qRes, aRes] = await Promise.all([
          usersAPI.getProfile(id),
          usersAPI.getQuestions(id),
          usersAPI.getAnswers(id)
        ]);
        setUser(userRes.data);
        setQuestions(qRes.data);
        setAnswers(aRes.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-12 text-red-600">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {user.username[0].toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
            
            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-2xl font-bold text-blue-600">{user.reputation || 0}</p>
                <p className="text-sm text-gray-600">Reputation</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{answers.length}</p>
                <p className="text-sm text-gray-600">Answers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'questions'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Questions ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`pb-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'answers'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Answers ({answers.length})
          </button>
        </div>
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No questions yet</p>
          ) : (
            questions.map((q) => (
              <a key={q.id} href={`/questions/${q.id}`}>
                <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                    {q.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {q.description}
                  </p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span>{q.answerCount} answers</span>
                    <span>{q.viewCount} views</span>
                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      )}

      {/* Answers Tab */}
      {activeTab === 'answers' && (
        <div className="space-y-4">
          {answers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No answers yet</p>
          ) : (
            answers.map((a) => (
              <a key={a.id} href={`/questions/${a.questionId}`}>
                <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                    {a.questionTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {a.content}
                  </p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span>{a.upvotes || 0} upvotes</span>
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
