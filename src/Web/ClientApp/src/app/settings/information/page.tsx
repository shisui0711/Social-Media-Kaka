'use client'

import { AvatarInput } from '@/app/(authenticated)/(main)/profile/[username]/EditProfileDialog';
import { updateUserInformationSchema, UpdateUserInformationValues } from '@/lib/validation';
import { useAuthorization } from '@/providers/AuthorizationProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

const InformationPage = () => {
  const { user } = useAuthorization()
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const form = useForm<UpdateUserInformationValues>({
    resolver: zodResolver(updateUserInformationSchema),
    defaultValues: {
      username : user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio || "",
      email: user.email
    },
  });

  return (
    <section className="flex flex-col gap-3 items-center">
      <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || '/images/user-placeholder.png'
            }
            onImageCropped={setCroppedAvatar}
          />
      
    </section>
  )
}

export default InformationPage