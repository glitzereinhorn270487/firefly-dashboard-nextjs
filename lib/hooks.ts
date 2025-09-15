'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { endpoints } from './api'

export function useCapital() {
  return useQuery({ queryKey: ['capital'], queryFn: endpoints.capital })
}
export function usePnlSummary() {
  return useQuery({ queryKey: ['pnlSummary'], queryFn: endpoints.pnlSummary })
}
export function useInvestmentLevel() {
  return useQuery({ queryKey: ['investment-level'], queryFn: endpoints.investmentLevel })
}
export function useTrades(status: 'open' | 'closed') {
  return useQuery({
    queryKey: ['trades', status],
    queryFn: status === 'open' ? endpoints.tradesOpen : endpoints.tradesClosed,
  })
}
export function useBotStatus() {
  return useQuery({ queryKey: ['bot-status'], queryFn: endpoints.botStatus, refetchInterval: 5000 })
}
export function useBotControl() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (isRunning: boolean) => (isRunning ? endpoints.botStop() : endpoints.botStart()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bot-status'] }),
  })
}