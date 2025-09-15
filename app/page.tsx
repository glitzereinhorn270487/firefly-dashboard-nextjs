'use client'
import { useState } from "react" // Wichtig für Interaktivität
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { useBotStatus, useBotControl, useCapital, usePnlSummary, useInvestmentLevel, useTrades } from "lib/hooks"
import { SettingsIcon } from "lucide-react"
import type { Trade } from "lib/types"
// Importiere das Einstellungsmenü (wir müssen es noch erstellen)
// import SettingsMenu from "@/components/settings-menu"

export default function Dashboard() {
  // --- STATE-VERWALTUNG ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Zustand für das Menü

  // --- DATEN-HOOKS ---
  const { data: statusData, isLoading: isStatusLoading } = useBotStatus()
  const { mutate: toggleBot } = useBotControl()
  const isRunning = statusData?.status === 'running'

  const { data: capitalData, isLoading: isCapitalLoading } = useCapital()
  const { data: pnlData, isLoading: isPnlLoading } = usePnlSummary()
  const { data: levelData, isLoading: isLevelLoading } = useInvestmentLevel()

  const { data: openTrades, isLoading: isOpenTradesLoading } = useTrades('open')
  const { data: closedTrades, isLoading: isClosedTradesLoading } = useTrades('closed')

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-950 text-gray-50 p-6 space-y-6">
      <header className="flex items-center justify-between pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Switch
            id="bot-status"
            checked={isRunning}
            onCheckedChange={() => toggleBot(isRunning)}
            disabled={isStatusLoading}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
          />
          <label htmlFor="bot-status" className="text-base font-medium">
            {isStatusLoading ? "Lade..." : isRunning ? "Bot Aktiv" : "Bot Inaktiv"}
          </label>
        </div>
        {/* Button öffnet jetzt das Menü */}
        <Button onClick={() => setIsSettingsOpen(true)} variant="outline" size="icon" className="bg-transparent border-gray-700 hover:bg-gray-800">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </header>
      <main className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Gesamtkapital</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {isCapitalLoading ? "..." : `$${capitalData?.total?.toFixed(2) ?? '0.00'}`}
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Gewinn/Verlust</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {isPnlLoading ? "..." : `${pnlData?.pnl?.toFixed(2) ?? '0.00'} $`}
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Investmentstufe</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {isLevelLoading ? "Lade..." : `Level ${levelData?.level ?? 'N/A'}`}
          </CardContent>
        </Card>
      </main>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Offene Positionen</h2>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead>Token</TableHead>
                <TableHead>PnL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isOpenTradesLoading ? (
                <TableRow><TableCell colSpan={2}>Lade Trades...</TableCell></TableRow>
              ) : (
                openTrades?.map((trade: Trade) => (
                  <TableRow key={trade.id} className="border-gray-800">
                    <TableCell className="font-medium">{trade.token_address}</TableCell>
                    <TableCell className={trade.pnl > 0 ? "text-green-400" : "text-red-400"}>{trade.pnl?.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Geschlossene Positionen</h2>
          {/* Tabelle für geschlossene Positionen hier... */}
        </div>
      </div>
      
      {/* Das Einstellungsmenü (wird nur angezeigt, wenn isSettingsOpen true ist) */}
      {/* <SettingsMenu isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} /> */}
    </div>
  )
}