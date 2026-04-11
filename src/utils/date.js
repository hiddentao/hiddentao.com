import { format } from 'date-fns'

export const formatDate = format

export const parseDate = str => {
  const [ year, month, day ] = str.split('-')
  return { year, month, day }
}
