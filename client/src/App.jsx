import React, { useState } from 'react';
import GetCategories from "./components/GetCategories"
import CreateCategory from "./components/CreateCategory"
import DeleteCategories from "./components/DeleteCategories"
import GetActivities from "./components/GetActivities"
import CreateActivity from "./components/CreateActivity"
import DeleteActivities from "./components/DeleteActivities"
import { CategoryCtx, ActivityCtx } from "./context"
import server_addr from './config'

function App() {
  const [categorie, setCategorie] = useState([])
  const [activities, setActivities] = useState([])
  const AggiornaCategorie = () => fetch(`http://${server_addr}/categories`)
    .then(r => r.json()).then(body => setCategorie(body))
  const UpdateActivities = () => fetch(`http://${server_addr}/activities`)
    .then(r => r.json()).then(body => setActivities(body))
  return (
    <main>
      <h1 className="uk-text-center uk-text-bolder uk-text-uppercase">classifier</h1>
      <div className="uk-child-width-expand@s uk-text-center" uk-grid="true">

        <div className="uk-card uk-card-default uk-card-body">
          <CategoryCtx.Provider value={{
            categorie,
            setCategorie,
            AggiornaCategorie, 
            UpdateActivities
          }}>
            <CreateCategory />
            <GetCategories /*categorie={categorie} setCategorie={setCategorie}*/ />
            <DeleteCategories />
          </CategoryCtx.Provider>
        </div>
        <div className="uk-card uk-card-default uk-card-body">
          <ActivityCtx.Provider value={{
            activities,
            setActivities,
            UpdateActivities
          }}>
            <CreateActivity />
            <GetActivities />
            <DeleteActivities />
          </ActivityCtx.Provider>
        </div>
      </div>
    </main>
  );
}

export default App;