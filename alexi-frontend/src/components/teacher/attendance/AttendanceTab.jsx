import React, { useState } from 'react';
import { Button, Card, Modal } from '../../../components/shared';
import { Calendar, Download, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const AttendanceTab = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'Aarav Sharma', rollNo: '001', status: 'present', time: '9:05 AM', method: 'auto' },
    { id: 2, name: 'Priya Patel', rollNo: '002', status: 'present', time: '9:03 AM', method: 'auto' },
    { id: 3, name: 'Rohan Kumar', rollNo: '003', status: 'absent', time: null, method: null },
    { id: 4, name: 'Sara Ali', rollNo: '004', status: 'present', time: '9:10 AM', method: 'auto' },
    { id: 5, name: 'Ananya Singh', rollNo: '005', status: 'present', time: '9:08 AM', method: 'auto' },
    { id: 6, name: 'Arjun Gupta', rollNo: '006', status: 'late', time: '9:45 AM', method: 'manual' },
    { id: 7, name: 'Diya Reddy', rollNo: '007', status: 'present', time: '9:02 AM', method: 'auto' },
    { id: 8, name: 'Kabir Mehta', rollNo: '008', status: 'absent', time: null, method: null },
  ]);

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter(s => s.status === 'present').length,
    absent: attendanceData.filter(s => s.status === 'absent').length,
    late: attendanceData.filter(s => s.status === 'late').length,
    autoDetected: attendanceData.filter(s => s.method === 'auto').length,
  };

  const toggleAttendance = (id) => {
    setAttendanceData(attendanceData.map(student => {
      if (student.id === id) {
        let newStatus;
        if (student.status === 'present') newStatus = 'absent';
        else if (student.status === 'absent') newStatus = 'late';
        else newStatus = 'present';

        return {
          ...student,
          status: newStatus,
          time: newStatus !== 'absent' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
          method: 'manual'
        };
      }
      return student;
    }));
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

  const markAllPresent = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAttendanceData(attendanceData.map(student => ({
      ...student,
      status: 'present',
      time: now,
      method: 'manual'
    })));
  };

  const exportAttendance = () => {
    const csv = [
      ['Roll No', 'Name', 'Status', 'Time', 'Method'],
      ...attendanceData.map(s => [s.rollNo, s.name, s.status, s.time || '-', s.method || '-'])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">Attendance</h1>
          <p className="text-text/60">Track and manage student attendance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Download} onClick={exportAttendance}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={markAllPresent}>
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <Card>
        <div className="flex items-center gap-4">
          <Calendar size={24} className="text-primary-600" />
          <div className="flex-1">
            <label className="block text-sm font-semibold text-text mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Total Students</p>
          <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-700" />
            <p className="text-sm text-green-700">Present</p>
          </div>
          <p className="text-4xl font-bold text-green-900">{stats.present}</p>
          <p className="text-xs text-green-700 mt-1">{Math.round((stats.present / stats.total) * 100)}%</p>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-red-700" />
            <p className="text-sm text-red-700">Absent</p>
          </div>
          <p className="text-4xl font-bold text-red-900">{stats.absent}</p>
          <p className="text-xs text-red-700 mt-1">{Math.round((stats.absent / stats.total) * 100)}%</p>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-yellow-700" />
            <p className="text-sm text-yellow-700">Late</p>
          </div>
          <p className="text-4xl font-bold text-yellow-900">{stats.late}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm text-purple-700 mb-1">Auto-Detected</p>
          <p className="text-4xl font-bold text-purple-900">{stats.autoDetected}</p>
          <p className="text-xs text-purple-700 mt-1">Face Recognition</p>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-text">Attendance Record - {selectedDate}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text">Roll No</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Student Name</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Time</th>
                <th className="text-left py-4 px-4 font-semibold text-text">Method</th>
                <th className="text-right py-4 px-4 font-semibold text-text">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 text-text/70 font-mono">{student.rollNo}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-text">{student.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2
                      ${student.status === 'present' ? 'bg-green-100 text-green-700' :
                        student.status === 'absent' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'}
                    `}>
                      {student.status === 'present' && <CheckCircle size={14} />}
                      {student.status === 'absent' && <XCircle size={14} />}
                      {student.status === 'late' && <Clock size={14} />}
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-text/70">{student.time || '-'}</td>
                  <td className="py-4 px-4">
                    {student.method && (
                      <span className={`
                        px-2 py-1 rounded-lg text-xs font-semibold
                        ${student.method === 'auto' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}
                      `}>
                        {student.method === 'auto' ? '🤖 Auto' : '✏️ Manual'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAttendance(student.id)}
                      >
                        Toggle
                      </Button>
                      <button
                        onClick={() => handleAddReview(student)}
                        className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Add Review"
                      >
                        <MessageSquare size={18} className="text-purple-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info Note */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How Attendance Works</h3>
            <p className="text-sm text-blue-800">
              Students are automatically marked present when detected by the face recognition system. 
              You can manually override any attendance status by clicking the "Toggle" button.
            </p>
          </div>
        </div>
      </Card>

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

export default AttendanceTab;