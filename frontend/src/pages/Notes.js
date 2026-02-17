import { useEffect, useState } from "react";

function Notes() {
  const tenantId = localStorage.getItem("tenantId");
  const email = localStorage.getItem("userEmail");

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);


  const fetchNotes = () => {
    fetch(`http://localhost:5000/api/notes/${tenantId}`)

      .then(res => res.json())
      .then(data => setNotes(data));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
const userPlan = localStorage.getItem("userPlan") || "Free";

if (userPlan === "Free" && notes.length >= 3) {
  alert("Free plan allows only 3 notes. Upgrade to Pro 🚀");
  return;
}


    await fetch("http://localhost:5000/api/notes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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


  const deleteNote = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/notes/delete/${id}`, {
      method: "DELETE",
    });

    fetchNotes(); // refresh notes after delete
  } catch (err) {
    console.log("Error deleting note");
  }
};


const updateNote = async (id) => {
  await fetch(`http://localhost:5000/api/notes/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  setEditingId(null);
  setTitle("");
  setContent("");
  fetchNotes();
};

  return (
    <div style={{
  padding: "40px",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e293b, #2d1b69)",
  color: "white"
}}>

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
          style={{
            marginTop: "10px",
            marginRight: "10px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Edit
        </button>

        <button
          onClick={() => deleteNote(note._id)}
          style={{
            marginTop: "10px",
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
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


const formCardStyle = {
  background: "#1f2937",
  padding: "30px",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  width: "100%",          // FULL WIDTH
  maxWidth: "800px",      // nice large editor size
  boxShadow: "0 15px 40px rgba(0,0,0,0.35)"
};


const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  background: "#111827",
  color: "white"
};

const textareaStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  background: "#111827",
  color: "white",
  minHeight: "80px",
  resize: "none"
};

const btnStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "linear-gradient(135deg, #334155, #4c1d95)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(76, 29, 149, 0.3)"
};


const noteCardStyle = {
  background: "#1f2937",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
};

export default Notes;
