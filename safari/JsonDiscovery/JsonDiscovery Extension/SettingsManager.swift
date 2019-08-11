//
//  SettingsManager.swift
//  JsonDiscovery Extension
//
//  Created by Колесников Денис on 10/08/2019.
//  Copyright © 2019 exdis.me. All rights reserved.
//

import Foundation

class SettingsManager {
    static let shared = SettingsManager()
    
    let sharedSettings = UserDefaults(suiteName: "$(TeamIdentifierPrefix)")!
    
    struct Keys {
        static let expandLevel = "expandLevel"
    }
    
    var expandLevel: Int64 {
        get {
            return sharedSettings.value(forKey: Keys.expandLevel) as? Int64 ?? 3
        }
        set(value) {
            sharedSettings.set(value, forKey: Keys.expandLevel)
            sharedSettings.synchronize()
        }
    }
}
