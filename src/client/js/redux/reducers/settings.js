import initialState from '../state'
export default function settings (state = initialState.settings, action) {
    switch (action.type) {
        case 'UPDATE_SETTINGS': {
            let newSettings = { ...state, ...action.settings }
            return {
                ...newSettings
            }
        }
        default: {
            return state
        }
    }
}
