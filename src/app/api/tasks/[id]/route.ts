import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT /api/tasks/[id] — Update a single task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { text, dateKey, order } = body;

    const updateFields: Record<string, unknown> = {};
    if (text !== undefined) updateFields.text = text.trim();
    if (dateKey !== undefined) updateFields.dateKey = dateKey;
    if (order !== undefined) updateFields.order = order;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const result = await db.collection("tasks").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: result._id.toString(),
      text: result.text,
      dateKey: result.dateKey,
      order: result.order,
      createdAt: result.createdAt,
    });
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] — Delete a single task
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
