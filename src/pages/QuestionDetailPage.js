import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionsAPI, answersAPI, votesAPI } from '../services/api';
import { useAuth } from '../hooks';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await questionsAPI.getById(id);
        setQuestion(response.data);
        setAnswers(response.data.answers || []);
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleVote = async (targetId, targetType, voteType) => {
    if (!auth.user) {
      navigate('/login');
      return;
    }

    try {
      await votesAPI.vote({ targetId, targetType, voteType });
      // Refresh question
      const response = await questionsAPI.getById(id);
      setQuestion(response.data);
      setAnswers(response.data.answers || []);
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!auth.user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await answersAPI.create(id, { content: answerContent });
      setAnswerContent('');
      // Refresh
      const response = await questionsAPI.getById(id);
      setQuestion(response.data);
      setAnswers(response.data.answers || []);
    } catch (error) {
      console.error('Failed to post answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkBest = async (answerId) => {
    try {
      await answersAPI.markBest(answerId);
      const response = await questionsAPI.getById(id);
      setQuestion(response.data);
      setAnswers(response.data.answers || []);
    } catch (error) {
      console.error('Failed to mark best answer:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading question...</div>;
  }

  if (!question) {
    return <div className="text-center py-12 text-red-600">Question not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Question */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{question.title}</h1>
        
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>Asked {new Date(question.createdAt).toLocaleDateString()} by {question.user?.username}</span>
          <span>{question.viewCount} views</span>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleVote(question.id, 'question', 'upvote')}
            className="flex flex-col items-center px-4 py-2 rounded hover:bg-gray-100"
          >
            <span className="text-2xl">👍</span>
            <span className="text-sm">{question.upvotes || 0}</span>
          </button>
          <button
            onClick={() => handleVote(question.id, 'question', 'downvote')}
            className="flex flex-col items-center px-4 py-2 rounded hover:bg-gray-100"
          >
            <span className="text-2xl">👎</span>
            <span className="text-sm">{question.downvotes || 0}</span>
          </button>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-800 whitespace-pre-wrap">{question.description}</p>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {question.tags?.map((tag) => (
            <span key={tag.id} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded">
              {tag.name}
            </span>
          ))}
        </div>

        {auth.user?.id === question.userId && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate(`/questions/${id}/edit`)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Edit
            </button>
            <button
              onClick={() => questionsAPI.delete(id).then(() => navigate('/'))}
              className="px-4 py-2 bg-red-200 text-red-700 rounded hover:bg-red-300"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{answers.length} Answers</h2>
        
        <div className="space-y-4">
          {answers.map((answer) => (
            <div key={answer.id} className="p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => handleVote(answer.id, 'answer', 'upvote')}
                    className="text-2xl"
                  >
                    👍
                  </button>
                  <span className="text-sm">{answer.upvotes || 0}</span>
                  <button
                    onClick={() => handleVote(answer.id, 'answer', 'downvote')}
                    className="text-2xl"
                  >
                    👎
                  </button>
                  {answer.isMarkedBest && (
                    <span className="mt-2 text-green-600 text-xs font-bold">✓ Best</span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-gray-800 whitespace-pre-wrap">{answer.content}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    Answered by {answer.user?.username} • {new Date(answer.createdAt).toLocaleDateString()}
                  </div>

                  {auth.user?.id === question.userId && !answer.isMarkedBest && (
                    <button
                      onClick={() => handleMarkBest(answer.id)}
                      className="mt-2 px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                    >
                      Mark as best
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Answer */}
      {auth.user ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Your Answer</h3>
          <form onSubmit={handlePostAnswer}>
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Answer'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-gray-700">
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              Sign in
            </a>
            {' '}to post an answer
          </p>
        </div>
      )}
    </div>
  );
}
