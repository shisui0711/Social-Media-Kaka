import { validateRequest } from '@/auth'
import { cookies } from 'next/headers'
import {createUploadthing, FileRouter } from 'uploadthing/next'
import { UploadThingError, UTApi } from 'uploadthing/server'
import { getApiClient } from '@/lib/apiClient'

const f = createUploadthing()
export const fileRouter = {
  avatar: f({
    image: { maxFileSize: '512KB'}
  })
  .middleware(async () => {
    const { user } = await validateRequest()
    if (!user) throw new UploadThingError('Unauthorized')
    return { user }
  })
  .onUploadComplete(async ({ metadata, file}) => {

    // Case remove old avatar
    const oldAvatar = metadata.user.avatarUrl
    if (oldAvatar) {
      const key = oldAvatar.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}`)[1]
      await new UTApi().deleteFiles(key)
    }
    const newAvatarUrl = file.url.replace('/f',`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}`)
    return {avatarUrl: newAvatarUrl}
  }),
  attchement: f({
    image: { maxFileSize: '4MB', maxFileCount: 5},
    video: { maxFileSize: '64MB', maxFileCount: 5}
  })
  .middleware(async () => {
    const { user } = await validateRequest()
    if (!user) throw new UploadThingError('Unauthorized')
    return { userId: user.id }
  })
  .onUploadComplete(async ({ file }) => {
    return { mediaUrl: file.url.replace("/f/",`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`), type: file.type }
  })
}satisfies FileRouter

export type AppFileRouter = typeof fileRouter