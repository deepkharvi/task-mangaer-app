"use client"

import { useEffect, useState } from "react"

export default function Home() {

  const [notes, setNotes] = useState<Note[]>([])
  const [text, setText] = useState("")
  const [hide, setHide] = useState(false)
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)


  // LOAD NOTES
  async function loadNotes() {
    const res = await fetch("/api/notes")
    const data = await res.json()
    setNotes(data)
  }


  // ADD NOTE
  async function addNote() {

    if (!text.trim()) return

    await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    })

    setText("")
    loadNotes()
  }


  // DELETE NOTE
  async function deleteNote(id: number) {

    await fetch(`/api/notes?id=${id}`, {
      method: "DELETE"
    })

    loadNotes()
  }


  // UPDATE NOTE
  async function updateNote(id: number) {

    if (!text.trim()) return

    await fetch("/api/notes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, text })
    })

    setText("")
    setEditingId(null)
    loadNotes()
  }


  useEffect(() => {
    loadNotes()
  }, [])


  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  )


  return (

    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-10">

      <h1 className="text-4xl font-bold mb-6 text-cyan-400">
        Neon Note Manager
      </h1>


      {/* ADD NOTE */}
      <div className="flex gap-2 mb-6">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add note..."
          className="p-2 rounded bg-white text-black"
        />

        <button
          onClick={() => editingId ? updateNote(editingId) : addNote()}
          className="bg-cyan-500 px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>

      </div>


      {/* SEARCH */}
      <input
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 w-64 rounded bg-white text-black outline-none mb-6"
      />


      {/* HIDE NOTES */}
      <label className="mb-6">
        <input
          type="checkbox"
          checked={hide}
          onChange={() => setHide(!hide)}
        />
        <span className="ml-2">Hide Notes</span>
      </label>


      {/* NOTES LIST */}
      {!hide && (

        <ul className="w-96">

          {filteredNotes.map((note) => (
            <li
              key={note.id}
              className="bg-gray-800 p-3 mb-3 rounded flex justify-between items-center"
            >

              <span>{note.text}</span>

              <div className="flex gap-3">

                <button
                  onClick={() => {
                    setText(note.text)
                    setEditingId(note.id)
                  }}
                  className="text-yellow-400"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-400"
                >
                  Delete
                </button>

              </div>

            </li>
          ))}

        </ul>

      )}

    </div>

  )

}