import { computed } from 'vue'

const nameEntryValid = (theOperation: string ) => computed(() => {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9 ]{1,30}$/
    return regex.test(theOperation)
})
const amountEntryValid = (theOperationAmount: number) => computed(() => {    
    return theOperationAmount > 0
})

const numericalInputCheck = (event: KeyboardEvent) => {
    const char = event.key
    const regex = /^[0-9.]$/
    const inputField: HTMLInputElement = event.target as HTMLInputElement  
    const isInputSelected = inputField.selectionStart !== inputField.selectionEnd

    if (!regex.test(char) ||        
        (char === '.' && inputField.value.includes('.')) || 
        (char === '.' && inputField.value === '') ||
        (char !== '.' && inputField.value === '0' && !isInputSelected)) {
            event.preventDefault()
    }
  }
export { amountEntryValid, nameEntryValid, numericalInputCheck }
