import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT /api/tasks/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { text, dateKey, order, time, isMeeting, notes, label, meetingLink } = body;

    const updateFields: Record<string, unknown> = {};
    if (text !== undefined) updateFields.text = text.trim();
    if (dateKey !== undefined) updateFields.dateKey = dateKey;
    if (order !== undefined) updateFields.order = order;
    if (time !== undefined) updateFields.time = time;
    if (isMeeting !== undefined) updateFields.isMeeting = isMeeting;
    if (notes !== undefined) updateFields.notes = notes;
    if (label !== undefined) updateFields.label = label;
    if (meetingLink !== undefined) updateFields.meetingLink = meetingLink;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const result = await db.collection("tasks").findOneAndUpdate(
      { _id: new ObjectId(id) },
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
      time: result.time,
      isMeeting: result.isMeeting,
      notes: result.notes,
      label: result.label,
      meetingLink: result.meetingLink,
    });
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { db } = await connectToDatabase();
    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
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
