import React, { useState } from 'react';
import { Button, Card, Input, Modal, Avatar, FileUpload } from '../../../components/shared';
import StudentEditModal from './StudentEditModal';
import { Search, Plus, Edit2, Trash2, Eye, Mail, Phone, MessageSquare } from 'lucide-react';

const StudentList = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Aarav Sharma',
      rollNo: '001',
      age: 4,
      parentName: 'Mr. Rajesh Sharma',
      parentEmail: 'rajesh.sharma@email.com',
      parentPhone: '9876543210',
      avatar: null,
      avgScore: 4.5,
      attendance: 95,
      totalStars: 245,
      status: 'active'
    },
    {
      id: 2,
      name: 'Priya Patel',
      rollNo: '002',
      age: 4,
      parentName: 'Mrs. Anjali Patel',
      parentEmail: 'anjali.patel@email.com',
      parentPhone: '9876543211',
      avatar: null,
      avgScore: 4.8,
      attendance: 98,
      totalStars: 289,
      status: 'active'
    },
    {
      id: 3,
      name: 'Rohan Kumar',
      rollNo: '003',
      age: 5,
      parentName: 'Mr. Vijay Kumar',
      parentEmail: 'vijay.kumar@email.com',
      parentPhone: '9876543212',
      avatar: null,
      avgScore: 4.2,
      attendance: 92,
      totalStars: 198,
      status: 'active'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    age: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    avatar: null
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.includes(searchQuery)
  );

  const handleAddStudent = () => {
    const newStudent = {
      id: students.length + 1,
      name: formData.name,
      rollNo: formData.rollNo,
      age: parseInt(formData.age),
      parentName: formData.parentName,
      parentEmail: formData.parentEmail,
      parentPhone: formData.parentPhone,
      avatar: formData.avatar,
      avgScore: 0,
      attendance: 0,
      totalStars: 0,
      status: 'active'
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
    setFormData({
      name: '',
      rollNo: '',
      age: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      avatar: null
    });
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleSaveStudent = (updatedData) => {
    setStudents(students.map(s => 
      s.id === selectedStudent.id 
        ? { ...s, ...updatedData }
        : s
    ));
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  const handleAddReview = (student) => {
    setSelectedStudent(student);
    setReviewText('');
    setShowReviewModal(true);
  };

  const submitReview = () => {
    if (reviewText.trim()) {
      console.log(`Review added for ${selectedStudent.name}: ${reviewText}`);
      alert(`Review added for ${selectedStudent.name}`);
      setShowReviewModal(false);
      setReviewText('');
      setSelectedStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">Students</h1>
          <p className="text-text/60">Manage your classroom students</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
        >
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-blue-900">{students.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-green-700 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-900">
            {students.filter(s => s.status === 'active').length}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1">Avg Attendance</p>
          <p className="text-3xl font-bold text-yellow-900">
            {Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm text-purple-700 mb-1">Avg Score</p>
          <p className="text-3xl font-bold text-purple-900">
            {(students.reduce((acc, s) => acc + s.avgScore, 0) / students.length).toFixed(1)}/5
          </p>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Search by name or roll number..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {/* Students Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text">Student</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Roll No</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Age</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Parent</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Avg Score</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Attendance</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Stars</th>
                <th className="text-right py-4 px-4 font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar size="md" />
                      <span className="font-semibold text-text">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-text/70">{student.rollNo}</td>
                  <td className="py-4 px-4 text-text/70">{student.age} yrs</td>
                  <td className="py-4 px-4 text-text/70">{student.parentName}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-text">{student.avgScore}</span>
                      <span className="text-text/50">/5</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-semibold
                      ${student.attendance >= 95 ? 'bg-green-100 text-green-700' :
                        student.attendance >= 85 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}
                    `}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xl">⭐</span>
                      <span className="font-semibold text-text">{student.totalStars}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleAddReview(student)}
                        className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Add Review"
                      >
                        <MessageSquare size={18} className="text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} className="text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Student Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Roll Number"
              placeholder="e.g., 001"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            />
            <Input
              label="Age"
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <Input
            label="Parent Name"
            placeholder="Enter parent name"
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
          />
          <Input
            label="Parent Email"
            type="email"
            icon={Mail}
            placeholder="parent@email.com"
            value={formData.parentEmail}
            onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
          />
          <Input
            label="Parent Phone"
            type="tel"
            icon={Phone}
            placeholder="Phone number"
            value={formData.parentPhone}
            onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
          />
          <div>
            <label className="block text-sm font-semibold text-text mb-3">Student Photo</label>
            <FileUpload
              accept="image/*"
              label="Upload Student Photo"
              onFileSelect={(file) => setFormData({ ...formData, avatar: file })}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="primary" onClick={handleAddStudent} className="flex-1">
              Add Student
            </Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Student Modal */}
      {selectedStudent && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Student Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar size="xl" />
              <div>
                <h3 className="text-2xl font-bold text-text">{selectedStudent.name}</h3>
                <p className="text-text/60">Roll No: {selectedStudent.rollNo}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card padding="sm" className="text-center">
                <p className="text-sm text-text/60 mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-primary-600">{selectedStudent.avgScore}/5</p>
              </Card>
              <Card padding="sm" className="text-center">
                <p className="text-sm text-text/60 mb-1">Attendance</p>
                <p className="text-3xl font-bold text-green-600">{selectedStudent.attendance}%</p>
              </Card>
              <Card padding="sm" className="text-center">
                <p className="text-sm text-text/60 mb-1">Total Stars</p>
                <p className="text-3xl font-bold text-yellow-600">{selectedStudent.totalStars}</p>
              </Card>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-3">Parent Information</h4>
              <div className="space-y-2 bg-gray-50 rounded-2xl p-4">
                <p className="text-text"><strong>Name:</strong> {selectedStudent.parentName}</p>
                <p className="text-text"><strong>Email:</strong> {selectedStudent.parentEmail}</p>
                <p className="text-text"><strong>Phone:</strong> {selectedStudent.parentPhone}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Student Modal */}
      <StudentEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />

      {/* Add Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Add Review for ${selectedStudent?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Review Notes</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review or notes for this student..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 resize-none"
              rows="4"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={submitReview}
              className="flex-1"
            >
              Submit Review
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowReviewModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentList;