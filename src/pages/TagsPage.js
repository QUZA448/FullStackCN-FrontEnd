import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tagsAPI } from '../services/api';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagsAPI.getAll();
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading tags...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Tags</h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.length === 0 ? (
          <p className="col-span-full text-gray-500 text-center py-8">No tags found</p>
        ) : (
          filteredTags.map((tag) => (
            <Link key={tag.id} to={`/tags/${tag.name}`}>
              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                  {tag.name}
                </h3>
                {tag.description && (
                  <p className="text-gray-600 text-sm mt-1">{tag.description}</p>
                )}
                <div className="mt-3 text-sm text-gray-500">
                  {tag.count} questions
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
