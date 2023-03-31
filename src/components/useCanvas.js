import { useRef, useEffect } from 'react'

/**
 * @param {string} [imageDataURI]
 */
export const useCanvas = (imageDataURI) => {
  /** @type {React.MutableRefObject<HTMLCanvasElement|null>} */
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const context = canvas.getContext('2d')
    if (!context) throw new Error('canvas does not support 2d context')

    if (imageDataURI) {
      const img = new Image()
      img.onload = () => context.drawImage(img, 0, 0)
      img.src = imageDataURI
    } else {
      wipe(canvas)
    }

    let from = /** @type {{ x: number, y: number }?} */ (null)
    let to = /** @type {{ x: number, y: number }?} */ (null)

    canvas.addEventListener('mousedown', event => {
      from = { x: event.offsetX, y: event.offsetY }
    })
    canvas.addEventListener('mousemove', event => {
      if (!from) return
      to = { x: event.offsetX, y: event.offsetY }
      drawLine(context, from, to)
      from = to
    })
    canvas.addEventListener('mouseup', () => { from = to = null })
    canvas.addEventListener('mouseleave', () => { from = to = null })
  }, [canvasRef, imageDataURI])

  return canvasRef
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 */
function drawLine (ctx, from, to) {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.closePath()
  ctx.strokeStyle = 'white'
  ctx.stroke()
}

/**
 * @param {HTMLCanvasElement} canvas
 */
export function wipe (canvas) {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas does not support 2d context')
  context.fillStyle = '#111111'
  context.fillRect(0, 0, canvas.width, canvas.height)
}

/**
 * @param {HTMLCanvasElement} canvas
 */
export function toBlob (canvas) {
  return new Promise(resolve => canvas.toBlob(resolve))
}
