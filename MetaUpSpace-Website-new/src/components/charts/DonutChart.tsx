"use client"
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartEvent, ActiveElement, Point, BubbleDataPoint, ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DonutChartWithCurvyArrow() {
  const chartRef = useRef<
    ChartJS<
      "doughnut",
      (number | [number, number] | Point | BubbleDataPoint | null)[],
      unknown
    > | null
  >(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean
    label: string
    x: number
    y: number
    position: 'left' | 'right' | 'top' | 'bottom'
  }>({ visible: false, label: '', x: 0, y: 0, position: 'right' })

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const data = {
    labels: ['Theory', 'Execution'],
    datasets: [
      {
        data: [20, 80],
        backgroundColor: ['#2558EB', '#FFFFFF'],
        borderWidth: 0,
        hoverOffset: isMobile ? 4 : 8,
      },
    ],
  }

  const handleHover = useCallback((event: ChartEvent, activeElements: ActiveElement[]) => {
    if (activeElements.length > 0 && chartRef.current && containerRef.current) {
      const chart = chartRef.current
      const element = activeElements[0]
      const datasetIndex = element.datasetIndex
      const index = element.index
      const label = (chart.data.labels?.[index] as string) ?? ''

      const canvas = chart.canvas as HTMLCanvasElement
      const containerRect = containerRef.current.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()

      const meta = chart.getDatasetMeta(datasetIndex)
      const arcElement = meta.data[index] as unknown as ArcElement

      const angle = (arcElement.startAngle + arcElement.endAngle) / 2
      const outerRadius = arcElement.outerRadius
      const centerX = arcElement.x
      const centerY = arcElement.y

      // Position exactly on the outer boundary of the chart
      const edgeX = centerX + Math.cos(angle) * outerRadius
      const edgeY = centerY + Math.sin(angle) * outerRadius

      const containerX = edgeX + (canvasRect.left - containerRect.left)
      const containerY = edgeY + (canvasRect.top - containerRect.top)

      // Determine position based on angle (which quadrant)
      // Angle 0 = right, PI/2 = bottom, PI = left, 3PI/2 = top
      const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
      
      let position: 'left' | 'right' | 'top' | 'bottom' = 'right'
      
      if (isMobile) {
        // On mobile, use top/bottom positioning
        position = normalizedAngle > Math.PI ? 'top' : 'bottom'
      } else {
        // On desktop, use left/right based on which side of chart
        if (normalizedAngle > Math.PI / 2 && normalizedAngle < 3 * Math.PI / 2) {
          position = 'left'
        } else {
          position = 'right'
        }
      }

      setTooltipData({
        visible: true,
        label,
        x: containerX,
        y: containerY,
        position,
      })
    } else if (tooltipData.visible) {
      // Only update state if tooltip is currently visible
      setTooltipData((prev) => ({ ...prev, visible: false }))
    }
  }, [isMobile, tooltipData.visible])

  // Handle mouse leave to close tooltip
  const handleMouseLeave = useCallback(() => {
    setTooltipData((prev) => ({ ...prev, visible: false }))
  }, [])

  const options: ChartOptions<'doughnut'> = {
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: true,
    onHover: handleHover,
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
  }

  // Get tooltip styles based on position
  const getTooltipStyle = () => {
    const baseStyle: React.CSSProperties = {
      transition: 'opacity 0.15s ease-in-out',
    }

    if (tooltipData.position === 'top' || tooltipData.position === 'bottom') {
      return {
        ...baseStyle,
        left: tooltipData.x,
        top: tooltipData.position === 'top' ? tooltipData.y - 16 : tooltipData.y + 16,
        transform: tooltipData.position === 'top' 
          ? 'translate(-50%, -100%)' 
          : 'translate(-50%, 0)',
      }
    }

    return {
      ...baseStyle,
      left: tooltipData.position === 'right' ? tooltipData.x : 'auto',
      right: tooltipData.position === 'left' ? `calc(100% - ${tooltipData.x}px)` : 'auto',
      top: tooltipData.y,
      transform: 'translateY(-50%)',
    }
  }

  // Responsive SVG size
  const svgSize = isMobile ? { width: 36, height: 24 } : { width: 60, height: 40 }
  const svgMargin = isMobile ? '6px' : '12px'

  const renderTooltipContent = () => {
    const textStyle: React.CSSProperties = {
      fontFamily: "'Lucida Handwriting', 'Brush Script MT', cursive",
      fontSize: isMobile ? 'clamp(14px, 4vw, 18px)' : 'clamp(18px, 2.5vw, 28px)',
      fontWeight: 400,
      lineHeight: '132%',
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
    }

    // Vertical tooltip for mobile
    if (tooltipData.position === 'top' || tooltipData.position === 'bottom') {
      return (
        <div className="flex flex-col items-center">
          {tooltipData.position === 'bottom' && (
            <svg width={svgSize.width} height={svgSize.height} viewBox="0 0 60 40" style={{ marginBottom: svgMargin, overflow: 'visible', transform: 'rotate(-90deg)' }}>
              <path d="M 55 20 Q 35 8, 15 18 Q 8 22, 3 20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 10 14 L 3 20 L 10 26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span className="text-white italic" style={textStyle}>
            {tooltipData.label}
          </span>
          {tooltipData.position === 'top' && (
            <svg width={svgSize.width} height={svgSize.height} viewBox="0 0 60 40" style={{ marginTop: svgMargin, overflow: 'visible', transform: 'rotate(90deg)' }}>
              <path d="M 55 20 Q 35 8, 15 18 Q 8 22, 3 20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 10 14 L 3 20 L 10 26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      )
    }

    // Horizontal tooltip for desktop
    if (tooltipData.position === 'right') {
      return (
        <>
          <svg width={svgSize.width} height={svgSize.height} viewBox="0 0 60 40" style={{ marginRight: svgMargin, overflow: 'visible', flexShrink: 0 }}>
            <path d="M 55 20 Q 35 8, 15 18 Q 8 22, 3 20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 10 14 L 3 20 L 10 26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white italic" style={textStyle}>
            {tooltipData.label}
          </span>
        </>
      )
    }

    return (
      <>
        <span className="text-white italic" style={textStyle}>
          {tooltipData.label}
        </span>
        <svg width={svgSize.width} height={svgSize.height} viewBox="0 0 60 40" style={{ marginLeft: svgMargin, overflow: 'visible', flexShrink: 0 }}>
          <path d="M 5 20 Q 25 8, 45 18 Q 52 22, 57 20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 50 14 L 57 20 L 50 26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center relative overflow-visible"
      style={{ 
        minHeight: isMobile ? '380px' : '500px',
        padding: isMobile ? '50px 20px' : '80px 48px',
      }}
    >
      {/* Chart container with responsive sizing */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: isMobile ? 'min(280px, 80vw)' : 'min(420px, 45vw)',
          height: isMobile ? 'min(280px, 80vw)' : 'min(420px, 45vw)',
          maxWidth: '480px',
          maxHeight: '480px',
        }}
        onMouseLeave={handleMouseLeave}
      >
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>

      {/* Responsive Tooltip */}
      {tooltipData.visible && (
        <div
          className="absolute pointer-events-none z-50 flex items-center"
          style={getTooltipStyle()}
        >
          {renderTooltipContent()}
        </div>
      )}
    </div>
  )
}