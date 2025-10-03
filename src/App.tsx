import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import type { Chart as ChartType } from 'chart.js'
import './App.css'

type UsagePoint = { time: number; GPU_GT_Usage_Percentage: number }
type D3DUsagePoint = { time: number; GPU_D3D_Usage_Percentage: number }

 

function App() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const d3dChartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<ChartType | null>(null)
  const d3dChartInstanceRef = useRef<ChartType | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      if (!chartRef.current) return
      try {
        const [myVideoResp, videoJsResp] = await Promise.all([
          fetch('/researchData/myVideoPlayerPerformance.json', { signal: controller.signal }),
          fetch('/researchData/videoJsPerformance.json', { signal: controller.signal })
        ])
        const [myVideoJson, videoJsJson] = await Promise.all([
          myVideoResp.json(),
          videoJsResp.json()
        ])

        const toSeries = (rows: any[]): UsagePoint[] => rows.map((row, index) => ({
          time: index * 200,
          GPU_GT_Usage_Percentage: Number(row?.GPU_GT_Usage_Percentage) || 0
        }))

        const seriesMyVideoGpuGtUsagePercentage = toSeries(myVideoJson)
        const seriesVideoJsGpuGtUsagePercentage = toSeries(videoJsJson)

        const toD3DSeries = (rows: any[]): D3DUsagePoint[] => rows.map((row, index) => ({
          time: index * 200,
          GPU_D3D_Usage_Percentage: Number(row?.GPU_D3D_Usage_Percentage) || 0
        }))

        const seriesMyVideoGpuD3DUsagePercentage = toD3DSeries(myVideoJson)
        const seriesVideoJsGpuD3DUsagePercentage = toD3DSeries(videoJsJson)

        chartInstanceRef.current?.destroy()
        chartInstanceRef.current = new Chart(chartRef.current, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'MyVideoPlayer GPU GT Usage (%)',
                data: seriesMyVideoGpuGtUsagePercentage as unknown as any[],
                borderColor: '#ff0000',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHitRadius: 6,
                borderWidth: 2,
                parsing: { xAxisKey: 'time', yAxisKey: 'GPU_GT_Usage_Percentage' }
              },
              {
                label: 'Video.js GPU GT Usage (%)',
                data: seriesVideoJsGpuGtUsagePercentage as unknown as any[],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHitRadius: 6,
                borderWidth: 2,
                parsing: { xAxisKey: 'time', yAxisKey: 'GPU_GT_Usage_Percentage' }
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: 'nearest', intersect: false },
            plugins: {
              tooltip: { enabled: true },
              title: {
                display: true,
                text: 'GPU GT Usage vs Time (200ms interval)'
              },
              legend: { display: true }
            },
            scales: {
              x: { type: 'linear', title: { display: true, text: 'Time (ms)' } },
              y: { title: { display: true, text: 'GPU GT Usage (%)' } }
            }
          }
        })

        if (d3dChartRef.current) {
          d3dChartInstanceRef.current?.destroy()
          d3dChartInstanceRef.current = new Chart(d3dChartRef.current, {
            type: 'line',
            data: {
              datasets: [
                {
                  label: 'MyVideoPlayer GPU D3D Usage (%)',
                  data: seriesMyVideoGpuD3DUsagePercentage as unknown as any[],
                  borderColor: '#ff0000',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  pointRadius: 0,
                  pointHoverRadius: 4,
                  pointHitRadius: 6,
                  borderWidth: 2,
                  parsing: { xAxisKey: 'time', yAxisKey: 'GPU_D3D_Usage_Percentage' }
                },
                {
                  label: 'Video.js GPU D3D Usage (%)',
                  data: seriesVideoJsGpuD3DUsagePercentage as unknown as any[],
                  borderColor: 'rgb(54, 162, 235)',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  pointRadius: 0,
                  pointHoverRadius: 4,
                  pointHitRadius: 6,
                  borderWidth: 2,
                  parsing: { xAxisKey: 'time', yAxisKey: 'GPU_D3D_Usage_Percentage' }
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: false,
              interaction: { mode: 'nearest', intersect: false },
              plugins: {
                tooltip: { enabled: true },
                title: {
                  display: true,
                  text: 'GPU D3D Usage vs Time (200ms interval)'
                },
                legend: { display: true }
              },
              scales: {
                x: { type: 'linear', title: { display: true, text: 'Time (ms)' } },
                y: { title: { display: true, text: 'GPU D3D Usage (%)' } }
              }
            }
          })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load or render chart data', error)
      }
    }
    load()
    return () => {
      controller.abort()
      chartInstanceRef.current?.destroy()
      chartInstanceRef.current = null
      d3dChartInstanceRef.current?.destroy()
      d3dChartInstanceRef.current = null
    }
  }, [])

  return (
    <div className=''>
      <h2>GPU GT Usage Over Time</h2>
      <p>GT usage reflects graphics core load. Comparing these lines shows how efficiently each player uses the GPU’s graphics engine during playback.</p>
      <div className='chart-container wide chart-scroll'>
        <canvas ref={chartRef} />
      </div>

      <h2>GPU D3D Usage Over Time</h2>
      <p>D3D usage reflects Direct3D workload for rendering/presentation. It helps compare rendering overhead and frame delivery between the players.</p>
      <div className='chart-container wide chart-scroll'>
        <canvas ref={d3dChartRef} />
      </div>
    </div>
  )
}

export default App
