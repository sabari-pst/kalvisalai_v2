import { createContext, useContext, useState } from "react"
import { Alert } from "react-bootstrap"

const ConfirmDialog = createContext()

export function ConfirmDialogProvider({ children }) {
	const [state, setState] = useState({ isOpen: false })
	const confirm = (data) => {
	  setState({ ...data, isOpen: true })
	}

  return (
    <ConfirmDialog.Provider value={setState}>
      {children}
      <Alert>
		<h1>Welcome///</h1>
	  </Alert>
    </ConfirmDialog.Provider>
  )
}

export default function PsConfirm() {
  return useContext(ConfirmDialog)
}