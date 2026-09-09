export const getMonthDateRange = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  return getMonthDateRange(now.getFullYear(), now.getMonth());
};

export const getPreviousMonths = (count: number = 12) => {
  const months = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleString('default', { month: 'long' }),
      year: date.getFullYear(),
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      ...getMonthDateRange(date.getFullYear(), date.getMonth()),
    });
  }
  
  return months;
};