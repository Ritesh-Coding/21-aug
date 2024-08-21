import React from 'react'
import "../pages/page.css"
import { EmployeeActivitiesPropType } from '../../../types/user/UserInterface'
const formatDate = (dateString : string) => {
  const options : Intl.DateTimeFormatOptions  = { hour: '2-digit', minute: '2-digit'}
  return new Date(dateString).toLocaleString(undefined,options)
}
const EmployeeActivities : React.FC<EmployeeActivitiesPropType>= (props) => {
  let statusTime =  formatDate(props.statusTime)

  return (
    <div>
        <pre className='dailyActivitiesText'>{props.firstName} {props.lastName}     {props.status}     {statusTime}</pre>
    </div>
  )
}

export default EmployeeActivities