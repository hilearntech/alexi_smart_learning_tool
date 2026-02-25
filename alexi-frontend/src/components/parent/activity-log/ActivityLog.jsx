import React, { useState } from 'react';
import { Card, Button } from '../../../components/shared';
import { Calendar, Filter, Download, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityLog = () => {
  const [selectedDate, setSelectedDate] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const activities = [
    {
      date: '2026-02-15',
      dateLabel: 'Today',
      activities: [
        { id: 1, time: '10:30 AM', name: 'Alphabet Practice (A-E)', type: 'alphabets', score: 5, stars: 5, teacherNote: 'Excellent pronunciation!' },
        { id: 2, time: '11:00 AM', name: 'Fruits Recognition', type: 'objects', score: 4, stars: 4, teacherNote: 'Good effort, practice mango' },
        { id: 3, time: '11:30 AM', name: 'Colors Matching', type: 'colors', score: 5, stars: 5, teacherNote: 'Perfect! All colors identified' },
      ]
    },
    {
      date: '2026-02-14',
      dateLabel: 'Yesterday',
      activities: [
        { id: 4, time: '10:15 AM', name: 'Phonics - Letter Sounds', type: 'phonics', score: 4, stars: 4, teacherNote: 'Very good progress' },
        { id: 5, time: '10:45 AM', name: 'Number Counting (1-5)', type: 'numbers', score: 5, stars: 5, teacherNote: 'Counted perfectly!' },
        { id: 6, time: '11:20 AM', name: 'Animal Sounds', type: 'objects', score: 5, stars: 5, teacherNote: 'Great! Loved the cow sound' },
      ]
    },
    {
      date: '2026-02-13',
      dateLabel: 'Feb 13, 2026',
      activities: [
        { id: 7, time: '10:00 AM', name: 'Alphabet Review', type: 'alphabets', score: 4, stars: 4, teacherNote: 'Keep practicing' },
        { id: 8, time: '10:30 AM', name: 'Shapes Recognition', type: 'shapes', score: 5, stars: 5, teacherNote: 'All shapes identified!' },
      ]
    },
  ];

  const getScoreColor = (score) => {
    if (score === 5) return 'text-green-600';
    if (score === 4) return 'text-blue-600';
    if (score === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeColor = (type) => {
    const colors = {
      alphabets: 'bg-purple-100 text-purple-700',
      phonics: 'bg-blue-100 text-blue-700',
      objects: 'bg-green-100 text-green-700',
      colors: 'bg-pink-100 text-pink-700',
      numbers: 'bg-orange-100 text-orange-700',
      shapes: 'bg-cyan-100 text-cyan-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const downloadLog = () => {
    alert('Downloading activity log... (Feature coming soon)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">Activity Log 📚</h1>
          <p className="text-text/60">Complete history of learning activities</p>
        </div>
        <Button variant="outline" icon={Download} onClick={downloadLog}>
          Download Log
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Date Filter
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-2 flex items-center gap-2">
              <Filter size={16} />
              Activity Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400"
            >
              <option value="all">All Types</option>
              <option value="alphabets">Alphabets</option>
              <option value="phonics">Phonics</option>
              <option value="objects">Objects</option>
              <option value="colors">Colors</option>
              <option value="numbers">Numbers</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="primary" className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-center">
          <BookOpen size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-3xl font-bold text-blue-900">
            {activities.reduce((sum, day) => sum + day.activities.length, 0)}
          </p>
          <p className="text-sm text-blue-700">Total Activities</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-center">
          <Star size={24} className="mx-auto mb-2 text-green-600" />
          <p className="text-3xl font-bold text-green-900">4.6/5</p>
          <p className="text-sm text-green-700">Average Score</p>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-3xl font-bold text-yellow-900">
            {activities.reduce((sum, day) => 
              sum + day.activities.reduce((s, a) => s + a.stars, 0), 0
            )}
          </p>
          <p className="text-sm text-yellow-700">Stars Earned</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-center">
          <div className="text-3xl mb-2">📈</div>
          <p className="text-3xl font-bold text-purple-900">Rising</p>
          <p className="text-sm text-purple-700">Trend</p>
        </Card>
      </div>

      {/* Activity Timeline */}
      {activities.map((dayData, dayIndex) => (
        <motion.div
          key={dayData.date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dayIndex * 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
              <Calendar size={24} className="text-primary-600" />
              <div>
                <h2 className="text-xl font-bold text-text">{dayData.dateLabel}</h2>
                <p className="text-sm text-text/60">{dayData.date}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-text/60">Activities</p>
                <p className="text-2xl font-bold text-text">{dayData.activities.length}</p>
              </div>
            </div>

            <div className="space-y-3">
              {dayData.activities.map((activity, actIndex) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dayIndex * 0.1 + actIndex * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  {/* Time */}
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-semibold text-text">{activity.time}</p>
                  </div>

                  {/* Activity Icon */}
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen size={28} className="text-primary-600" />
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-text text-lg">{activity.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold mt-1 ${getTypeColor(activity.type)}`}>
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${getScoreColor(activity.score)}`}>
                          {'⭐'.repeat(activity.stars)}
                        </p>
                        <p className="text-sm text-text/60 mt-1">{activity.score}/5</p>
                      </div>
                    </div>

                    {/* Teacher Note */}
                    {activity.teacherNote && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-900">
                          <strong>Teacher's Note:</strong> {activity.teacherNote}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityLog;