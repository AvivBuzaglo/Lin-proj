import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { httpService } from './http.service.js'


function compareVersions(current, minimum) {
    const curr = current.split('.').map(Number)
    const min = minimum.split('.').map(Number)
    for(let i = 0; i < 3; i++) {
        if(curr[i] > min[i]) return true
        if(curr[i] < min[i]) return false
    }
    return true
}

export async function checkVersion() {
    if(!Capacitor.isNativePlatform()) return true

    const { version } = await App.getInfo()
    const { minVersion } = await httpService.get('version')

    return compareVersions(version, minVersion)
}

