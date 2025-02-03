import { NextResponse } from "next/server";
import TaskModel from "@/model/TaskModel";
import connectDB from "@/lib/db";
async function GET() {
    await connectDB();
    const tasks = await TaskModel.find();
    return NextResponse.json(tasks);
}

async function POST(request: Request) {
    await connectDB();
    const { title, description, } = await request.json();
    const task = await TaskModel.create({ title, description });
    return NextResponse.json(task);
}

export { GET, POST };
