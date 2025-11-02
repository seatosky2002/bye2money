import { useState, useEffect } from 'react'

interface Expense {
  id: string
  date: string
  amount: number
  description: string
  paymentMethod: string
  category: string
  type: 'income' | 'expense'
  createdAt: string
}

interface DailyStats {
  income: number
  expense: number
  total: number
}

interface MonthlyStats {
  [date: string]: DailyStats
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({})

  useEffect(() => {
    fetchExpenses()
  }, [])

  useEffect(() => {
    calculateMonthlyStats()
  }, [expenses, currentDate])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/expenses')
      if (!response.ok) {
        throw new Error('Failed to fetch expenses')
      }
      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const calculateMonthlyStats = () => {
    const stats: MonthlyStats = {}
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    expenses.forEach(expense => {
      // Parse date format "2023. 08. 17"
      const parts = expense.date.split('. ')
      const expenseYear = parseInt(parts[0])
      const expenseMonth = parseInt(parts[1])
      const expenseDay = parseInt(parts[2])

      // Only include expenses from current month
      if (expenseYear === year && expenseMonth === month) {
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(expenseDay).padStart(2, '0')}`

        if (!stats[dateKey]) {
          stats[dateKey] = { income: 0, expense: 0, total: 0 }
        }

        if (expense.type === 'income') {
          stats[dateKey].income += expense.amount
          stats[dateKey].total += expense.amount
        } else {
          stats[dateKey].expense += expense.amount
          stats[dateKey].total -= expense.amount
        }
      }
    })

    setMonthlyStats(stats)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR')
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="border border-gray-200 bg-gray-50 min-h-[120px]"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const stats = monthlyStats[dateKey]
      const today = isToday(day)

      days.push(
        <div
          key={day}
          className={`border border-gray-200 min-h-[120px] p-2 ${
            today ? 'bg-blue-50' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-medium mb-2 ${today ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          {stats && (
            <div className="space-y-1 text-xs">
              {stats.income > 0 && (
                <div className="text-green-600">
                  +{formatAmount(stats.income)}
                </div>
              )}
              {stats.expense > 0 && (
                <div className="text-red-600">
                  -{formatAmount(stats.expense)}
                </div>
              )}
              {(stats.income > 0 || stats.expense > 0) && (
                <div className={`font-medium pt-1 border-t border-gray-200 ${
                  stats.total >= 0 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {formatAmount(stats.total)}
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  // Calculate monthly totals
  const monthlyTotals = Object.values(monthlyStats).reduce(
    (acc, stats) => ({
      income: acc.income + stats.income,
      expense: acc.expense + stats.expense,
      total: acc.total + stats.total
    }),
    { income: 0, expense: 0, total: 0 }
  )

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-400">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="text-center">
          <div className="text-xs text-white opacity-90">{currentDate.getFullYear()}</div>
          <div className="text-3xl font-semibold text-white">{currentDate.getMonth() + 1}</div>
          <div className="text-xs text-white opacity-75">
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][currentDate.getMonth()]}
          </div>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 15l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-medium py-2 ${
                index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0">
          {renderCalendar()}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-gray-600">총 수입: </span>
              <span className="font-medium text-green-600">
                {formatAmount(monthlyTotals.income)}원
              </span>
            </div>
            <div>
              <span className="text-gray-600">총 지출: </span>
              <span className="font-medium text-red-600">
                {formatAmount(monthlyTotals.expense)}원
              </span>
            </div>
          </div>
          <div>
            <span className="text-gray-600">총합: </span>
            <span className={`font-bold text-base ${
              monthlyTotals.total >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              {monthlyTotals.total >= 0 ? '+' : ''}{formatAmount(monthlyTotals.total)}원
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
