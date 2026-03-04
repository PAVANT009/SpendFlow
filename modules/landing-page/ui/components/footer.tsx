import React from 'react'

export default function Footer() {
  return (
    <div className='px-12 py-7 mx-9 my-10  flex justify-between font-mono font-extralight text-slate-400 border-t border-t-border'>
      <div>
        © 2026 SpendFlow. All rights reserved.
      </div>
      <div className='flex gap-3.5'>
        <div>
            Privacy Policy
        </div>
        <div>
            Terms of Use
        </div>
      </div>
    </div>
  )
}
