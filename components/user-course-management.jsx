"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, UserMinus, Search, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getAllUsers, getCourses, grantCourseAccess, revokeCourseAccess, getUserCourses } from "@/lib/api";

export default function UserCourseManagement() {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    // Modal states
    const [grantModalOpen, setGrantModalOpen] = useState(false);
    const [viewCoursesModalOpen, setViewCoursesModalOpen] = useState(false);

    // Form states
    const [grantForm, setGrantForm] = useState({
        userId: "",
        courseId: "",
        accessType: "granted",
        expiryDate: ""
    });

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        role: ""
    });

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, [filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers(filters);
            if (response.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            toast.error(`Failed to fetch users: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await getCourses({ limit: 100 });
            if (response.success) {
                setCourses(response.data.courses);
            }
        } catch (error) {
            toast.error(`Failed to fetch courses: ${error.message}`);
        }
    };

    const fetchUserCourses = async (userId) => {
        try {
            const response = await getUserCourses(userId);
            if (response.success) {
                setUserCourses(response.data.courses);
            }
        } catch (error) {
            toast.error(`Failed to fetch user courses: ${error.message}`);
            setUserCourses([]);
        }
    };

    const handleGrantAccess = async (e) => {
        e.preventDefault();
        try {
            const accessData = {
                userId: parseInt(grantForm.userId),
                courseId: grantForm.courseId,
                accessType: grantForm.accessType,
                expiryDate: grantForm.expiryDate || null
            };

            const response = await grantCourseAccess(accessData);
            if (response.success) {
                toast.success("Course access granted successfully!");
                setGrantModalOpen(false);
                setGrantForm({
                    userId: "",
                    courseId: "",
                    accessType: "granted",
                    expiryDate: ""
                });
                // Refresh user courses if viewing a specific user
                if (selectedUser) {
                    fetchUserCourses(selectedUser.id);
                }
            }
        } catch (error) {
            toast.error(`Failed to grant access: ${error.message}`);
        }
    };

    const handleRevokeAccess = async (userId, courseId) => {
        if (!confirm("Are you sure you want to revoke this course access?")) return;

        try {
            const response = await revokeCourseAccess({ userId, courseId });
            if (response.success) {
                toast.success("Course access revoked successfully!");
                // Refresh user courses if viewing a specific user
                if (selectedUser) {
                    fetchUserCourses(selectedUser.id);
                }
            }
        } catch (error) {
            toast.error(`Failed to revoke access: ${error.message}`);
        }
    };

    const openViewCoursesModal = async (user) => {
        setSelectedUser(user);
        setViewCoursesModalOpen(true);
        await fetchUserCourses(user.id);
    };

    const openGrantModal = (user = null) => {
        if (user) {
            setGrantForm(prev => ({ ...prev, userId: user.id.toString() }));
        }
        setGrantModalOpen(true);
    };

    const getAccessTypeColor = (accessType) => {
        switch (accessType) {
            case "purchased": return "bg-green-100 text-green-800";
            case "granted": return "bg-blue-100 text-blue-800";
            case "trial": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No expiry";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Course Management</h2>
                    <p className="text-muted-foreground">Manage course access for users</p>
                </div>
                <Dialog open={grantModalOpen} onOpenChange={setGrantModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => openGrantModal()}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Grant Access
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Grant Course Access</DialogTitle>
                            <DialogDescription>
                                Grant a user access to a specific course
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleGrantAccess} className="space-y-4">
                            <div>
                                <Label htmlFor="userSelect">Select User</Label>
                                <Select value={grantForm.userId} onValueChange={(value) =>
                                    setGrantForm(prev => ({ ...prev, userId: value }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.username} ({user.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="courseSelect">Select Course</Label>
                                <Select value={grantForm.courseId} onValueChange={(value) =>
                                    setGrantForm(prev => ({ ...prev, courseId: value }))
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
                                <Label htmlFor="accessType">Access Type</Label>
                                <Select value={grantForm.accessType} onValueChange={(value) =>
                                    setGrantForm(prev => ({ ...prev, accessType: value }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="granted">Granted</SelectItem>
                                        <SelectItem value="trial">Trial</SelectItem>
                                        <SelectItem value="purchased">Purchased</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                                <Input
                                    id="expiryDate"
                                    type="date"
                                    value={grantForm.expiryDate}
                                    onChange={(e) => setGrantForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                                />
                            </div>
                            <Button type="submit" className="w-full">Grant Access</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>User Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="searchFilter">Search Users</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="searchFilter"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                    placeholder="Search by username or email"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="roleFilter">Role</Label>
                            <Select value={filters.role || "all"} onValueChange={(value) =>
                                setFilters(prev => ({ ...prev, role: value === "all" ? "" : value, page: 1 }))
                            }>
                                <SelectTrigger>
                                    <SelectValue placeholder="All roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All roles</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => setFilters({ page: 1, limit: 10, search: "", role: "" })}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage course access for platform users</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 animate-pulse">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Message Count</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{user.username}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {user.age} years • {user.city}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isActive ? "default" : "destructive"}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className={user.messageCount >= 20 ? "text-red-600 font-medium" : ""}>
                                                {user.messageCount}/20
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openViewCoursesModal(user)}
                                                >
                                                    View Courses
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openGrantModal(user)}
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* View User Courses Modal */}
            <Dialog open={viewCoursesModalOpen} onOpenChange={setViewCoursesModalOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser?.username}'s Courses
                        </DialogTitle>
                        <DialogDescription>
                            Manage course access for {selectedUser?.email}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {userCourses.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                This user has no course access yet.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {userCourses.map((course) => (
                                    <Card key={course.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{course.title}</h4>
                                                    <p className="text-sm text-muted-foreground">ID: {course.id}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <Badge variant="outline">{course.topic}</Badge>
                                                        <Badge className={getAccessTypeColor(course.access.accessType)}>
                                                            {course.access.accessType}
                                                        </Badge>
                                                        <Badge variant={course.access.isActive ? "default" : "destructive"}>
                                                            {course.access.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Granted: {formatDate(course.access.purchaseDate)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Expires: {formatDate(course.access.expiryDate)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {course.access.hasValidAccess ? (
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                            )}
                                                            <span>
                                                                {course.access.hasValidAccess ? "Valid Access" : "Access Expired"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span>Progress: {course.access.progress || 0}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleRevokeAccess(selectedUser.id, course.id)}
                                                >
                                                    <UserMinus className="h-4 w-4 mr-2" />
                                                    Revoke
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <Button onClick={() => openGrantModal(selectedUser)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Grant New Access
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
