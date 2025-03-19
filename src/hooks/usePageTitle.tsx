import React, { useEffect } from 'react'

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = "LinkedIn | " + title;
  }, []);
}

export default usePageTitle