import { useEffect, useState } from "react";
import { FaStickyNote, FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Notes.css";

function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debug: Log token info
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");
  const userEmail = localStorage.getItem("userEmail");
  const plan = localStorage.getItem("userPlan") || "Free";

  console.log("=== Notes Page Debug ===");
  console.log("Token exists:", !!token);
  console.log("Token value:", token ? token.substring(0, 20) + "..." : "null");
  console.log("TenantId:", tenantId);
  console.log("UserEmail:", userEmail);

  // Fetch notes on mount
  useEffect(() => {
    if (!token) {
      console.log("No token found, cannot fetch notes");
      setLoading(false);
      return;
    }

    const authHeader = `Bearer ${token}`;
    console.log("Fetching notes with header:", authHeader.substring(0, 30) + "...");

    fetch("http://localhost:5000/api/notes", {
      headers: { 
        Authorization: authHeader
      }
    })
    .then(res => {
      console.log("Notes fetch response status:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("Notes fetch response data:", data);
      if (Array.isArray(data)) {
        setNotes(data);
      }
    })
    .catch(err => {
      console.error("Error fetching notes:", err);
    })
    .finally(() => setLoading(false));
  }, [token, tenantId]);

  // Create Note
  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please enter both title and content");
      return;
    }

    if (plan === "Free" && notes.length >= 3) {
      setError("Free plan allows only 3 notes. Upgrade to Pro!");
      return;
    }

    const authHeader = `Bearer ${token}`;
    console.log("Creating note with header:", authHeader.substring(0, 30) + "...");

    try {
      const res = await fetch("http://localhost:5000/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim() })
      });

      console.log("Create note response status:", res.status);
      const data = await res.json();
      console.log("Create note response:", data);

      if (!res.ok) {
        setError(data.message || "Failed to create note");
        return;
      }

      setTitle("");
      setContent("");
      setError("");
      // Refresh notes
      fetch("http://localhost:5000/api/notes", {
        headers: { Authorization: authHeader }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotes(data);
      });
    } catch (err) {
      console.error("Error creating note:", err);
      setError("Failed to create note");
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await fetch(`http://localhost:5000/api/notes/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh notes
      fetch("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotes(data);
      });
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note");
    }
  };

  // Update Note
  const updateNote = async (id) => {
    if (!title.trim() || !content.trim()) {
      setError("Please enter both title and content");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/notes/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim() })
      });

      if (!res.ok) throw new Error("Failed to update note");

      setEditingId(null);
      setTitle("");
      setContent("");
      setError("");
      // Refresh notes
      fetch("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotes(data);
      });
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to update note");
    }
  };

  const startEditing = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setError("");
  };

  const showUpgradePrompt = plan === "Free" && notes.length >= 3;

  return (
    <div className="notes-wrapper">
      <div className="notes-header">
        <h1 className="notes-title">
          <FaStickyNote className="notes-title-icon" />
          My Notes
        </h1>
        <p className="notes-subtitle">Capture and organize your thoughts</p>
        {!showUpgradePrompt && plan === "Free" && (
          <span className="notes-limit-badge">{notes.length}/3 notes (Free plan)</span>
        )}
      </div>

      {error && (
        <div className="notes-error">
          <span>{error}</span>
          <button onClick={() => setError("")} className="notes-error-close">
            <FaTimes />
          </button>
        </div>
      )}

      {showUpgradePrompt && (
        <div className="notes-upgrade-prompt">
          <div className="notes-upgrade-icon">
            <FaLock />
          </div>
          <h2>Note Limit Reached</h2>
          <p>You've reached the maximum of 3 notes on the Free plan. Upgrade to Pro to create unlimited notes!</p>
          <button 
            className="notes-upgrade-btn"
            onClick={() => navigate("/subscription")}
          >
            Upgrade to Pro <FaPlus />
          </button>
        </div>
      )}

      <div className="notes-form-card">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="notes-input"
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="notes-textarea"
        />

        {editingId ? (
          <div className="notes-form-actions">
            <button onClick={() => updateNote(editingId)} className="notes-save-btn">
              <FaCheck /> Save Changes
            </button>
            <button onClick={cancelEditing} className="notes-cancel-btn">
              <FaTimes /> Cancel
            </button>
          </div>
        ) : (
          <button onClick={createNote} className="notes-add-btn">
            <FaPlus /> Add Note
          </button>
        )}
      </div>

      {loading ? (
        <div className="notes-loading">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="notes-empty">
          <FaStickyNote className="notes-empty-icon" />
          <p>No notes yet. Create your first note above!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note._id} className="note-card">
              {editingId === note._id ? (
                <div className="note-edit-mode">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="notes-input"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="notes-textarea"
                  />
                  <div className="note-actions">
                    <button onClick={() => updateNote(note._id)} className="note-save-btn">
                      <FaCheck /> Save
                    </button>
                    <button onClick={cancelEditing} className="note-cancel-btn">
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="note-view-mode">
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-content">{note.content}</p>
                  <div className="note-actions">
                    <button onClick={() => startEditing(note)} className="note-edit-btn">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => deleteNote(note._id)} className="note-delete-btn">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
