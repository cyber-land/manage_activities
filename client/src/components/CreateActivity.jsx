import React, { useState, useContext } from "react"
import { ActivityCtx } from "../context"
import server_addr from '../config'

const createActivity = (activity, categoryId) => {
  return fetch(`http://${server_addr}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: activity,
      categoryId: categoryId
    })
  })
}

const CreateActivity = () => {
  const [activity, setActivity] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const { UpdateActivities } = useContext(ActivityCtx)
  return (
    <>
      <form className="uk-grid-small" uk-grid="true">
        <div className="uk-width-1-3@s">
          <input type="text" className="uk-input" placeholder="Insert activity name"
            value={activity} onChange={e => setActivity(e.target.value)} />
        </div>
        <div className="uk-width-1-3@s">
          <input type="text" className="uk-input" placeholder="Insert category ID"
            value={categoryId} onChange={e => setCategoryId(e.target.value)} />
        </div>
        <div className="uk-width-1-3@s">
          <button className="uk-button uk-button-default" onClick={e => {
            e.preventDefault()
            createActivity(activity, categoryId).then(r => r.json())
            .then(() => {console.log(`created new activity "${activity}"`); UpdateActivities()})
          }}>create</button>
        </div>
      </form>
    </>
  )
}

export default CreateActivity
