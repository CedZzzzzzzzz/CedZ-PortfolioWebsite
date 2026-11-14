import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiBackend } from './apiBackend'
import { byteBackend } from './byteBackend'

afterEach(() => vi.restoreAllMocks())

describe('byteBackend', () => {
  it('keeps explicit mascot and plain-view actions local', async () => {
    const request = vi.spyOn(apiBackend, 'reply')

    await expect(
      byteBackend.reply('feed Byte', { activeFileId: null }),
    ).resolves.toEqual({ text: 'nom nom 🍙', petAction: 'feed' })
    await expect(
      byteBackend.reply('play', { activeFileId: null }),
    ).resolves.toEqual({ text: 'Whoosh!', petAction: 'play' })
    await expect(
      byteBackend.reply('plain view', { activeFileId: null }),
    ).resolves.toMatchObject({ switchToPlain: true })
    expect(request).not.toHaveBeenCalled()
  })

  it('sends natural portfolio questions to the Gemini API backend', async () => {
    const request = vi
      .spyOn(apiBackend, 'reply')
      .mockResolvedValue({ text: 'Marcus studies computer engineering.' })

    await expect(
      byteBackend.reply('What is Marcus studying?', {
        activeFileId: 'about',
      }),
    ).resolves.toEqual({ text: 'Marcus studies computer engineering.' })
    expect(request).toHaveBeenCalledOnce()
  })

  it('falls back to keyword replies when the API fails', async () => {
    vi.spyOn(apiBackend, 'reply').mockRejectedValue(new Error('down'))

    await expect(
      byteBackend.reply('show me your projects', { activeFileId: null }),
    ).resolves.toMatchObject({ openFile: 'projects' })
  })
})
