import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";
import "./PostDetails.css";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL માંથી postId મેળવવું

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch single post
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/posts/${id}`);

      if (!response.ok) {
        throw new Error("Post not found");
      }

      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load post");
      navigate("/dashboard"); // Post ન મળી તો dashboard પર પાછા જાવ
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleBackClick = () => {
    navigate("/dashboard"); // Correct path
  };

  if (loading) {
    return (
      <div className="post-details-page">
        <Navbar />
        <div className="loading-state">Loading post...</div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="post-details-page">
      <Navbar />
      <main className="post-details-container">
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft /> Back to Feed
        </button>

        <article className="full-post">
          <header className="post-header">
            <div className="post-category">{post.category || "Journal"}</div>
            <h1 className="full-post-title">{post.title}</h1>

            <div className="post-author-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {post.author?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <span className="author-name">{post.author || "Anonymous"}</span>
                  <div className="post-date-row">
                    <span>
                      <FaCalendarAlt />{" "}
                      {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <span>
                      <FaClock /> 5 min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="post-featured-image">
            <img
              src={
                post.image ||
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000"
              }
              alt={post.title}
            />
          </div>

          <div className="post-body">
            <p>{post.description || post.content || post.excerpt}</p>
          </div>

          <footer className="post-footer">
            <div className="post-share">
              <span>Share this story:</span>
              <div className="share-buttons">
                <button
                  className="share-btn"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        post.title
                      )}&url=${window.location.href}`,
                      "_blank"
                    )
                  }
                >
                  Twitter
                </button>

                <button
                  className="share-btn"
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
                      "_blank"
                    )
                  }
                >
                  LinkedIn
                </button>

                <button
                  className="share-btn"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
};

export default PostDetails;
