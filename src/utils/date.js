import { format, isBefore, subYears } from 'date-fns'

export const formatDate = format

export const parseDate = str => {
  const [ year, month, day ] = str.split('-')
  return { year, month, day }
}

export const isYearsOld = (date, years) => isBefore(date, subYears(new Date(), years))
