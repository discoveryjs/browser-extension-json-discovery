//
//  SafariExtensionViewController.swift
//  JsonDiscovery Extension
//
//  Created by Колесников Денис on 04/08/2019.
//  Copyright © 2019 exdis.me. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
