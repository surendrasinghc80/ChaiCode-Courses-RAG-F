"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Upload, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { getCourses, createCourse, updateCourse, deleteCourse, uploadVttFiles } from "@/lib/api";

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        topic: "",
        difficulty: "",
        isActive: undefined
    });

    // Modal states
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Form states
    const [courseForm, setCourseForm] = useState({
        id: "",
        title: "",
        description: "",
        topic: "",
        difficulty: "beginner",
        duration: "",
        price: ""
    });

    const [uploadForm, setUploadForm] = useState({
        courseId: "",
        files: []
    });

    useEffect(() => {
        fetchCourses();
    }, [filters]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await getCourses(filters);
            if (response.success) {
                setCourses(response.data.courses);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            toast.error(`Failed to fetch courses: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const courseData = {
                ...courseForm,
                duration: courseForm.duration ? parseInt(courseForm.duration) : null,
                price: courseForm.price ? parseFloat(courseForm.price) : 0
            };

            const response = await createCourse(courseData);
            if (response.success) {
                toast.success("Course created successfully!");
                setCreateModalOpen(false);
                setCourseForm({
                    id: "",
                    title: "",
                    description: "",
                    topic: "",
                    difficulty: "beginner",
                    duration: "",
                    price: ""
                });
                fetchCourses();
            }
        } catch (error) {
            toast.error(`Failed to create course: ${error.message}`);
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                title: courseForm.title,
                description: courseForm.description,
                difficulty: courseForm.difficulty,
                duration: courseForm.duration ? parseInt(courseForm.duration) : null,
                price: courseForm.price ? parseFloat(courseForm.price) : 0
            };

            const response = await updateCourse(selectedCourse.id, updateData);
            if (response.success) {
                toast.success("Course updated successfully!");
                setEditModalOpen(false);
                setSelectedCourse(null);
                fetchCourses();
            }
        } catch (error) {
            toast.error(`Failed to update course: ${error.message}`);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const response = await deleteCourse(courseId);
            if (response.success) {
                toast.success("Course deleted successfully!");
                fetchCourses();
            }
        } catch (error) {
            toast.error(`Failed to delete course: ${error.message}`);
        }
    };

    const handleUploadVtt = async (e) => {
        e.preventDefault();
        if (!uploadForm.courseId || uploadForm.files.length === 0) {
            toast.error("Please select a course and upload files");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("courseId", uploadForm.courseId);

            for (let i = 0; i < uploadForm.files.length; i++) {
                formData.append("files", uploadForm.files[i]);
            }

            const response = await uploadVttFiles(formData);
            if (response.success) {
                toast.success(`Successfully uploaded ${response.data.filesProcessed} VTT files!`);
                setUploadModalOpen(false);
                setUploadForm({ courseId: "", files: [] });
                fetchCourses();
            }
        } catch (error) {
            toast.error(`Failed to upload VTT files: ${error.message}`);
        }
    };

    const openEditModal = (course) => {
        setSelectedCourse(course);
        setCourseForm({
            id: course.id,
            title: course.title,
            description: course.description || "",
            topic: course.topic,
            difficulty: course.difficulty,
            duration: course.duration?.toString() || "",
            price: course.price?.toString() || ""
        });
        setEditModalOpen(true);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "beginner": return "bg-green-100 text-green-800";
            case "intermediate": return "bg-yellow-100 text-yellow-800";
            case "advanced": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Course Management</h2>
                    <p className="text-muted-foreground">Create and manage courses for your platform</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload VTT
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload VTT Files</DialogTitle>
                                <DialogDescription>
                                    Upload VTT subtitle files for a specific course
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleUploadVtt} className="space-y-4">
                                <div>
                                    <Label htmlFor="courseSelect">Select Course</Label>
                                    <Select value={uploadForm.courseId} onValueChange={(value) =>
                                        setUploadForm(prev => ({ ...prev, courseId: value }))
                                    }>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courses.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.title} ({course.id})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="vttFiles">VTT Files</Label>
                                    <Input
                                        id="vttFiles"
                                        type="file"
                                        multiple
                                        accept=".vtt"
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, files: e.target.files }))}
                                    />
                                </div>
                                <Button type="submit" className="w-full">Upload Files</Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Course</DialogTitle>
                                <DialogDescription>
                                    Add a new course to your platform
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateCourse} className="space-y-4">
                                <div>
                                    <Label htmlFor="courseId">Course ID</Label>
                                    <Input
                                        id="courseId"
                                        value={courseForm.id}
                                        onChange={(e) => setCourseForm(prev => ({ ...prev, id: e.target.value }))}
                                        placeholder="e.g., nodejs101"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={courseForm.title}
                                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Course title"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={courseForm.description}
                                        onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Course description"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="topic">Topic</Label>
                                    <Input
                                        id="topic"
                                        value={courseForm.topic}
                                        onChange={(e) => setCourseForm(prev => ({ ...prev, topic: e.target.value }))}
                                        placeholder="e.g., nodejs, react"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Select value={courseForm.difficulty} onValueChange={(value) =>
                                        setCourseForm(prev => ({ ...prev, difficulty: value }))
                                    }>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="duration">Duration (min)</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            value={courseForm.duration}
                                            onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="120"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="price">Price ($)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={courseForm.price}
                                            onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                                            placeholder="99.99"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Create Course</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="topicFilter">Topic</Label>
                            <Input
                                id="topicFilter"
                                value={filters.topic}
                                onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value, page: 1 }))}
                                placeholder="Filter by topic"
                            />
                        </div>
                        <div>
                            <Label htmlFor="difficultyFilter">Difficulty</Label>
                            <Select value={filters.difficulty || "all"} onValueChange={(value) =>
                                setFilters(prev => ({ ...prev, difficulty: value === "all" ? "" : value, page: 1 }))
                            }>
                                <SelectTrigger>
                                    <SelectValue placeholder="All difficulties" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All difficulties</SelectItem>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="statusFilter">Status</Label>
                            <Select value={filters.isActive?.toString() || "all"} onValueChange={(value) =>
                                setFilters(prev => ({ ...prev, isActive: value === "all" ? undefined : value === "true", page: 1 }))
                            }>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => setFilters({ page: 1, limit: 10, topic: "", difficulty: "", isActive: undefined })}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Courses Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Card key={course.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{course.title}</CardTitle>
                                            <CardDescription>ID: {course.id}</CardDescription>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditModal(course)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteCourse(course.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {course.description || "No description available"}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline">{course.topic}</Badge>
                                            <Badge className={getDifficultyColor(course.difficulty)}>
                                                {course.difficulty}
                                            </Badge>
                                            <Badge variant={course.isActive ? "default" : "secondary"}>
                                                {course.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{course.duration ? `${course.duration} min` : "No duration"}</span>
                                            <span>${course.price || "0.00"}</span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                {course.vectorCount || 0} vectors
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                {course.enrollmentCount || 0} enrolled
                                            </span>
                                        </div>

                                        {course.creator && (
                                            <p className="text-xs text-muted-foreground">
                                                Created by: {course.creator.username}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <Button
                                variant="outline"
                                disabled={!pagination.hasPrevPage}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={!pagination.hasNextPage}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Edit Course Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                        <DialogDescription>
                            Update course information
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCourse} className="space-y-4">
                        <div>
                            <Label htmlFor="editTitle">Title</Label>
                            <Input
                                id="editTitle"
                                value={courseForm.title}
                                onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="editDescription">Description</Label>
                            <Textarea
                                id="editDescription"
                                value={courseForm.description}
                                onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editDifficulty">Difficulty</Label>
                            <Select value={courseForm.difficulty} onValueChange={(value) =>
                                setCourseForm(prev => ({ ...prev, difficulty: value }))
                            }>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editDuration">Duration (min)</Label>
                                <Input
                                    id="editDuration"
                                    type="number"
                                    value={courseForm.duration}
                                    onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="editPrice">Price ($)</Label>
                                <Input
                                    id="editPrice"
                                    type="number"
                                    step="0.01"
                                    value={courseForm.price}
                                    onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Update Course</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
