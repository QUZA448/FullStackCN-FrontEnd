import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionsAPI, tagsAPI } from '../services/api';
import { useAuth } from '../hooks';

export default function HomePage() {
  const auth = useAuth();
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('newest');
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, tagsRes] = await Promise.all([
          questionsAPI.getAll({ filter, tag: selectedTag, limit: 20 }),
          tagsAPI.getAll()
        ]);
        setQuestions(questionsRes.data);
        setTags(tagsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, selectedTag]);

  if (loading) {
    return <div className="text-center py-12">Loading questions...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header with Ask Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Questions</h2>
            {auth.user && (
              <Link
                to="/ask"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ask Question
              </Link>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            {['newest', 'unanswered', 'trending'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No questions found</p>
            ) : (
              questions.map((q) => (
                <Link key={q.id} to={`/questions/${q.id}`}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                          {q.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {q.description}
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {q.tags?.map((tag) => (
                            <span
                              key={tag.id}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 flex-shrink-0">
                        <p>{q.answerCount} answers</p>
                        <p>{q.viewCount} views</p>
                        <p className="text-xs mt-1">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar - Tags */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
            <div className="space-y-2">
              {tags.slice(0, 10).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTag === tag.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                  <span className="float-right text-xs">({tag.count})</span>
                </button>
              ))}
            </div>
            <Link
              to="/tags"
              className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-800"
            >
              View all tags →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
