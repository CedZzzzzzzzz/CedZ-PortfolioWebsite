import { afterEach, describe, expect, it, vi } from 'vitest'
import { downscaleImage } from './image'

describe('downscaleImage', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('rejects non-image files before decoding', async () => {
    await expect(
      downscaleImage({ type: 'text/plain' } as File),
    ).rejects.toThrow('Choose an image file')
  })

  it('fits both dimensions within 1000px and encodes JPEG', async () => {
    const close = vi.fn()
    const drawImage = vi.fn()
    const toDataURL = vi.fn(() => 'data:image/jpeg;base64,example')
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({ drawImage })),
      toDataURL,
    }
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => ({ width: 2000, height: 500, close })),
    )
    vi.stubGlobal('document', { createElement: vi.fn(() => canvas) })

    await expect(downscaleImage({ type: 'image/png' } as File)).resolves.toBe(
      'data:image/jpeg;base64,example',
    )
    expect([canvas.width, canvas.height]).toEqual([1000, 250])
    expect(drawImage).toHaveBeenCalledOnce()
    expect(toDataURL).toHaveBeenCalledWith('image/jpeg', 0.82)
    expect(close).toHaveBeenCalledOnce()

    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => ({ width: 1, height: 10000, close })),
    )
    await downscaleImage({ type: 'image/png' } as File)
    expect([canvas.width, canvas.height]).toEqual([1, 1000])
  })

  it('releases the decoded image if drawing is unavailable', async () => {
    const close = vi.fn()
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => ({ width: 100, height: 100, close })),
    )
    vi.stubGlobal('document', {
      createElement: vi.fn(() => ({ getContext: () => null })),
    })
    await expect(downscaleImage({ type: 'image/png' } as File)).rejects.toThrow(
      'Could not draw the image',
    )
    expect(close).toHaveBeenCalledOnce()
  })
})
