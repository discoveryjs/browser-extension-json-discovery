//
//  SafariExtensionHandler.swift
//  JsonDiscovery Extension
//
//  Created by Колесников Денис on 04/08/2019.
//  Copyright © 2019 exdis.me. All rights reserved.
//

import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    private enum Messages: String {
        case settings
        case getSettings
        case setSettings
    }
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        
        NSLog("fooooooo")
        
        switch messageName {
        case Messages.getSettings.rawValue:
            page.dispatchMessageToScript(withName: Messages.settings.rawValue, userInfo: [
                SettingsManager.Keys.expandLevel: SettingsManager.shared.expandLevel
            ])
        case Messages.setSettings.rawValue:
            NSLog(userInfo?["expandLevel"] as! String)
            if let expandLevel = userInfo?["expandLevel"] as! NSString? {
                SettingsManager.shared.expandLevel = Int64(expandLevel.intValue)
            }
            
        default:
            break
        }
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

}
