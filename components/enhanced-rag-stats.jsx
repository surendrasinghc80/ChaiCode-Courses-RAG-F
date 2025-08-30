"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MessageSquare, Clock, TrendingUp, BookOpen, Users, Activity } from "lucide-react";
import { toast } from "sonner";
import { getRagStats, getUserCourses, getAllUsers } from "@/lib/api";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function EnhancedRagStats() {
    const [stats, setStats] = useState(null);
    const [userCourses, setUserCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState("all");
    const [selectedCourse, setSelectedCourse] = useState("all");

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedUser !== "all") {
            fetchUserCourses();
        }
        fetchStats();
    }, [selectedUser, selectedCourse]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            // Fetch users for admin dropdown
            const usersResponse = await getAllUsers({ limit: 100 });
            if (usersResponse.success) {
                setUsers(usersResponse.data.users);
            }
        } catch (error) {
            toast.error(`Failed to fetch initial data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserCourses = async () => {
        try {
            const userId = selectedUser === "all" ? null : selectedUser;
            const response = await getUserCourses(userId);
            if (response.success) {
                setUserCourses(response.data.courses);
            }
        } catch (error) {
            setUserCourses([]);
        }
    };

    const fetchStats = async () => {
        try {
            const userId = selectedUser === "all" ? null : selectedUser;
            const response = await getRagStats(userId);
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            toast.error(`Failed to fetch RAG stats: ${error.message}`);
            setStats(null);
        }
    };

    const getFilteredSectionStats = () => {
        if (!stats?.topSections) return [];

        if (selectedCourse === "all") {
            return stats.topSections;
        }

        // Filter by course if selected
        return stats.topSections.filter(section =>
            section.course_id === selectedCourse
        );
    };

    const getCourseDistribution = () => {
        if (!stats?.topSections) return [];

        const courseStats = {};
        stats.topSections.forEach(section => {
            const courseId = section.course_id || 'unknown';
            if (!courseStats[courseId]) {
                courseStats[courseId] = 0;
            }
            courseStats[courseId] += section.questionCount;
        });

        return Object.entries(courseStats).map(([courseId, count]) => ({
            name: courseId,
            value: count
        }));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">RAG Analytics</h2>
                    <p className="text-muted-foreground">Analyze question patterns and course engagement</p>
                </div>
                <div className="flex gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">User Filter</label>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.username} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedUser !== "all" && userCourses.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Course Filter</label>
                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    {userCourses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            {stats?.overview && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overview.totalQuestions || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Questions asked via RAG
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.overview.avgResponseTime ? `${stats.overview.avgResponseTime.toFixed(1)}s` : "N/A"}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Average processing time
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {selectedUser !== "all" ? userCourses.length : getCourseDistribution().length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {selectedUser !== "all" ? "User's courses" : "Total courses with activity"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.overview.lastActivity
                                    ? new Date(stats.overview.lastActivity).toLocaleDateString()
                                    : "No activity"
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Most recent question
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section Activity Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Section Activity</CardTitle>
                        <CardDescription>
                            Questions asked per course section
                            {selectedCourse !== "all" && ` (filtered by course)`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {getFilteredSectionStats().length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getFilteredSectionStats()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="section"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="questionCount" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No section activity data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Course Distribution Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course Distribution</CardTitle>
                        <CardDescription>
                            Question distribution across courses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {getCourseDistribution().length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={getCourseDistribution()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {getCourseDistribution().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No course distribution data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Sections Table */}
            {getFilteredSectionStats().length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Sections by Activity</CardTitle>
                        <CardDescription>
                            Most frequently queried course sections
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {getFilteredSectionStats().slice(0, 10).map((section, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{section.section}</h4>
                                            {section.course_id && (
                                                <p className="text-sm text-muted-foreground">
                                                    Course: {section.course_id}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{section.questionCount}</div>
                                        <div className="text-sm text-muted-foreground">questions</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* User Course Access (when viewing specific user) */}
            {selectedUser !== "all" && userCourses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>User Course Access</CardTitle>
                        <CardDescription>
                            Courses accessible to {users.find(u => u.id.toString() === selectedUser)?.username}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userCourses.map((course) => (
                                <Card key={course.id} className="border-2">
                                    <CardContent className="pt-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold">{course.title}</h4>
                                            <p className="text-sm text-muted-foreground">ID: {course.id}</p>
                                            <div className="flex gap-2">
                                                <Badge variant="outline">{course.topic}</Badge>
                                                <Badge
                                                    variant={course.access.isActive ? "default" : "secondary"}
                                                >
                                                    {course.access.accessType}
                                                </Badge>
                                            </div>
                                            <div className="text-sm">
                                                <p>Progress: {course.access.progress || 0}%</p>
                                                <p>Valid: {course.access.hasValidAccess ? "Yes" : "No"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {!stats && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No RAG statistics available yet.</p>
                            <p className="text-sm">Statistics will appear once users start asking questions.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
