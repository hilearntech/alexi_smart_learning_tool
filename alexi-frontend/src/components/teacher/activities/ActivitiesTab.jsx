import React, { useState } from 'react';
import { Button, Card, Modal } from '../../../components/shared';
import { Play, Settings, Plus, BookOpen, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivitiesTab = () => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const activities = [
    {
      id: 1,
      name: 'Alphabet Practice',
      icon: '🔤',
      category: 'Alphabets',
      levels: 'A-Z',
      avgTime: '15 min',
      difficulty: 'Easy',
      studentsCompleted: 156,
      avgScore: 4.5,
      description: 'Learn and practice all 26 letters with pronunciation and examples'
    },
    {
      id: 2,
      name: 'Phonics Basics',
      icon: '🗣️',
      category: 'Phonics',
      levels: 'Basic',
      avgTime: '12 min',
      difficulty: 'Medium',
      studentsCompleted: 128,
      avgScore: 4.0,
      description: 'Understanding letter sounds and phonetic patterns'
    },
    {
      id: 3,
      name: 'Fruits Recognition',
      icon: '🍎',
      category: 'Objects',
      levels: '10 Items',
      avgTime: '10 min',
      difficulty: 'Easy',
      studentsCompleted: 142,
      avgScore: 4.2,
      description: 'Identify and name common fruits with visual aids'
    },
    {
      id: 4,
      name: 'Animal Sounds',
      icon: '🐮',
      category: 'Objects',
      levels: '8 Animals',
      avgTime: '8 min',
      difficulty: 'Easy',
      studentsCompleted: 134,
      avgScore: 4.6,
      description: 'Learn animal names and their sounds'
    },
    {
      id: 5,
      name: 'Colors Matching',
      icon: '🎨',
      category: 'Colors',
      levels: '12 Colors',
      avgTime: '10 min',
      difficulty: 'Easy',
      studentsCompleted: 145,
      avgScore: 4.8,
      description: 'Match objects with their colors'
    },
    {
      id: 6,
      name: 'Number Counting',
      icon: '🔢',
      category: 'Numbers',
      levels: '1-10',
      avgTime: '12 min',
      difficulty: 'Easy',
      studentsCompleted: 138,
      avgScore: 4.3,
      description: 'Count objects and recognize numbers 1-10'
    },
  ];

  const handleStartActivity = (activity) => {
    alert(`Starting activity: ${activity.name}\n\nThis will launch the activity on the Smart TV (Mimi screen).`);
    // In production: window.open('/student?activity=' + activity.id);
  };

  const handleConfigureActivity = (activity) => {
    setSelectedActivity(activity);
    setShowConfigModal(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">Learning Activities</h1>
          <p className="text-text/60">Manage and launch classroom activities</p>
        </div>
        <Button variant="primary" icon={Plus}>
          Create Custom Activity
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Total Activities</p>
          <p className="text-4xl font-bold text-blue-900">{activities.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-green-700 mb-1">Completions</p>
          <p className="text-4xl font-bold text-green-900">
            {activities.reduce((sum, a) => sum + a.studentsCompleted, 0)}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm text-purple-700 mb-1">Avg Score</p>
          <p className="text-4xl font-bold text-purple-900">
            {(activities.reduce((sum, a) => sum + a.avgScore, 0) / activities.length).toFixed(1)}/5
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1">Avg Duration</p>
          <p className="text-4xl font-bold text-yellow-900">11m</p>
        </Card>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-4xl">
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-lg">{activity.name}</h3>
                    <p className="text-sm text-text/60">{activity.category}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text/70 mb-4">{activity.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text/60">Levels:</span>
                  <span className="font-semibold text-text">{activity.levels}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text/60">Avg Time:</span>
                  <span className="font-semibold text-text flex items-center gap-1">
                    <Clock size={14} />
                    {activity.avgTime}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text/60">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                <Users size={16} className="text-text/60" />
                <span className="text-sm text-text/70">
                  <strong>{activity.studentsCompleted}</strong> completions
                </span>
                <span className="ml-auto text-sm font-semibold text-text">
                  ⭐ {activity.avgScore}/5
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  icon={Play}
                  className="flex-1"
                  onClick={() => handleStartActivity(activity)}
                >
                  Start
                </Button>
                <Button
                  variant="outline"
                  icon={Settings}
                  onClick={() => handleConfigureActivity(activity)}
                >
                  Config
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Configure Activity Modal */}
      {selectedActivity && (
        <Modal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          title={`Configure: ${selectedActivity.name}`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Difficulty Level
              </label>
              <select className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                defaultValue={15}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                defaultValue={10}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-800">
                💡 These settings will apply the next time this activity is launched.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1" onClick={() => {
                alert('Settings saved!');
                setShowConfigModal(false);
              }}>
                Save Settings
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ActivitiesTab;