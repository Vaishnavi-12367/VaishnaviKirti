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
    if (!tenantId) return;

    fetch(`http://localhost:5000/api/notes/${tenantId}`, {
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
  background: "linear-gradient(135deg, #1e293b, #2d1b69)",
  color: "white"
};

const formCardStyle = {
  background: "#1f2937",
  padding: "30px",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  maxWidth: "800px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.35)"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#111827",
  color: "white"
};

const textareaStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#111827",
  color: "white",
  minHeight: "120px",
  resize: "none"
};

const btnStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer"
};

const noteCardStyle = {
  background: "#1f2937",
  padding: "25px",
  borderRadius: "14px",
  marginBottom: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
};

const editBtn = {
  marginTop: "10px",
  marginRight: "10px",
  padding: "8px 12px",
  background: "#3b82f6",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer"
};

const deleteBtn = {
  marginTop: "10px",
  padding: "8px 12px",
  background: "#ef4444",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer"
};

export default Notes;

