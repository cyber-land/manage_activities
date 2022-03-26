import React, { useEffect, useState, useContext } from "react"
import { CategoryCtx } from "../context"
import server_addr from '../config'

const CancellaCategoria = (id) => {
  return fetch(`http://${server_addr}/categories/${id}`, { method: "DELETE" })
}

const updateCategory = (id, newName) => {
  //TODO: controllare se il nome è valido
  return fetch(`http://${server_addr}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: newName
    })
  })
}

const CategoriaElement = ({ element }) => {
  const { AggiornaCategorie, UpdateActivities } = useContext(CategoryCtx)
  //visto da tutti i form anche se dovrebbe essere individuale per ognuno
  const [newCategoryName, setnewCategoryName] = useState("")
  return (
    <tr>
      <td>{element.name}</td>
      <td>{element.id}</td>
      <td>
        <div className="uk-inline">
          <button className="uk-button uk-button-default" type="button">update</button>
          <div uk-drop="delay-hide: 100">
            <div className="uk-card uk-card-body uk-card-default">
              <p>Modify element</p>
              <form>
                <input type="text" className="uk-input" placeholder="Insert category name"
                  value={newCategoryName} onChange={e => setnewCategoryName(e.target.value)} />
                <button className="uk-button uk-button-default" onClick={e => {
                  e.preventDefault();
                  updateCategory(element.id, newCategoryName).then(r => r.json())
                    .then(() => { console.log(`modified category with id ${element.id}`); AggiornaCategorie() })
                }}>send</button>
              </form>
            </div>
          </div>
        </div>
      </td>
      <td>
        <button className="uk-button uk-button-default"
          onClick={() => {
            CancellaCategoria(element.id).then(r => r.json()).then(() => {
              AggiornaCategorie();
              UpdateActivities();
              console.log(`deleted category with id "${element.id}"`);
              UIkit.notification({ message: `deleted category with id ${element.id}` }, { pos: 'top-center' });
            })
          }}>
          X
        </button>
      </td>
    </tr>
  )
}

const ElencoCategorie = () => {
  const { categorie, AggiornaCategorie } = useContext(CategoryCtx)

  useEffect(() => { AggiornaCategorie() }, []) //eseguito al primo mount del componente

  return (
    <div>
      <h2>LIST CATEGORIES</h2>
      <button className="uk-button uk-button-default" >Reload</button>
      <table className="uk-table uk-table-striped uk-table-middle uk-table-justify">
        <thead className="uk-text-bolder uk-text-uppercase">
          <tr>
            <td>name</td>
            <td>id</td>
            <td>update</td>
            <td>delete</td>
          </tr>
        </thead>
        <tbody>
          {categorie.map((categoria, pos) => <CategoriaElement key={pos} element={categoria} />)}
        </tbody>
      </table>
    </div>
  )
}

export default ElencoCategorie