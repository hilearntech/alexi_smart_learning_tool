import React from 'react';
import { Card } from '../../../components/shared';
import { Trophy, Star, Award, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const AchievementsTab = () => {
  const earnedBadges = [
    { id: 1, icon: '🏅', name: 'Week Star', description: '5 consecutive days', earnedDate: '2 days ago', rarity: 'common' },
    { id: 2, icon: '⭐', name: '100% Score', description: 'Perfect alphabet test', earnedDate: '3 days ago', rarity: 'rare' },
    { id: 3, icon: '🎯', name: 'Fast Learner', description: 'Completed 10 activities in one day', earnedDate: '5 days ago', rarity: 'common' },
    { id: 4, icon: '🔥', name: '5 Day Streak', description: 'Never missed a day', earnedDate: '1 week ago', rarity: 'uncommon' },
    { id: 5, icon: '🎨', name: 'Color Master', description: 'All colors identified correctly', earnedDate: '1 week ago', rarity: 'rare' },
    { id: 6, icon: '📚', name: 'Bookworm', description: 'Completed 50 reading activities', earnedDate: '2 weeks ago', rarity: 'epic' },
    { id: 7, icon: '🌟', name: 'Rising Star', description: 'Earned 100 total stars', earnedDate: '3 weeks ago', rarity: 'common' },
    { id: 8, icon: '💯', name: 'Perfectionist', description: '10 perfect scores', earnedDate: '1 month ago', rarity: 'rare' },
  ];

  const lockedBadges = [
    { id: 9, icon: '🏆', name: 'Champion', description: 'Earn 500 total stars', requirement: '245/500 stars' },
    { id: 10, icon: '👑', name: 'Top of Class', description: 'Rank #1 for a week', requirement: 'Currently #2' },
    { id: 11, icon: '🚀', name: 'Speed Demon', description: 'Complete 20 activities in a day', requirement: 'Best: 10' },
    { id: 12, icon: '🎓', name: 'Graduate', description: 'Complete all Junior KG modules', requirement: '3/10 modules' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Priya Patel', stars: 420, trend: 'up' },
    { rank: 2, name: 'Aarav Sharma', stars: 245, trend: 'up', isCurrentUser: true },
    { rank: 3, name: 'Rohan Kumar', stars: 370, trend: 'down' },
    { rank: 4, name: 'Sara Ali', stars: 356, trend: 'up' },
    { rank: 5, name: 'Ananya Singh', stars: 298, trend: 'stable' },
  ];

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text mb-2">Achievements 🏆</h1>
        <p className="text-text/60">Badges earned and milestones reached</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-center">
          <Trophy size={32} className="mx-auto mb-2 text-yellow-600" />
          <p className="text-3xl font-bold text-yellow-900">{earnedBadges.length}</p>
          <p className="text-sm text-yellow-700">Badges Earned</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-center">
          <Star size={32} className="mx-auto mb-2 text-purple-600" />
          <p className="text-3xl font-bold text-purple-900">245</p>
          <p className="text-sm text-purple-700">Total Stars</p>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-center">
          <Award size={32} className="mx-auto mb-2 text-blue-600" />
          <p className="text-3xl font-bold text-blue-900">2</p>
          <p className="text-sm text-blue-700">Rare Badges</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-center">
          <div className="text-3xl mb-2">🏅</div>
          <p className="text-3xl font-bold text-green-900">#2</p>
          <p className="text-sm text-green-700">Class Rank</p>
        </Card>
      </div>

      {/* Earned Badges */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">Badges Earned</h2>
        <div className="grid grid-cols-4 gap-4">
          {earnedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                type: "spring"
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${getRarityColor(badge.rarity)} text-white text-center cursor-pointer group`}
            >
              <div className="text-6xl mb-3">{badge.icon}</div>
              <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
              <p className="text-sm text-white/90 mb-2">{badge.description}</p>
              <p className="text-xs text-white/70">{badge.earnedDate}</p>
              
              {/* Rarity badge */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-white/30 backdrop-blur-sm rounded-lg text-xs font-semibold">
                {badge.rarity.toUpperCase()}
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Locked Badges */}
      <Card className="bg-gray-50">
        <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
          <Lock size={24} className="text-gray-600" />
          Locked Badges
        </h2>
        <p className="text-text/60 mb-4">Keep learning to unlock these achievements!</p>
        <div className="grid grid-cols-4 gap-4">
          {lockedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-gray-200 border-2 border-gray-300 text-center"
            >
              <div className="text-6xl mb-3 grayscale opacity-50">{badge.icon}</div>
              <h3 className="font-bold text-lg mb-1 text-gray-700">{badge.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
              <div className="mt-3 px-3 py-1 bg-gray-300 rounded-lg text-xs font-semibold text-gray-700">
                {badge.requirement}
              </div>
              
              {/* Lock overlay */}
              <div className="absolute top-3 right-3">
                <Lock size={20} className="text-gray-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Class Leaderboard */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={28} className="text-yellow-600" />
          <h2 className="text-2xl font-bold text-text">Class Leaderboard</h2>
        </div>
        <p className="text-text/60 mb-4">See how you compare with your classmates</p>
        <div className="space-y-3">
          {leaderboard.map((student, index) => (
            <motion.div
              key={student.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center justify-between p-4 rounded-2xl transition-all
                ${student.isCurrentUser 
                  ? 'bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-300' 
                  : 'bg-gray-50 hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                  ${student.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                    student.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                    student.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }
                `}>
                  {student.rank}
                </div>
                <div>
                  <h3 className={`font-semibold ${student.isCurrentUser ? 'text-primary-700' : 'text-text'}`}>
                    {student.name}
                    {student.isCurrentUser && <span className="ml-2 text-sm">(You!)</span>}
                  </h3>
                  <p className="text-sm text-text/60">{student.stars} stars</p>
                </div>
              </div>
              <div className="text-2xl">
                {student.trend === 'up' && '📈'}
                {student.trend === 'down' && '📉'}
                {student.trend === 'stable' && '➡️'}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Motivation Card */}
      <Card className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">
        <div className="flex items-center gap-4">
          <div className="text-6xl">🎯</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Keep Going!</h3>
            <p className="text-white/90">
              You're doing amazing! Just 175 more stars to reach Champion status. 
              Complete your daily activities to earn more badges! 🌟
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AchievementsTab;