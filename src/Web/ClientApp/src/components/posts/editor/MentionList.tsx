/* eslint-disable react/display-name */
import UserAvatar from '@/components/UserAvatar'
import { cn } from '@/lib/utils'
import React, {
  forwardRef, useEffect, useImperativeHandle,
  useState,
} from 'react'

export default forwardRef((props:any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index].userName

    if (item) {
      props.command({ id: item })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }:{event:any}) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="flex flex-col bg-card p-3 rounded-2xl">
      {props.items.length
        ? props.items.map((item:any, index:any) => (
          <button
            className={cn('p-2 rounded-2xl',index === selectedIndex && 'bg-background flex gap-2')}
            key={index}
            onClick={() => selectItem(index)}
          >
            <UserAvatar avatarUrl={item.avatarUrl} />
            <div className='flex flex-col items-start'>
              <p>{item.displayName}</p>
              <p className='text-sm text-muted-foreground'>@{item.userName}</p>
            </div>
          </button>
        ))
        : <div className="item">Không tìm thấy ai</div>
      }
    </div>
  )
})