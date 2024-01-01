//
//  MainView.swift
//  iSpotify
//
//

import SwiftUI

struct MainView: View {
    
    private let urlPath = "https://open.spotify.com"
    
    var body: some View {
        if let spotifyURL = URL(string: urlPath) {
            VStack {
                WebView(url: spotifyURL, type: .computer)
                    .frame(width: 1, height: 1)
                
                WebView(url: spotifyURL, type: .smartphone)
                    .ignoresSafeArea()
            }
        }else {
            Text("Spotify webpage does not exist")
        }
    }
}

#Preview {
    MainView()
}

