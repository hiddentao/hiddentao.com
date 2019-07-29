import { format, isBefore, subYears, subMonths } from 'date-fns'

export const formatDate = format

export const parseDate = str => {
  const [ year, month, day ] = str.split('-')
  return { year, month, day }
}

export const isYearsOld = (date, years) => isBefore(date, subYears(new Date(), years))

export const isMonthsOld = (date, months) => isBefore(date, subMonths(new Date(), months))
