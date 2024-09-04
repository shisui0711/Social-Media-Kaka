'use client'

import React, { useState } from 'react'
import EditPasswordDialog from './EditPasswordDialog'
import { useAuthorization } from '@/providers/AuthorizationProvider'
import DisableTwoFactorButton from './DisableTwoFactorButton'
import EnableTwoFactorDialog from './EnableTwoFactorDialog'

const Page = () => {
  const { user } = useAuthorization();
  const [openEditPasswordDialog, setOpenEditPasswordDialog] = useState(false)
  const [openEnable2FA, setOpenEnable2FA] = useState(false);
  return (
    <section className="flex flex-col gap-3 md:container">
      <div className='flex flex-col gap-2'>
        <h1 className='text-xl font-bold'>Đăng nhập & bảo mật</h1>
        <p>Quản lý mật khẩu và phương thức bảo mật.</p>
        <div className='bg-muted p-3 rounded-2xl max-w-96 flex flex-col gap-2'>
          <EditPasswordDialog user={user} open={openEditPasswordDialog} onOpenChange={setOpenEditPasswordDialog} />
          {/* {user.twoFactorEnabled ? (
            <DisableTwoFactorButton/>
          ):(
            <EnableTwoFactorDialog user={user} open={openEnable2FA} onOpenChange={setOpenEnable2FA}/>
          )} */}
        </div>
      </div>
    </section>
  )
}

export default Page