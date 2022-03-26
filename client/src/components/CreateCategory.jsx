import React, { useState, useContext } from "react"
import { CategoryCtx } from "../context"
import server_addr from '../config'

const CreateCategory = () => {
  const [categoria, setCategoria] = useState("")
  const { AggiornaCategorie } = useContext(CategoryCtx)

  const creaCategoria = () => {
    return fetch(`http://${server_addr}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: categoria
      })
    })
  }

  return (
    <>
      <form className="uk-grid-small" uk-grid="true">
        <div className="uk-width-1-2@s">
          <input type="text" className="uk-input" placeholder="Insert category name"
            value={categoria} onChange={e => setCategoria(e.target.value)} />
        </div>
        <div className="uk-width-1-2@s">
          <button className="uk-button uk-button-default" onClick={e => {
            e.preventDefault()
            creaCategoria().then(r => r.json())
            .then(() => {console.log(`created new category "${categoria}"`); AggiornaCategorie() })
          }}>create</button>
        </div>
      </form>
    </>
  )
}

export default CreateCategory