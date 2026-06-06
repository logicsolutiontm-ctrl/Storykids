import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import OrderForm from './components/OrderForm'
import Admin from './Admin'
import OurWork from './OurWork'
import StoryDetail from './StoryDetail'
import ReadStory from './ReadStory'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/our-work" element={<OurWork />} />
        <Route path="/story/:id" element={<StoryDetail />} />
        <Route path="/read/:id" element={<ReadStory />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App