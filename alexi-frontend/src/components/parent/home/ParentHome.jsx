import React from 'react';
import { Card } from '../../../components/shared';
import { TrendingUp, Award, BookOpen, Star, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ParentHome = () => {
  const childData = {
    name: 'Aarav Sharma',
    class: 'Junior KG-A',
    rollNo: '001',
    todayStatus: 'present',
    todayActivities: 3,
    todayScore: 4.3,
    weeklyStreak: 5,
    totalStars: 245
  };

  const recentActivities = [
    { time: '10:30 AM', activity: 'Alphabet Practice (A-E)', score: 5, stars: 5 },
    { time: '11:00 AM', activity: 'Fruits Recognition', score: 4, stars: 4 },
    { time: '11:30 AM', activity: 'Colors Matching', score: 5, stars: 5 },
  ];

  const achievements = [
    { icon: '🏅', title: 'Perfect Week', description: '5 day streak!' },
    { icon: '🌟', title: '100% Score', description: 'Alphabet mastery' },
    { icon: '🎨', title: 'Color Expert', description: 'All colors learned' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text mb-2">
          Hi, Welcome! 👋
        </h1>
        <p className="text-text/60">Track {childData.name}'s learning journey</p>
      </div>

      {/* Child Info Card */}
      <Card className="bg-gradient-to-r from-primary-400 to-secondary-400 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{childData.name}</h2>
            <p className="text-white/90 mb-1">{childData.class} • Roll No: {childData.rollNo}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
                ✅ Present Today
              </div>
            </div>
          </div>
          <div className="text-8xl opacity-20">
            👦
          </div>
        </div>
      </Card>

      {/* Today's Summary */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-4">Today's Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={20} className="text-green-700" />
              <p className="text-sm text-green-700 font-semibold">Activities</p>
            </div>
            <p className="text-4xl font-bold text-green-900">{childData.todayActivities}</p>
            <p className="text-xs text-green-700 mt-1">Completed</p>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-yellow-700" />
              <p className="text-sm text-yellow-700 font-semibold">Avg Score</p>
            </div>
            <p className="text-4xl font-bold text-yellow-900">{childData.todayScore}/5</p>
            <p className="text-xs text-yellow-700 mt-1">⭐⭐⭐⭐</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-purple-700" />
              <p className="text-sm text-purple-700 font-semibold">Streak</p>
            </div>
            <p className="text-4xl font-bold text-purple-900">{childData.weeklyStreak}</p>
            <p className="text-xs text-purple-700 mt-1">Days 🔥</p>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="text-orange-700" />
              <p className="text-sm text-orange-700 font-semibold">Total Stars</p>
            </div>
            <p className="text-4xl font-bold text-orange-900">{childData.totalStars}</p>
            <p className="text-xs text-orange-700 mt-1">All time</p>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text">Today's Activities</h2>
          <Calendar size={24} className="text-primary-600" />
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">{activity.activity}</h3>
                  <p className="text-sm text-text/60">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-text">
                  {'⭐'.repeat(activity.stars)}
                </p>
                <p className="text-sm text-text/60">{activity.score}/5</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Achievements This Week */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">🏆 Achievements This Week</h2>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 text-center"
            >
              <div className="text-5xl mb-2">{achievement.icon}</div>
              <h3 className="font-bold text-text mb-1">{achievement.title}</h3>
              <p className="text-sm text-text/60">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ParentHome;