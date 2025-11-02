import { useState } from 'react'

interface ExpenseFormData {
  date: string
  amount: number
  description: string
  paymentMethod: string
  category: string
  type: 'income' | 'expense'
}

function ExpenseForm() {
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: '2023. 08. 17',
    amount: 0,
    description: '',
    paymentMethod: '',
    category: '',
    type: 'expense'
  })

  // 수입/지출 타입에 따른 결제수단 옵션
  const paymentMethodOptions = {
    income: [
      { value: '현대카드', label: '현대카드' },
      { value: '국민카드', label: '국민카드' },
      { value: '현금', label: '현금' }
    ],
    expense: [
      { value: '현대카드', label: '현대카드' },
      { value: '국민카드', label: '국민카드' },
      { value: '현금', label: '현금' }
    ]
  }

  // 수입/지출 타입에 따른 카테고리 옵션
  const categoryOptions = {
    income: [
      { value: '월급', label: '월급' },
      { value: '용돈', label: '용돈' },
      { value: '기타수입', label: '기타수입' }
    ],
    expense: [
      { value: '생활', label: '생활' },
      { value: '식비', label: '식비' },
      { value: '교통', label: '교통' },
      { value: '쇼핑/뷰티', label: '쇼핑/뷰티' },
      { value: '의료/건강', label: '의료/건강' },
      { value: '문화/여가', label: '문화/여가' },
      { value: '미분류', label: '미분류' }
    ]
  }

  // 모든 필드가 입력되었는지 확인
  const isFormValid = () => {
    return formData.date !== '' &&
           formData.amount > 0 &&
           formData.description.trim() !== '' &&
           formData.paymentMethod !== '' &&
           formData.category !== ''
  }

  const handleSubmit = async () => {
    // 유효성 검증
    if (!isFormValid()) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    // 날짜 형식 검증
    const dateRegex = /^\d{4}\.\s\d{2}\.\s\d{2}$/
    if (!dateRegex.test(formData.date)) {
      alert('날짜 형식이 올바르지 않습니다. (예: 2023. 08. 17)')
      return
    }

    // 금액 검증
    if (formData.amount <= 0) {
      alert('금액은 0보다 커야 합니다.')
      return
    }

    // 내용 길이 검증
    if (formData.description.length > 32) {
      alert('내용은 32자 이내로 입력해주세요.')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create expense')
      }

      const data = await response.json()
      console.log('Expense created:', data)

      // 폼 초기화
      setFormData({
        date: '2023. 08. 17',
        amount: 0,
        description: '',
        paymentMethod: '',
        category: '',
        type: 'expense'
      })

      alert(formData.type === 'income' ? '수입이 저장되었습니다!' : '지출이 저장되었습니다!')

      // 페이지 새로고침하여 목록 업데이트
      window.location.reload()
    } catch (error) {
      console.error('Error:', error)
      alert('저장에 실패했습니다.')
    }
  }

  // 타입 변경 시 결제수단과 카테고리 초기화
  const handleTypeChange = (newType: 'income' | 'expense') => {
    setFormData({
      ...formData,
      type: newType,
      paymentMethod: '',
      category: ''
    })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => { //사용자가 입력한 객체
    const value = e.target.value
    if (value.length <= 32) {
      setFormData({ ...formData, description: value }) //descritiona만 바꾸는 것. 나머지는 유지
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setFormData({ ...formData, amount: parseInt(value) || 0 })
  }

  return (
    <div className="flex items-center bg-white px-6 py-5 rounded-xl border border-gray-200 gap-0 w-full max-w-full overflow-x-auto">
      {/* 수입/지출 타입 */}
      <div className="flex flex-col gap-1 px-4 py-2 border-r border-gray-200 min-w-[120px]">
        <label className="text-xs text-gray-500 font-normal whitespace-nowrap">구분</label>
        <select
          value={formData.type}
          onChange={(e) => handleTypeChange(e.target.value as 'income' | 'expense')}
          className="text-base font-medium text-gray-900 outline-none bg-transparent border-0 p-0 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2710%27%20height%3D%276%27%20viewBox%3D%270%200%2010%206%27%20fill%3D%27none%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cpath%20d%3D%27M1%201L5%205L9%201%27%20stroke%3D%27%23999%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_center] pr-6"
        >
          <option value="expense">지출</option>
          <option value="income">수입</option>
        </select>
      </div>

      {/* 일자 */}
      <div className="flex flex-col gap-1 px-4 py-2 border-r border-gray-200 min-w-[140px]">
        <label className="text-xs text-gray-500 font-normal whitespace-nowrap">일자</label>
        <input
          type="text"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="text-base font-medium text-gray-900 outline-none bg-transparent border-0 p-0"
        />
      </div>

      {/* 금액 */}
      <div className="flex flex-col gap-1 px-4 py-2 border-r border-gray-200 min-w-[160px]">
        <label className="text-xs text-gray-500 font-normal whitespace-nowrap">금액</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">-</span>
          <input
            type="text"
            value={formData.amount || ''}
            onChange={handleAmountChange}
            placeholder="0"
            className="flex-1 text-base font-medium text-gray-900 outline-none bg-transparent border-0 p-0 text-right"
            inputMode="numeric"
          />
          <span className="text-base font-medium text-gray-900">원</span>
        </div>
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-1 px-4 py-2 border-r border-gray-200 flex-1 min-w-[250px]">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500 font-normal whitespace-nowrap">내용</label>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formData.description.length}/32
          </span>
        </div>
        <input
          type="text"
          placeholder="입력하세요"
          value={formData.description}
          onChange={handleDescriptionChange}
          className="w-full text-base font-medium text-gray-900 outline-none bg-transparent border-0 p-0"
        />
      </div>

      {/* 결제수단 */}
      <div className="flex flex-col gap-1 px-4 py-2 border-r border-gray-200 min-w-[140px]">
        <label className="text-xs text-gray-500 font-normal whitespace-nowrap">결제수단</label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          className="text-base font-medium text-gray-900 outline-none bg-transparent border-0 p-0 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2210%27%20height%3D%276%27%20viewBox%3D%270%200%2010%206%27%20fill%3D%27none%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cpath%20d%3D%27M1%201L5%205L9%201%27%20stroke%3D%27%23999%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_center] pr-6"
        >
          <option value="">선택하세요</option>
          {paymentMethodOptions[formData.type].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 분류 */}
      <div className="flex flex-col gap-1 px-4 py-2 min-w-[140px]">
        <label className="text-xs text-gray-500 font-normal whitespace-nowrap">분류</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="text-base font-medium text-gray-900 outline-none bg-transparent border-0 p-0 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2710%27%20height%3D%276%27%20viewBox%3D%270%200%2010%206%27%20fill%3D%27none%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cpath%20d%3D%27M1%201L5%205L9%201%27%20stroke%3D%27%23999%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_center] pr-6"
        >
          <option value="">선택하세요</option>
          {categoryOptions[formData.type].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid()}
        className={`w-12 h-12 rounded-full border-0 flex items-center justify-center flex-shrink-0 ml-4 transition-colors ${
          isFormValid()
            ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
//신경쓴 부분은 handle함수 만든 이유. 제약을 걸기 위한 것.
export default ExpenseForm
