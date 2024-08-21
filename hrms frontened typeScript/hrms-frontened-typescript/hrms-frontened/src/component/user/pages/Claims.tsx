import React from 'react'
import { navbarTitle } from '../../../reducers/authReducer';
import { useDispatch } from 'react-redux'
const Claims : React.FC = () => {
  const dispatch = useDispatch()
  dispatch(
    navbarTitle({
        navTitle: "Claims"}));
  return (
    <div>Claims</div>
  )
}

export default Claims