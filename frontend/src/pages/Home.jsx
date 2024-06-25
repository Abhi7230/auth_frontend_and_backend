import React from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/Footer'
import HomePage from '@/components/HomePage'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}

export default Home