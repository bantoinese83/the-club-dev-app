"use client"

import { useState } from 'react'
import { AuthGuard } from '@/components/AuthGuard'
import Layout from '@/components/templates/Layout'
import { SearchEntries } from '@/components/organisms/SearchEntries'


export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <AuthGuard>
      <Layout isLoading={isLoading}>
        <h1 className="text-3xl font-bold mb-8">Search Entries</h1>
        <SearchEntries setIsLoading={setIsLoading} />
      </Layout>
    </AuthGuard>
  )
}