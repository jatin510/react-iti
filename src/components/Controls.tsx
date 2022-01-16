import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useNewDandy } from "../containers/_container.hooks"
import s from "./Controls.module.css"

export const Controls = observer(() => {
  return (
    <div className={s.controlsSections}>
      <PizzaPlaceControls />
      <StuffControls />
      <AdminControls />
      <AuthControls />
    </div>
  )
})

export const AdminControls = observer(() => {
  const [authCont] = useNewDandy().auth()
  const [showFatLib1, setShowFatLib1] = useState(false)
  if (!authCont) return <>AUTH is loading</>

  if (authCont.authroization.userType !== "admin") {
    return null
  }

  return (
    <div>
      <br />
      <button onClick={() => setShowFatLib1(true)}>downloads fatlib</button>
      {showFatLib1 && <FatLibData />}
    </div>
  )
})

export const FatLibData = observer(() => {
  const [fatLibData, setShowFatLibData] = useState("")
  const [fatlib] = useNewDandy().fatlib1()
  useEffect(() => {
    console.log("running fatlib hook")
    if (fatlib != null) {
      fatlib.getFatLibData().then((data) => {
        setShowFatLibData("data")
      })
    }
  }, [fatlib])
  if (!fatlib) return <>fatlib is loading</>

  if (fatLibData.length == 0) {
    return null
  }

  return <div>I can haz fat lib data 1</div>
})

export const AuthControls = observer(() => {
  const [authCont] = useNewDandy().auth()
  if (!authCont) return <>AUTH is loading</>
  const { auth } = authCont

  return (
    <div>
      <button onClick={() => auth.changeUser("unauthenticated")}>
        Sign Out
      </button>
      <button onClick={() => auth.changeUser("manager")}>
        Sign in as Manager
      </button>
      <button onClick={() => auth.changeUser("admin")}>Sign in as Admin</button>
    </div>
  )
})

export const StuffControls = observer(() => {
  if (location.search === "") {
    location.href = location.href + "?priceMin=300"
  }

  return (
    <div>
      <button onClick={() => console.log("sdfsd")}>Stuff with URl</button>
    </div>
  )
})

export const PizzaPlaceControls = observer(() => {
  const [kitchenCont] = useNewDandy().kitchen()
  const [pizzaPlaceCont] = useNewDandy().pizzaContainer()
  const [kitchenManipulatorCont] = useNewDandy().kitchenManipulator()
  const [authCont] = useNewDandy().auth()

  if (!pizzaPlaceCont) return <>Pizza Place is loading</>
  if (!kitchenCont) return <>Kitchen is loading</>
  if (!kitchenManipulatorCont) return <>Kitchen is loading</>
  if (!authCont) return <>AUTH is loading</>

  const { orderManager } = kitchenCont
  const { pizzaPlace, diningTables } = pizzaPlaceCont
  const { auth, authroization } = authCont

  const actions = authroization.getAvaliableActions()[authroization.userType]

  return (
    <div>
      {actions.addTables && (
        <button onClick={() => diningTables.addNewTable()}>Add Table</button>
      )}

      <button onClick={() => pizzaPlace.openPizzaPlace()}>
        Open Restaurant
      </button>
      <button onClick={() => pizzaPlace.closePizzaPlace()}>
        Close Pizza Place
      </button>

      <br />
      {actions.upgradeKitchen && (
        <button
          onClick={() =>
            kitchenManipulatorCont.kitchenSizeController.increaseKitchenSize()
          }
        >
          Increase Kitchen Size
        </button>
      )}

      {diningTables.tables.map((table) => {
        return (
          <div key={table.name}>
            table: {table.name}
            {actions.orderPizza && (
              <button
                onClick={() => {
                  orderManager.orderPizza(table)
                }}
              >
                order pizzas
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
})