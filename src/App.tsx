import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6">
          <ExpenseForm />
        </div>
        <ExpenseList />
      </div>
    </div>
  )
}

export default App
