import { useEffect, useState } from "react";

function Notes() {
  const tenantId = localStorage.getItem("tenantId");
  const token = localStorage.getItem("token");
  const plan = localStorage.getItem("userPlan") || "Free";

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ==============================
  // FETCH NOTES
  // ==============================
  const fetchNotes = () => {
    if (!token) return;

    fetch("http://localhost:5000/api/notes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotes(data);
        } else {
          setNotes([]);
        }
      })
      .catch(() => setNotes([]));
  };

  useEffect(() => {
    fetchNotes();
  }, [tenantId]);

  // ==============================
  // CREATE NOTE
  // ==============================
  const createNote = async () => {
    if (plan === "Free" && notes.length >= 3) {
      alert("Free plan allows only 3 notes. Upgrade to Pro 🚀");
      return;
    }

    await fetch("http://localhost:5000/api/notes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        tenantId,
        title,
        content
      })
    });

    setTitle("");
    setContent("");
    fetchNotes();
  };

  // ==============================
  // DELETE NOTE
  // ==============================
  const deleteNote = async (id) => {
    await fetch(`http://localhost:5000/api/notes/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchNotes();
  };

  // ==============================
  // UPDATE NOTE
  // ==============================
  const updateNote = async (id) => {
    await fetch(`http://localhost:5000/api/notes/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });

    setEditingId(null);
    setTitle("");
    setContent("");
    fetchNotes();
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: "30px" }}>📝 My Notes</h1>

      <div style={formCardStyle}>
        <input
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textareaStyle}
        />

        <button onClick={createNote} style={btnStyle}>
          + Add Note
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        {notes.map((note) => (
          <div key={note._id} style={noteCardStyle}>
            {editingId === note._id ? (
              <>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={textareaStyle}
                />
                <button onClick={() => updateNote(note._id)} style={btnStyle}>
                  Save
                </button>
              </>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p style={{ color: "#9ca3af" }}>{note.content}</p>

                <button
                  onClick={() => {
                    setEditingId(note._id);
                    setTitle(note.title);
                    setContent(note.content);
                  }}
                  style={editBtn}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNote(note._id)}
                  style={deleteBtn}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle = {
  padding: "40px",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
  color: "white",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const formCardStyle = {
  background: "linear-gradient(145deg, #1e293b, #334155)",
  padding: "35px",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  maxWidth: "800px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)"
};

const inputStyle = {
  padding: "16px 20px",
  borderRadius: "12px",
  border: "2px solid transparent",
  background: "linear-gradient(145deg, #0f172a, #1e293b)",
  color: "white",
  fontSize: "16px",
  transition: "all 0.3s ease",
  outline: "none",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
};

const textareaStyle = {
  padding: "16px 20px",
  borderRadius: "12px",
  border: "2px solid transparent",
  background: "linear-gradient(145deg, #0f172a, #1e293b)",
  color: "white",
  fontSize: "16px",
  minHeight: "150px",
  resize: "vertical",
  transition: "all 0.3s ease",
  outline: "none",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
};

const btnStyle = {
  padding: "16px 32px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
  color: "white",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
  textTransform: "uppercase",
  letterSpacing: "1px"
};

const noteCardStyle = {
  background: "linear-gradient(145deg, #1e293b, #334155)",
  padding: "30px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.08)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden"
};

const editBtn = {
  marginTop: "15px",
  marginRight: "12px",
  padding: "10px 20px",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
};

const deleteBtn = {
  marginTop: "15px",
  padding: "10px 20px",
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
};

export default Notes;

