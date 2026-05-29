import React, { useState } from "react";
import {
  Bell,
  BellRing,
  CheckCheck,
  Clock,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Trash2,
  Inbox,
} from "lucide-react";

interface Notification {
  id: number;
  type: "budget" | "security" | "income" | "expense" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "budget",
      title: "Budget Alert: Food & Drinks",
      message:
        "You have reached 90% of your monthly grocery budget. Try to minimize extra spending.",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "security",
      title: "New Login Detected",
      message:
        "A new login was detected from a Chrome browser on Windows in New York, USA.",
      timestamp: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "income",
      title: "Income Received",
      message:
        "Your freelance payment of $750.00 from Client A has been successfully added.",
      timestamp: "Yesterday",
      read: true,
    },
    {
      id: 4,
      type: "system",
      title: "System Maintenance",
      message:
        "SpendWise will be undergoing scheduled maintenance this Sunday from 2 AM to 4 AM UTC.",
      timestamp: "2 days ago",
      read: true,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "budget":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "security":
        return <ShieldAlert className="h-5 w-5 text-rose-500" />;
      case "income":
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case "expense":
        return <TrendingDown className="h-5 w-5 text-indigo-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Bell className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 font-medium">
              Stay updated with your account activity.
            </p>
          </div>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <CheckCheck className="h-4 w-4 mr-1.5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`group relative bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
                notif.read
                  ? "border-gray-100 opacity-75"
                  : "border-indigo-100 shadow-sm ring-1 ring-indigo-50"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-2.5 rounded-xl ${
                    notif.read ? "bg-gray-50" : "bg-indigo-50"
                  }`}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`text-sm font-bold truncate ${
                        notif.read ? "text-gray-700" : "text-gray-900"
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center uppercase ml-4">
                      <Clock className="h-3 w-3 mr-1" />
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
            <Inbox className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              All caught up! No new notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
