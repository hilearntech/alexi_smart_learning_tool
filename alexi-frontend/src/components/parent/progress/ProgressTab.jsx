import React from 'react';
import { Card } from '../../../components/shared';
import { TrendingUp, CheckCircle, Clock, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgressTab = () => {
  const learningJourney = {
    currentLevel: 'Little Star',
    currentStars: 245,
    nextLevel: 'Bright Star',
    starsNeeded: 300,
    progress: 82
  };

  const skills = [
    { name: 'Alphabets', level: 'A-E', status: 'completed', progress: 100, color: 'green' },
    { name: 'Common Fruits', level: 'Basic', status: 'completed', progress: 100, color: 'green' },
    { name: 'Colors', level: 'In Progress', status: 'in-progress', progress: 70, color: 'blue' },
    { name: 'Animals', level: 'Locked', status: 'locked', progress: 0, color: 'gray' },
    { name: 'Numbers', level: 'Locked', status: 'locked', progress: 0, color: 'gray' },
  ];

  const weeklyData = [
    { day: 'Mon', activities: 5 },
    { day: 'Tue', activities: 3 },
    { day: 'Wed', activities: 4 },
    { day: 'Thu', activities: 6 },
    { day: 'Fri', activities: 3 },
  ];

  const maxActivities = Math.max(...weeklyData.map(d => d.activities));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text mb-2">Learning Progress 🚀</h1>
        <p className="text-text/60">Track skills and milestones</p>
      </div>

      {/* Learning Journey */}
      <Card className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/90 text-sm mb-1">Current Level</p>
            <h2 className="text-3xl font-bold">{learningJourney.currentLevel} ⭐⭐⭐</h2>
          </div>
          <div className="text-right">
            <p className="text-white/90 text-sm mb-1">Next Level</p>
            <h3 className="text-xl font-semibold">{learningJourney.nextLevel}</h3>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>{learningJourney.currentStars} stars</span>
            <span>{learningJourney.starsNeeded} stars needed</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${learningJourney.progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-white rounded-full flex items-center justify-end pr-2"
            >
              <span className="text-xs font-bold text-purple-600">{learningJourney.progress}%</span>
            </motion.div>
          </div>
        </div>
        
        <p className="text-white/90 text-sm">
          🎉 Just {learningJourney.starsNeeded - learningJourney.currentStars} stars away from {learningJourney.nextLevel}!
        </p>
      </Card>

      {/* Skills Progress */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">Skills Mastered</h2>
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {skill.status === 'completed' && <CheckCircle size={24} className="text-green-600" />}
                  {skill.status === 'in-progress' && <Clock size={24} className="text-blue-600" />}
                  {skill.status === 'locked' && <Lock size={24} className="text-gray-400" />}
                  <div>
                    <h3 className="font-semibold text-text">{skill.name}</h3>
                    <p className="text-sm text-text/60">{skill.level}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-text">{skill.progress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className={`h-full rounded-full ${
                    skill.color === 'green' ? 'bg-green-500' :
                    skill.color === 'blue' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Weekly Activity Chart */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">This Week's Activity</h2>
        <div className="flex items-end justify-between gap-4 h-64">
          {weeklyData.map((day, index) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.activities / maxActivities) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full bg-gradient-to-t from-primary-400 to-secondary-400 rounded-t-xl min-h-[20px] relative"
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-text">
                  {day.activities}
                </span>
              </motion.div>
              <span className="text-sm font-semibold text-text">{day.day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-center">
          <p className="text-sm text-blue-700 mb-1">Speaking</p>
          <p className="text-4xl font-bold text-blue-900 mb-1">85%</p>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="w-[85%] h-full bg-blue-600 rounded-full" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-center">
          <p className="text-sm text-green-700 mb-1">Reading</p>
          <p className="text-4xl font-bold text-green-900 mb-1">90%</p>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="w-[90%] h-full bg-green-600 rounded-full" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-center">
          <p className="text-sm text-purple-700 mb-1">Listening</p>
          <p className="text-4xl font-bold text-purple-900 mb-1">88%</p>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div className="w-[88%] h-full bg-purple-600 rounded-full" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTab;