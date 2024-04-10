import { api } from '@/lib/axios'
import axios from 'axios'
import { Draft, enableMapSet } from 'immer'
import { atom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { selectAtom } from 'jotai/utils'

enableMapSet()

interface Upload {
  file: File
  previewURL: string
  duration?: number
  isRemoving: boolean
}

interface AsyncActionWithProgress {
  isRunning: boolean
  progress: number
  error: boolean
}

type Uploads = Map<string, Upload>

/**
 * State atomsv
 */

export const isRunningAudioConversionAtom = atom(false)
export const isRunningAIGenerationAtom = atom(false)
export const audioConversionQueueAtom = atomWithImmer<Set<string>>(new Set())
export const uploadsAtom = atomWithImmer<Uploads>(new Map())

export const videoUploadAtom = atomWithImmer<
  Map<string, AsyncActionWithProgress>
>(new Map())

export const audioConversionAtom = atomWithImmer<
  Map<string, AsyncActionWithProgress>
>(new Map())

export const audioUploadAtom = atomWithImmer<
  Map<string, AsyncActionWithProgress>
>(new Map())

/**
 * State selectors
 */

export const areUploadsEmptyAtom = atom((get) => {
  return get(uploadsAtom).size === 0
})

export const isThereAnyPendingUploadAtom = atom((get) => {
  return Array.from(get(uploadsAtom).keys()).some((id) => {
    const videoUpload = get(videoUploadAtom).get(id)

    return videoUpload?.isRunning || videoUpload?.error
  })
})

export const summarizedPercentageAtom = atom((get) => {
  const videoUploadProgress = summarizePercentage(
    Array.from(get(videoUploadAtom).values()),
  )

  return videoUploadProgress
})

export const amountOfUploadsAtom = atom((get) => get(uploadsAtom).size)

/**
 * Helpers
 */

function getUploadById(uploadId: string) {
  return selectAtom(uploadsAtom, (state) => {
    const upload = state.get(uploadId)

    if (!upload) {
      throw new Error(`Upload with ID ${uploadId} not found.`)
    }

    return upload
  })
}

function createUpdateUploadDraft(uploadId: string, update: Partial<Upload>) {
  return (draft: Draft<Uploads>) => {
    const upload = draft.get(uploadId)

    if (!upload) {
      throw new Error(`Upload with ID ${uploadId} not found.`)
    }

    Object.assign(upload, update)
  }
}

function summarizePercentage(actions: AsyncActionWithProgress[]) {
  if (actions.length === 0) {
    return 0
  }

  const percentageSum = actions.reduce((acc, action) => {
    return acc + action.progress
  }, 0)

  return percentageSum / actions.length
}

/**
 * Action atoms
 */

export const addUploadAtom = atom(null, (_, set, file: File) => {
  const uploadId = crypto.randomUUID()

  set(uploadsAtom, (draft) =>
    draft.set(uploadId, {
      file,
      previewURL: URL.createObjectURL(file),
      isRemoving: false,
    }),
  )

  set(videoUploadAtom, (draft) =>
    draft.set(uploadId, {
      isRunning: false,
      error: false,
      progress: 0,
    }),
  )

  set(startVideoUploadAtom, uploadId)

  return uploadId
})

export const addUploadsAtom = atom(null, (_, set, files: File[]) => {
  files.forEach((file) => set(addUploadAtom, file))
})

export const updateUploadDurationAtom = atom(
  null,
  (_, set, uploadId: string, duration: number) => {
    set(uploadsAtom, createUpdateUploadDraft(uploadId, { duration }))
  },
)

export const startVideoUploadAtom = atom(
  null,
  async (get, set, uploadId: string) => {
    set(videoUploadAtom, (draft) => {
      const videoUpload = draft.get(uploadId)

      if (!videoUpload) return

      videoUpload.isRunning = true
      videoUpload.progress = 0
      videoUpload.error = false
    })

    const upload = get(getUploadById(uploadId))
    const abortController = new AbortController()

    try {
      const { data } = await api.post('/uploads', { uploadId })

      await axios.put(data.url, upload.file, {
        signal: abortController.signal,
        headers: {
          'Content-Type': upload.file.type,
        },
        onUploadProgress(progressEvent) {
          const progress = progressEvent.progress
            ? Math.round(progressEvent.progress * 100)
            : 0

          set(videoUploadAtom, (draft) => {
            const videoUpload = draft.get(uploadId)

            if (!videoUpload) return

            videoUpload.progress = progress
            videoUpload.isRunning = progress < 100
          })
        },
      })
    } catch (err) {
      set(videoUploadAtom, (draft) => {
        const videoUpload = draft.get(uploadId)

        if (!videoUpload) return

        videoUpload.isRunning = false
        videoUpload.error = true
      })
    }
  },
)

export const deleteUploadAtom = atom(
  null,
  async (get, set, uploadId: string) => {
    set(uploadsAtom, createUpdateUploadDraft(uploadId, { isRemoving: true }))
    set(uploadsAtom, (draft) => draft.delete(uploadId))
  },
)

export const clearUploadsAtom = atom(null, async (get, set) => {
  Array.from(get(uploadsAtom).keys()).forEach((uploadId) => {
    set(deleteUploadAtom, uploadId)
  })
})
