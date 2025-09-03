"use client"
import React from 'react';
import { Users, UserCheck, Activity, AlertTriangle } from 'lucide-react';
import Layout from '../layout/layout';
const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Dentists Signed Up",
      value: "150",
      icon: Users
    },
    {
      title: "Pending Approvals", 
      value: "15",
      icon: UserCheck
    },
    {
      title: "Active Accounts",
      value: "135",
      icon: Activity
    },
    {
      title: "System Alerts",
      value: "2 critical",
      icon: AlertTriangle
    }
  ];

  const recentActivity = [
    {
      type: "new_account",
      message: "Dr. Emily White registered a new account",
      time: "2 minutes ago",
      icon: "👤"
    },
    {
      type: "approved", 
      message: "Account for Dr. David Lee has been approved",
      time: "15 minutes ago",
      icon: "✅"
    },
    {
      type: "rejected",
      message: "Application for Dr. Sarah Khan was rejected due to incomplete documents",
      time: "1 hour ago",
      icon: "❌"
    },
    {
      type: "profile_update",
      message: "Dr. Alice Johnson updated her profile details",
      time: "3 hours ago",
      icon: "👤"
    },
    {
      type: "license_verified",
      message: "License for Dr. Michael Brown verified",
      time: "Yesterday, 10:30 AM",
      icon: "✅"
    }
  ];

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-gray-100 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="h-8 w-8 text-gray-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Manage Approvals</span>
            </button>
            
            <button className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Accounts</span>
            </button>
            
            <button className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Settings</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
          
          <div className="bg-white rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">Activity Feed</h3>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 py-3">
                  <div className="text-lg">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;