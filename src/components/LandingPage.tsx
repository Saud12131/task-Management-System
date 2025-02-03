// pages/landing.js

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-blue-600">Task Management System</h1>
        <p className="text-lg text-gray-600 mt-2">Stay organized. Stay productive.</p>
      </header>

      <section className="text-center space-y-6 px-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage your tasks with ease</h2>
        <p className="text-lg text-gray-500">
          Our task management system helps you stay on top of your tasks. Create, update, and track your tasks in an easy-to-use interface.
        </p>
        <div className="space-x-4">
          <Link href="/tasks">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
              Go to Task Dashboard
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-8 mt-12 max-w-lg mx-auto">
        <h3 className="text-xl font-semibold text-gray-800">Key Features</h3>
        <ul className="list-disc space-y-4 text-gray-600 mt-4">
          <li>Create and manage tasks with ease.</li>
          <li>Track your task progress with checkboxes.</li>
          <li>Edit and delete tasks with a click.</li>
          <li>Prioritize tasks and stay on top of deadlines.</li>
        </ul>
      </section>
    </div>
  );
}
