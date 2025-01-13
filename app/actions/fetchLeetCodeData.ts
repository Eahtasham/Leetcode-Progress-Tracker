'use server'

import { cache } from 'react'

interface LeetCodeData {
  recentSubmissions: {
    id: string
    title: string
    titleSlug: string
    timestamp: string
  }[]
  progress: {
    numAcceptedQuestions: { difficulty: string; count: number }[]
    numFailedQuestions: { difficulty: string; count: number }[]
    numUntouchedQuestions: { difficulty: string; count: number }[]
    userSessionBeatsPercentage: { difficulty: string; percentage: number }[]
    totalQuestionBeatsPercentage: number
  }
  fullName: string
  avatar: string
}

export const fetchLeetCodeData = cache(async (username: string): Promise<LeetCodeData> => {
  const graphqlUrl = "https://leetcode.com/graphql/"
  const headers = {
    "Content-Type": "application/json",
    "Referer": `https://leetcode.com/${username}/`,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  }

  const recentSubmissionsQuery = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
      matchedUser(username: $username) {
        profile {
          realName
          userAvatar
        }
      }
    }
  `
  const recentSubmissionsVariables = { username, limit: 10 }

  const userProgressQuery = `
    query userProfileUserQuestionProgressV2($userSlug: String!) {
      userProfileUserQuestionProgressV2(userSlug: $userSlug) {
        numAcceptedQuestions {
          count
          difficulty
        }
        numFailedQuestions {
          count
          difficulty
        }
        numUntouchedQuestions {
          count
          difficulty
        }
        userSessionBeatsPercentage {
          difficulty
          percentage
        }
        totalQuestionBeatsPercentage
      }
    }
  `
  const userProgressVariables = { userSlug: username }

  try {
    const [recentResponse, progressResponse] = await Promise.all([
      fetch(graphqlUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: recentSubmissionsQuery,
          variables: recentSubmissionsVariables
        })
      }),
      fetch(graphqlUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: userProgressQuery,
          variables: userProgressVariables
        })
      })
    ])

    if (!recentResponse.ok || !progressResponse.ok) {
      throw new Error(`HTTP error! status: ${recentResponse.status} ${progressResponse.status}`)
    }

    const [recentData, progressData] = await Promise.all([
      recentResponse.json(),
      progressResponse.json()
    ])

    if (recentData.errors || progressData.errors) {
      throw new Error(JSON.stringify(recentData.errors || progressData.errors))
    }

    if (!recentData.data || !progressData.data) {
      throw new Error('No data received from LeetCode API')
    }

    return {
      recentSubmissions: recentData.data.recentAcSubmissionList || [],
      progress: progressData.data.userProfileUserQuestionProgressV2 || {
        numAcceptedQuestions: [],
        numFailedQuestions: [],
        numUntouchedQuestions: [],
        userSessionBeatsPercentage: [],
        totalQuestionBeatsPercentage: 0
      },
      fullName: recentData.data.matchedUser?.profile?.realName || username,
      avatar: recentData.data.matchedUser?.profile?.userAvatar || ''
    }
  } catch (error) {
    console.error("An error occurred:", error)
    throw new Error(`Failed to fetch LeetCode data: ${error instanceof Error ? error.message : String(error)}`)
  }
})

