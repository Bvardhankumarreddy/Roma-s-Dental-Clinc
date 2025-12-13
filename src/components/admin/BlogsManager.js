import React, { useState, useEffect } from 'react';
import { blogsAPI } from '../../utils/api';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'dental-care',
    author: 'Dr. Roma',
    link: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const result = await blogsAPI.getAll();
      if (result.success) {
        setBlogs(result.blogs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'dental-care',
      author: 'Dr. Roma',
      link: ''
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      category: blog.category,
      author: blog.author,
      link: blog.link || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let result;
      if (editingBlog) {
        result = await blogsAPI.update(editingBlog.blogId, formData, selectedFile);
      } else {
        result = await blogsAPI.create(formData, selectedFile);
      }
      
      if (result.success) {
        loadBlogs();
        setShowModal(false);
      } else {
        alert(result.message || 'Failed to save blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    }
  };

  const deleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const result = await blogsAPI.delete(blogId);
        if (result.success) {
          loadBlogs();
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Blogs Management</h2>
        <button
          onClick={openCreateModal}
          className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 font-medium"
        >
          + Create Blog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.blogId} className="bg-white rounded-lg shadow overflow-hidden">
            {blog.imageUrl && (
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{blog.author}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(blog)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBlog(blog.blogId)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingBlog ? 'Edit Blog' : 'Create New Blog'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  rows="8"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Excerpt (Summary)</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  rows="2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Blog Link (URL)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  placeholder="https://example.com/blog-post"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="dental-care">Dental Care</option>
                    <option value="oral-health">Oral Health</option>
                    <option value="treatments">Treatments</option>
                    <option value="tips">Tips</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
                >
                  {editingBlog ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsManager;
