import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Task } from "@/lib/types";

// GET /api/tasks — Fetch all tasks (optionally filter by month: ?year=2024&month=3)
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    let filter: Record<string, unknown> = {};
    if (year && month) {
      const prefix = `${year}-${String(Number(month) + 1).padStart(2, "0")}`;
      filter = { dateKey: { $regex: `^${prefix}` } };
    }

    const tasks = await db
      .collection<Task>("tasks")
      .find(filter)
      .sort({ dateKey: 1, order: 1 })
      .toArray();

    // Group by dateKey
    const grouped: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      const task: Task = {
        id: t._id!.toString(),
        text: t.text,
        dateKey: t.dateKey,
        order: t.order,
        createdAt: t.createdAt,
      };
      if (!grouped[t.dateKey]) grouped[t.dateKey] = [];
      grouped[t.dateKey].push(task);
    });

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST /api/tasks — Create a new task
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    const { text, dateKey, order } = body;
    if (!text || !dateKey) {
      return NextResponse.json({ error: "text and dateKey are required" }, { status: 400 });
    }

    const doc = {
      text: text.trim(),
      dateKey,
      order: order ?? 0,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("tasks").insertOne(doc);

    const task: Task = {
      id: result.insertedId.toString(),
      ...doc,
    };

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// PUT /api/tasks — Bulk update (for drag-and-drop reorder/reassign)
export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { tasks } = body as { tasks: Task[] };

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: "tasks array is required" }, { status: 400 });
    }

    const { ObjectId } = await import("mongodb");
    const bulkOps = tasks.map((t) => ({
      updateOne: {
        filter: { _id: new ObjectId(t.id) },
        update: {
          $set: {
            text: t.text,
            dateKey: t.dateKey,
            order: t.order,
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await db.collection("tasks").bulkWrite(bulkOps);
    }

    return NextResponse.json({ updated: bulkOps.length });
  } catch (error) {
    console.error("PUT /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to bulk update tasks" }, { status: 500 });
  }
}
