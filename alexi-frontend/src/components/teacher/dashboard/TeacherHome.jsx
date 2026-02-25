import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../../../components/shared';
import { Users, BookOpen, BarChart, TrendingUp, Monitor, Play } from 'lucide-react';

const TeacherHome = () => {
  const navigate = useNavigate();

const handleStartSession = () => {
  // Navigate to Mimi in the same window (for Smart TV display)
  navigate('/student');
};
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">
            Welcome Back, Mrs. Priya! 👋
          </h1>
          <p className="text-text/60">Here's what's happening in your class today</p>
        </div>
        
        {/* START CLASSROOM SESSION BUTTON */}
        <Button
          variant="primary"
          size="xl"
          icon={Play}
          onClick={handleStartSession}
          className="shadow-2xl"
        >
          Start Classroom Session
        </Button>
      </div>

      {/* Classroom Session Card */}
      <Card className="bg-gradient-to-r from-primary-400 to-secondary-400 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to Start Learning?</h2>
            <p className="text-white/90 mb-4">
              Launch Mimi on the Smart TV and begin today's activities
            </p>
            <Button
              variant="outline"
              icon={Monitor}
              onClick={handleStartSession}
              className="bg-white text-primary-600 hover:bg-white/90 border-0"
            >
              Launch on Smart TV
            </Button>
          </div>
          <div className="text-9xl opacity-20">
            📺
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover className="bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text">Students Present</h3>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-text mb-2">15/18</p>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp size={16} />
            <span className="text-sm font-semibold">83% attendance</span>
          </div>
        </Card>

        <Card hover className="bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text">Activities Today</h3>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BookOpen size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-text mb-2">12</p>
          <p className="text-sm text-text/60">3 in progress</p>
        </Card>

        <Card hover className="bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text">Average Score</h3>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <BarChart size={24} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-text mb-2">4.2/5</p>
          <div className="text-2xl">⭐⭐⭐⭐</div>
        </Card>

        <Card hover className="bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text">This Week</h3>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-text mb-2">156</p>
          <p className="text-sm text-text/60">Stars earned</p>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {[
            { time: '10:30 AM', activity: 'Alphabet Practice (A-E)', students: 15, avgScore: '4.5/5' },
            { time: '11:00 AM', activity: 'Fruits Recognition', students: 14, avgScore: '4.2/5' },
            { time: '11:30 AM', activity: 'Colors Matching', students: 15, avgScore: '4.8/5' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">{item.activity}</h3>
                  <p className="text-sm text-text/60">{item.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-text/60">Students</p>
                  <p className="font-semibold text-text">{item.students}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text/60">Avg Score</p>
                  <p className="font-semibold text-text">{item.avgScore}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/teacher/students')}
          className="h-20"
        >
          <Users className="mr-2" />
          View Students
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/teacher/attendance')}
          className="h-20"
        >
          Mark Attendance
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/teacher/reports')}
          className="h-20"
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default TeacherHome;