import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Avatar } from '../../../components/shared';
import { Search, Eye, Mail, Phone, User, CheckCircle, Plus, Pencil } from 'lucide-react';

const StudentManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const [formData, setFormData] = useState({
        studentName: '',
        studentClass: '',
        parentName: '',
        email: '',
        phone: ''
    });

    const fetchStudents = async () => {
        const res = await fetch("http://localhost:5000/api/admin/all-students");
        const data = await res.json();

        const formatted = data.map(s => ({
            id: s._id,
            studentName: s.name,
            studentClass: s.class,
            parentName: s.parent_name || "N/A",
            email: s.email || "-",
            phone: s.phone || "-",
            status: "active",
            joinedDate: s.created_at
                ? new Date(s.created_at).toLocaleDateString()
                : "N/A",
        }));

        setStudents(formatted);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleAddStudent = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/add-student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.studentName,
                    class: formData.studentClass,
                    parentName: formData.parentName,
                    email: formData.email,
                    phone: formData.phone
                })
            });

            if (response.ok) {
                alert("Student added ✅");
                fetchStudents();
                setShowAddModal(false);
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    const handleUpdateStudent = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/edit-student/${editData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editData.studentName,
                    class: editData.studentClass,
                    parentName: editData.parentName,
                    email: editData.email,
                    phone: editData.phone
                })
            });

            if (res.ok) {
                alert("Student updated ✅");
                fetchStudents(); // refresh table
                setShowEditModal(false);
            } else {
                alert("Update failed ❌");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    const filteredStudents = students.filter(student =>
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: students.length,
        active: students.filter(s => s.status === 'active').length,
        pending: students.filter(s => s.status === 'pending').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-text mb-2">Student Management</h1>
                    <p className="text-text/60">View and manage students</p>
                </div>

                <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                    Add Student
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Total Students</p>
                    <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <p className="text-sm text-green-700 mb-1">Active</p>
                    <p className="text-4xl font-bold text-green-900">{stats.active}</p>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <p className="text-sm text-yellow-700 mb-1">Pending</p>
                    <p className="text-4xl font-bold text-yellow-900">{stats.pending}</p>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <Input
                    placeholder="Search by student or parent..."
                    icon={Search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Card>

            {/* Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold">Student</th>
                                <th className="text-left py-4 px-4 font-semibold">Parent</th>
                                <th className="text-left py-4 px-4 font-semibold">Contact</th>
                                <th className="text-left py-4 px-4 font-semibold">Class</th>
                                <th className="text-left py-4 px-4 font-semibold">Status</th>
                                <th className="text-right py-4 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar />
                                            <div>
                                                <p className="font-semibold">{student.studentName}</p>
                                                <p className="text-sm text-text/60">Joined: {student.joinedDate}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-4">{student.parentName}</td>

                                    <td className="py-4 px-4">
                                        <div className="text-sm">
                                            <p className="flex items-center gap-1">
                                                <Mail size={14} /> {student.email}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <Phone size={14} /> {student.phone}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="py-4 px-4">{student.studentClass}</td>

                                    <td className="py-4 px-4">
                                        <span className={`
                      px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1
                      ${student.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'}
                    `}>
                                            <CheckCircle size={14} />
                                            {student.status}
                                        </span>
                                    </td>

                                    <td className="py-4 px-4 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditData(student);
                                                setShowEditModal(true);
                                            }}
                                            className="p-2 hover:bg-indigo-50 rounded-lg"
                                        >
                                            <Pencil size={16} className="text-indigo-600" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setShowViewModal(true);
                                            }}
                                            className="p-2 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Eye size={18} className="text-blue-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {showAddModal && (
                <Modal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    title="Add New Student"
                    size="md"
                >
                    <div className="space-y-4">
                        <Input
                            label="Student Name"
                            icon={User}
                            value={formData.studentName}
                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        />

                        <Input
                            label="Class"
                            placeholder="e.g. UKG-A"
                            value={formData.studentClass}
                            onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                        />

                        <Input
                            label="Parent Name"
                            icon={User}
                            value={formData.parentName}
                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        />

                        <Input
                            label="Email"
                            icon={Mail}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <Input
                            label="Phone"
                            icon={Phone}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />

                        <div className="flex gap-3 mt-6">
                            <Button variant="primary" className="flex-1" onClick={handleAddStudent}>
                                Add Student
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {editData && (
                <Modal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    title="Edit Student"
                    size="md"
                >
                    <div className="space-y-4">
                        <Input
                            label="Student Name"
                            value={editData.studentName}
                            onChange={(e) =>
                                setEditData({ ...editData, studentName: e.target.value })
                            }
                        />

                        <Input
                            label="Class"
                            value={editData.studentClass}
                            onChange={(e) =>
                                setEditData({ ...editData, studentClass: e.target.value })
                            }
                        />

                        <Input
                            label="Parent Name"
                            value={editData.parentName}
                            onChange={(e) =>
                                setEditData({ ...editData, parentName: e.target.value })
                            }
                        />

                        <Input
                            label="Email"
                            value={editData.email}
                            onChange={(e) =>
                                setEditData({ ...editData, email: e.target.value })
                            }
                        />

                        <Input
                            label="Phone"
                            value={editData.phone}
                            onChange={(e) =>
                                setEditData({ ...editData, phone: e.target.value })
                            }
                        />

                        <div className="flex gap-3 mt-6">
                            <Button variant="primary" className="flex-1" onClick={handleUpdateStudent}>
                                Save Changes
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowEditModal(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            {/* View Modal */}
            {selectedStudent && (
                <Modal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    title="Student Details"
                >
                    <div className="space-y-3">
                        <p><b>Student:</b> {selectedStudent.studentName}</p>
                        <p><b>Class:</b> {selectedStudent.studentClass}</p>
                        <p><b>Parent:</b> {selectedStudent.parentName}</p>
                        <p><b>Email:</b> {selectedStudent.email}</p>
                        <p><b>Phone:</b> {selectedStudent.phone}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default StudentManagement;