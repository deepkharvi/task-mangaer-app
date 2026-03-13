import { NextResponse } from "next/server"
import { sql } from "@/lib/db"


// GET NOTES
export async function GET() {

    const notes = await sql`
SELECT * FROM notes ORDER BY id DESC
`

    return NextResponse.json(notes)

}


// ADD NOTE
export async function POST(req: Request) {

    const { text } = await req.json()

    await sql`
INSERT INTO notes (text) VALUES (${text})
`

    return NextResponse.json({ message: "Note added" })

}


// UPDATE NOTE
export async function PUT(req: Request) {

    const { id, text } = await req.json()

    await sql`
UPDATE notes SET text=${text} WHERE id=${id}
`

    return NextResponse.json({ message: "Note updated" })

}


// DELETE NOTE
export async function DELETE(req: Request) {

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    await sql`
DELETE FROM notes WHERE id=${id}
`

    return NextResponse.json({ message: "Note deleted" })

}