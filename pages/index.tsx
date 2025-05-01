import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarDays, CircleCheck } from 'lucide-react';
import { format } from 'date-fns';

const initialHabits = [
  { id: '1', name: 'Morning Meditation', description: 'Start the day with 10 minutes of mindfulness', streak: 5, completed: false, color: 'blue' },
  { id: '2', name: 'Read 20 Pages', description: 'Daily reading habit for continuous learning', streak: 12, completed: false, color: 'purple' },
  { id: '3', name: 'Exercise', description: 'At least 30 minutes of physical activity', streak: 3, completed: false, color: 'pink' },
  { id: '4', name: 'Drink Water', description: '8 glasses of water throughout the day', streak: 15, completed: false, color: 'green' },
  { id: '5', name: 'Code Practice', description: 'One hour of coding practice or learning', streak: 7, completed: false, color: 'yellow' },
];

const initialWeeklyData = [
  { day: 'Mon', completed: 4, total: 5 },
  { day: 'Tue', completed: 3, total: 5 },
  { day: 'Wed', completed: 5, total: 5 },
  { day: 'Thu', completed: 2, total: 5 },
  { day: 'Fri', completed: 4, total: 5 },
  { day: 'Sat', completed: 3, total: 5 },
  { day: 'Sun', completed: 0, total: 5 },
];

const WeeklyProgressChart = ({ data }) => {
  const getPercent = (completed, total) => total > 0 ? Math.round((completed / total) * 100) : 0;
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const { value: completed, payload: dataPayload } = payload[0];
      const total = dataPayload?.total;
      const percent = getPercent(completed, total);
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-100">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">{`${completed} of ${total} habits completed`}</p>
          <p className="text-sm font-medium" style={{ color: percent >= 80 ? '#22c55e' : '#6366f1' }}>{`${percent}% completion`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} animationDuration={300} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>0%</span><span>Habit Completion Rate</span><span>100%</span>
      </div>
    </div>
  );
};

const UserSummary = ({ completedToday, totalHabits, bestStreak }) => {
  const completionRate = Math.round((completedToday / totalHabits) * 100) || 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Completed Today</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-indigo-600">{completedToday}</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-lg text-gray-400">{totalHabits}</span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Completion Rate</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-indigo-600">{completionRate}%</span>
          <div className="ml-3 w-24 bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Best Streak</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-indigo-600">{bestStreak}</span>
          <span className="ml-2 text-gray-400">days</span>
        </div>
      </div>
    </div>
  );
};

const DailyCheckIn = ({ isCheckedIn, onCheckIn, lastCheckIn, dailyStreak }) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${isCheckedIn ? "border-green-500" : "border-indigo-500"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Daily Check-in</h3>
          <p className="text-sm text-gray-500">{isCheckedIn ? `Last check-in: ${lastCheckIn ? format(lastCheckIn, 'h:mm a') : 'Today'}` : 'Start your day right'}</p>
          <p className="text-sm text-gray-500 mt-2">{`Daily Streak: ${dailyStreak} days`}</p>
        </div>
        <button onClick={onCheckIn} disabled={isCheckedIn} className={`flex items-center gap-2 rounded-full px-4 py-2 text-white font-medium transition-all ${isCheckedIn ? "bg-green-500" : "bg-indigo-500"}`}>
          {isCheckedIn ? (<><CircleCheck className="w-5 h-5" /><span>Checked In</span></>) : (<span>Check In Now</span>)}
        </button>
      </div>
      {isCheckedIn && (<div className="mt-4 bg-green-50 rounded-md p-3 text-sm text-green-700">Great job! You've checked in for today. Keep the momentum going!</div>)}
    </div>
  );
};

const App = () => {
  const [habits, setHabits] = useState(initialHabits);
  const [weeklyData, setWeeklyData] = useState(initialWeeklyData);
  const [checkedIn, setCheckedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [dailyStreak, setDailyStreak] = useState(0);

  const handleCheckIn = () => {
    setCheckedIn(true);
    setLastCheckIn(new Date());
    setDailyStreak(prevStreak => prevStreak + 1);  // Increment daily streak
  };

  const handleCompleteHabit = (id) => {
    setHabits(prev => {
      const updatedHabits = prev.map(habit => habit.id === id ? { ...habit, completed: true, streak: habit.streak + 1 } : habit);
      // Update weekly data
      const newWeeklyData = [...weeklyData];
      const todayIndex = new Date().getDay();  // Get current day (0: Sunday, 1: Monday, etc.)
      if (newWeeklyData[todayIndex]) {
        newWeeklyData[todayIndex].completed += 1;  // Increment completed habits for today
      }
      setWeeklyData(newWeeklyData);
      return updatedHabits;
    });
  };

  const completedToday = habits.filter(h => h.completed).length;
  const bestStreak = Math.max(...habits.map(h => h.streak));

  return (
    <div className="p-10 space-y-6 mx-auto bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Habit Tracker Dashboard</h1>
      <DailyCheckIn isCheckedIn={checkedIn} onCheckIn={handleCheckIn} lastCheckIn={lastCheckIn} dailyStreak={dailyStreak} />
      <UserSummary completedToday={completedToday} totalHabits={habits.length} bestStreak={bestStreak} />
      <WeeklyProgressChart data={weeklyData} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => (
          <div key={habit.id} className={`rounded-xl p-5 shadow-md text-white ${habit.completed ? 'bg-green-500' : 'bg-indigo-500'}`}>
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">{habit.name}</h3>
              <button disabled={habit.completed} onClick={() => handleCompleteHabit(habit.id)} className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
                {habit.completed ? 'Done' : 'Complete'}
              </button>
            </div>
            <p className="text-sm mt-1 mb-2">{habit.description}</p>
            <p className="text-sm">Streak: <span className="font-bold">{habit.streak}</span> days</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
