import { NextResponse } from "next/server";
import TaskModel from "@/model/TaskModel";
import connectDB from "@/lib/db";

// GET - Fetch all tasks or a single task by ID
export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const task = await TaskModel.findById(id);
            if (!task) {
                return NextResponse.json({ message: "Task not found" }, { status: 404 });
            }
            return NextResponse.json(task, { status: 200 });
        }

        const tasks = await TaskModel.find();
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching tasks", error: error }, { status: 500 });
    }
}

// POST - Create a new task
export async function POST(request: Request) {
    try {
        await connectDB();
        const { title, description } = await request.json();

        if (!title || !description) {
            return NextResponse.json({ message: "Title and description are required" }, { status: 400 });
        }

        const task = await TaskModel.create({ title, description });
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating task", error: error }, { status: 500 });
    }
}

// PUT - Update a task by ID
export async function PUT(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const { title, description, status } = await request.json();

        if (!id) {
            return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(id, { title, description, status }, { new: true });

        if (!updatedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating task", error: error }, { status: 500 });
    }
}

// DELETE - Delete a task by ID
export async function DELETE(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
        }

        const deletedTask = await TaskModel.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting task", error: error }, { status: 500 });
    }
}
