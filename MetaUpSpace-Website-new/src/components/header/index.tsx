import React, { ReactNode } from 'react'
import Tags from './fragments/Tags'

interface HeaderProps {
  label?: string
  heading: ReactNode
  subheading: string
}

export default function Headers(props: HeaderProps) {
  return (
    <div className='flex flex-col gap-3 items-center justify-center  pt-6'>
      { props.label && <Tags label={props.label} />}
      <div className="text max-w-4xl flex flex-col gap-1 w-full">
        <h3 className='sf font-bold text-[21px] text-center  lg:text-[35px]'>{props.heading}</h3>
        <p className='sf-display opacity-70 text-[14px] md:text-[18px] text-center  max-4xl font-normal'>{props.subheading}</p>
      </div>
    </div>
  )
}
