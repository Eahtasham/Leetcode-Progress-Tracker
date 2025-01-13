'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface LeetCodeProfileProps {
  data: Awaited<ReturnType<typeof import('../actions/fetchLeetCodeData').fetchLeetCodeData>>
}

const DIFFICULTY_COLORS = {
  Easy: '#00b8a3',
  Medium: '#ffc01e',
  Hard: '#ff375f'
}

export function LeetCodeProfile({ data }: LeetCodeProfileProps) {
  const pieChartData = data.progress.numAcceptedQuestions.map(item => ({
    name: item.difficulty,
    value: item.count,
    color: DIFFICULTY_COLORS[item.difficulty as keyof typeof DIFFICULTY_COLORS]
  }))

  const totalSolved = pieChartData.reduce((sum, item) => sum + item.value, 0)

  // Calculate problems submitted after January 1, 2025
  const problemsAfter2025 = data.recentSubmissions.filter(
    submission => new Date(parseInt(submission.timestamp) * 1000) > new Date('2025-01-01')
  ).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full mb-8 bg-white/10 backdrop-blur-md border-none text-white">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={data.avatar} alt={data.fullName} />
            <AvatarFallback>{data.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{data.fullName}</CardTitle>
            <p className="text-sm opacity-70">LeetCode Profile</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Problem Solving Statistics</h3>
              <div className="space-y-2">
                {pieChartData.map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-sm font-semibold">Total Solved</span>
                  <span className="font-semibold">{totalSolved}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-sm font-semibold">Solved after Jan 1, 2025</span>
                  <span className="font-semibold">{problemsAfter2025}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Difficulty Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-4 text-lg">Recent Submissions (Last 7)</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Problem</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentSubmissions.slice(0, 7).map((submission) => {
                    const date = new Date(parseInt(submission.timestamp) * 1000)
                    return (
                      <TableRow key={submission.id}>
                        <TableCell className="text-white">{submission.title}</TableCell>
                        <TableCell className="text-white">{date.toLocaleDateString()}</TableCell>
                        <TableCell className="text-white">{date.toLocaleTimeString()}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

