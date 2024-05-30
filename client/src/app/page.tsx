"use client"
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './state/store'
import { increment } from './state/counter/counterslice'

function page() {
    const count=useSelector((state:RootState)=>state.counter.value)
    const dispatch =useDispatch()
  return (
    <div><div>{count}</div><button onClick={()=>dispatch(increment())}>click</button></div>
  )
}

export default page