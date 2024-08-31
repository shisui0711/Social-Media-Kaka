import React from 'react'
import { SignalRProvider } from './SignalRProvider'
import { WebRtcProvider } from './WebRtcProvider'

const RealTimeProvder = ({children}:{children:React.ReactNode}) => {
  return (
    <SignalRProvider>
      <WebRtcProvider>
        {children}
      </WebRtcProvider>
    </SignalRProvider>
  )
}

export default RealTimeProvder