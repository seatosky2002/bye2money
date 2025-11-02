import { useState } from 'react'
import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'

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

function App() {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const handleClearEdit = () => {
    setEditingExpense(null)
  }

  const handleExpenseUpdated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6">
          <ExpenseForm
            editingExpense={editingExpense}
            onClearEdit={handleClearEdit}
            onExpenseUpdated={handleExpenseUpdated}
          />
        </div>
        <ExpenseList
          onEditExpense={handleEditExpense}
          refreshTrigger={refreshTrigger}
          selectedExpenseId={editingExpense?.id || null}
        />
      </div>
    </div>
  )
}

export default App
