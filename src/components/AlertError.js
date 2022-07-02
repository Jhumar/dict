import { useEffect } from 'react';

import { Alert } from 'react-bootstrap';

import { useStateValue } from './../contexts/StateProvider';

function AlertError() {
  const [{ error }, dispatch] = useStateValue();

  useEffect(() => {
    return () => {
      dispatch({
        type: 'REMOVE_ERROR'
      })
    }
  }, [])

  return error !== null ? (
    <Alert variant="warning" onClose={() => dispatch({ type: 'REMOVE_ERROR' })} dismissible>
      {error}
    </Alert>
  ) : (
    <></>
  )
}

export default AlertError;