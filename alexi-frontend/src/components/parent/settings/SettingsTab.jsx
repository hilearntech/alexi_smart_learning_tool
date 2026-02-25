import React, { useState } from 'react';
import { Button, Card, Input } from '../../shared';
import { Save, User, Mail, Phone, Lock, Bell, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsTab = () => {
  const [formData, setFormData] = useState({
    name: 'Mr. Rajesh Sharma',
    email: 'rajesh.sharma@email.com',
    phone: '9876543210',
    occupation: 'Software Engineer',
    notifications: true,
    weeklyReports: true,
    progressAlerts: true,
    theme: 'light',
    language: 'english'
  });

  const [saveStatus, setSaveStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text mb-2">Settings</h1>
        <p className="text-text/60">Manage your account and preferences</p>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 text-green-800 px-4 py-3 rounded-xl border-2 border-green-300"
        >
          {saveStatus}
        </motion.div>
      )}

      {/* Profile Settings */}
      <Card>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {formData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text">{formData.name}</h3>
            <p className="text-text/60">Parent Account</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            label="Full Name"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            name="name"
          />
          <Input
            label="Email"
            icon={Mail}
            type="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
          />
          <Input
            label="Phone"
            icon={Phone}
            value={formData.phone}
            onChange={handleChange}
            name="phone"
          />
          <Input
            label="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            name="occupation"
          />
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
          <Bell size={24} className="text-primary-600" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="w-5 h-5 rounded-lg"
            />
            <div>
              <p className="font-semibold text-text">Enable Notifications</p>
              <p className="text-sm text-text/60">Receive updates about your child's progress</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              name="weeklyReports"
              checked={formData.weeklyReports}
              onChange={handleChange}
              className="w-5 h-5 rounded-lg"
            />
            <div>
              <p className="font-semibold text-text">Weekly Reports</p>
              <p className="text-sm text-text/60">Get weekly progress summaries</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              name="progressAlerts"
              checked={formData.progressAlerts}
              onChange={handleChange}
              className="w-5 h-5 rounded-lg"
            />
            <div>
              <p className="font-semibold text-text">Progress Alerts</p>
              <p className="text-sm text-text/60">Alert me about significant progress milestones</p>
            </div>
          </label>
        </div>
      </Card>

      {/* Display Settings */}
      <Card>
        <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
          <Palette size={24} className="text-primary-600" />
          Display Settings
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
          <Lock size={24} className="text-primary-600" />
          Security
        </h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            Two-Factor Authentication
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <Button variant="primary" icon={Save} onClick={handleSave} className="w-full">
        Save All Changes
      </Button>
    </div>
  );
};

export default SettingsTab;
