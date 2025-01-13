'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LeetCodeProfile } from '@/components/LeetCodeProfile'
import { fetchLeetCodeData } from './actions/fetchLeetCodeData'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState<string[]>(['eahtashamummam','parthib_mitra'])
  const [userData, setUserData] = useState<Record<string, Awaited<ReturnType<typeof fetchLeetCodeData>>>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedUsers = localStorage.getItem('leetcodeUsers')
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('leetcodeUsers', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    const fetchInitialData = async () => {
      for (const user of users) {
        if (!userData[user]) {
          try {
            const data = await fetchLeetCodeData(user)
            setUserData(prev => ({ ...prev, [user]: data }))
          } catch (error) {
            console.error(`Failed to fetch data for ${user}:`, error)
            setError(`Failed to fetch data for ${user}. Please try again later.`)
          }
        }
      }
    }

    fetchInitialData()
  }, [users])

  const addUser = async () => {
    if (!username) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLeetCodeData(username)
      setUserData(prev => ({ ...prev, [username]: data }))
      if (!users.includes(username)) {
        setUsers(prev => [...prev, username])
      }
      setUsername('')
    } catch (err) {
      console.error("Error adding user:", err)
      setError(`Failed to fetch user data for ${username}. Please check the username and try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-8 text-white"
      >
        LeetCode Profile Tracker
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-center items-center mb-8 gap-2"
      >
        <Input
          type="text"
          placeholder="Enter LeetCode username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full sm:w-64 bg-blue-800 text-white placeholder-white/50 border-white/30"
        />
        <Button onClick={addUser} disabled={loading} className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add User'
          )}
        </Button>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-center mb-4 bg-red-500/50 p-2 rounded"
        >
          {error}
        </motion.p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {users.map((user) => (
            userData[user] && (
              <motion.div
                key={user}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <LeetCodeProfile data={userData[user]} />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

