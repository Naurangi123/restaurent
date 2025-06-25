import React, { Suspense, lazy } from 'react'
import Header from './Header'
import MainSection from './MainSection'
import StarterSection from './StarterSection'

const GallerySection = lazy(() => import('./GallerySection'))
const BookingSection = lazy(() => import('./BookingSection'))
const ReviewSection = lazy(() => import('./ReviewSection'))

export default function Home() {
    return (
        <>
            <Header />
            <MainSection />
            <StarterSection />
            <Suspense fallback={<div>Loading booking...</div>}>
                <BookingSection />
            </Suspense>

            <Suspense fallback={<div>Loading gallery...</div>}>
                <GallerySection />
            </Suspense>
            <Suspense fallback={<div>Loading reviews...</div>}>
                <ReviewSection />
            </Suspense>

        </>
    )
}
