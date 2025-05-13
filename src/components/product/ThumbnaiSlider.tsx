import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import '../../styles/scrollbar.css'

type ThumbnailSliderProps = {
  images: string[]
  currentIndex: number
  setCurrentIndex: (index: number) => void
}

const ThumbnailSlider: React.FC<ThumbnailSliderProps> = ({
  images,
  currentIndex,
  setCurrentIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Scroll to the selected thumbnail
  useEffect(() => {
    const selected = itemRefs.current[currentIndex]
    if (selected && containerRef.current) {
      selected.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }, [currentIndex])

  return (
    <div
      ref={containerRef}
      className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto w-full md:w-auto max-h-120 
        scroll-smooth md:pe-1 pb-1 custom-scrollbar"
      style={{
        scrollSnapType: 'x mandatory',
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          ref={(el) => { itemRefs.current[i] = el }}
          onClick={() => setCurrentIndex(i)}
          className={`
            relative cursor-pointer border
            ${i === currentIndex ? 'border-blue-500 brightness-75' : 'border-gray-200'}
            flex-shrink-0 w-20 h-20 md:w-18 md:h-18
            scroll-snap-align-start rounded overflow-hidden
          `}
        >
          <Image
            src={src}
            alt={`thumb-${i}`}
            width={80}
            height={80}
            className="object-cover"
            sizes="(max-width: 768px) 80px, 72px"
          />
        </div>
      ))}
    </div>
  )
}

export default ThumbnailSlider
